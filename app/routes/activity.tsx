import type { Meta } from '../types';
import { ContributionGrid } from '../components/ContributionGrid';

export default function Activity() {
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/*.mdx', {
    eager: true,
  })
  const sortedPosts = Object.entries(posts).sort(([a], [b]) => b.localeCompare(a))
  
  // Get years from 2022 to current year
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = 2022; year <= currentYear; year++) {
    years.push(year)
  }
  
  // Calculate total posts
  const totalPosts = sortedPosts.length
  
  // Calculate posts per year
  const postsPerYear = new Map<number, number>()
  sortedPosts.forEach(([_, module]) => {
    if (module.frontmatter?.date) {
      const year = new Date(module.frontmatter.date).getFullYear()
      postsPerYear.set(year, (postsPerYear.get(year) || 0) + 1)
    }
  })
  
  return (
    <div>
      <h2>Contributions</h2>
      <div class="activity-summary">
        <p>Total Posts: <strong>{totalPosts}</strong> posts</p>
        <div class="yearly-summary">
          {years.map(year => (
            <span class="year-stat">
              {year}: {postsPerYear.get(year) || 0} posts
            </span>
          ))}
        </div>
      </div>
      
      {years.reverse().map(year => (
        <ContributionGrid posts={sortedPosts} year={year} />
      ))}
    </div>
  )
}