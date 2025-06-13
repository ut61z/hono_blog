import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContributionGrid } from '../ContributionGrid'
import type { Meta } from '../../types'

// Mock DOM manipulation
const mockDocument = {
  createElement: vi.fn(() => ({
    setAttribute: vi.fn(),
    classList: { add: vi.fn() },
    style: {},
    innerHTML: '',
  })),
}

global.document = mockDocument as any

describe('ContributionGrid', () => {
  const mockPosts: Array<[string, { frontmatter: Meta }]> = [
    ['post1.mdx', { frontmatter: { title: 'Post 1', date: '2023-01-15' } }],
    ['post2.mdx', { frontmatter: { title: 'Post 2', date: '2023-01-22' } }],
    ['post3.mdx', { frontmatter: { title: 'Post 3', date: '2023-02-10' } }],
    ['post4.mdx', { frontmatter: { title: 'Post 4', date: '2023-02-10' } }], // Same week as post3
    ['post5.mdx', { frontmatter: { title: 'Post 5', date: '2022-12-25' } }], // Different year
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render contribution grid with correct year', () => {
    const component = ContributionGrid({ posts: mockPosts, year: 2023 })
    
    expect(component).toBeDefined()
    expect(component.type).toBe('div')
    expect(component.props.class).toBe('contribution-grid')
    
    // Check if h3 contains the year
    const h3Element = component.props.children[0]
    expect(h3Element.type).toBe('h3')
    expect(h3Element.props.children).toBe(2023)
  })

  it('should use current year when year is not provided', () => {
    const currentYear = new Date().getFullYear()
    const component = ContributionGrid({ posts: mockPosts })
    
    const h3Element = component.props.children[0]
    expect(h3Element.props.children).toBe(currentYear)
  })

  it('should generate 52 weeks of grid cells', () => {
    const component = ContributionGrid({ posts: mockPosts, year: 2023 })
    
    const gridContainer = component.props.children[1]
    expect(gridContainer.props.class).toBe('grid-container')
    expect(gridContainer.props.children).toHaveLength(52)
  })

  it('should calculate correct contribution levels', () => {
    const component = ContributionGrid({ posts: mockPosts, year: 2023 })
    
    const gridContainer = component.props.children[1]
    const gridCells = gridContainer.props.children
    
    // Check that grid cells have correct structure
    expect(gridCells[0].type).toBe('div')
    expect(gridCells[0].props.class).toMatch(/^grid-cell level-\d$/)
    expect(gridCells[0].props.title).toMatch(/^第\d+週/)
  })

  it('should filter posts by year correctly', () => {
    const component2022 = ContributionGrid({ posts: mockPosts, year: 2022 })
    const component2023 = ContributionGrid({ posts: mockPosts, year: 2023 })
    
    const gridContainer2022 = component2022.props.children[1]
    const gridContainer2023 = component2023.props.children[1]
    
    // Both should have 52 weeks
    expect(gridContainer2022.props.children).toHaveLength(52)
    expect(gridContainer2023.props.children).toHaveLength(52)
  })

  it('should render legend with correct levels', () => {
    const component = ContributionGrid({ posts: mockPosts, year: 2023 })
    
    const legend = component.props.children[2]
    expect(legend.props.class).toBe('grid-legend')
    
    const legendCells = legend.props.children[1]
    expect(legendCells.props.class).toBe('legend-cells')
    expect(legendCells.props.children).toHaveLength(4) // levels 0-3
    
    // Check legend cell classes
    const levels = legendCells.props.children
    expect(levels[0].props.class).toBe('grid-cell level-0')
    expect(levels[1].props.class).toBe('grid-cell level-1')
    expect(levels[2].props.class).toBe('grid-cell level-2')
    expect(levels[3].props.class).toBe('grid-cell level-3')
  })

  it('should handle empty posts array', () => {
    const component = ContributionGrid({ posts: [], year: 2023 })
    
    expect(component).toBeDefined()
    const gridContainer = component.props.children[1]
    expect(gridContainer.props.children).toHaveLength(52)
    
    // All cells should be level-0 (no contributions)
    const allCells = gridContainer.props.children
    allCells.forEach((cell: any) => {
      expect(cell.props.class).toBe('grid-cell level-0')
    })
  })

  it('should handle posts without frontmatter', () => {
    const postsWithoutFrontmatter: Array<[string, { frontmatter?: Meta }]> = [
      ['post1.mdx', { frontmatter: { title: 'Post 1', date: '2023-01-15' } }],
      ['post2.mdx', {}], // No frontmatter
      ['post3.mdx', { frontmatter: { title: 'Post 3', date: '2023-02-10' } }],
    ]
    
    const component = ContributionGrid({ posts: postsWithoutFrontmatter, year: 2023 })
    
    expect(component).toBeDefined()
    const gridContainer = component.props.children[1]
    expect(gridContainer.props.children).toHaveLength(52)
  })

  it('should handle posts without date', () => {
    const postsWithoutDate: Array<[string, { frontmatter: Meta }]> = [
      ['post1.mdx', { frontmatter: { title: 'Post 1', date: '2023-01-15' } }],
      ['post2.mdx', { frontmatter: { title: 'Post 2' } as any }], // No date
    ]
    
    const component = ContributionGrid({ posts: postsWithoutDate, year: 2023 })
    
    expect(component).toBeDefined()
    const gridContainer = component.props.children[1]
    expect(gridContainer.props.children).toHaveLength(52)
  })
})