import type { Meta } from '../types';

function ContributionGrid({ posts, year }: { posts: Array<[string, { frontmatter: Meta }]>, year: number }) {
  // Create a map of week numbers to post counts for the specified year
  const postCounts = new Map<number, number>()
  posts.forEach(([_, module]) => {
    if (module.frontmatter?.date) {
      const postDate = new Date(module.frontmatter.date)
      if (postDate.getFullYear() === year) {
        const weekNumber = getWeekNumber(postDate)
        postCounts.set(weekNumber, (postCounts.get(weekNumber) || 0) + 1)
      }
    }
  })
  
  // Generate all weeks of the year (52 weeks)
  const weeks = []
  for (let week = 1; week <= 52; week++) {
    const count = postCounts.get(week) || 0
    const weekStart = getDateFromWeek(week, year)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    weeks.push({
      week,
      count,
      level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count >= 3 ? 3 : 2,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0]
    })
  }
  
  return (
    <div class="contribution-grid">
      <h3>{year}</h3>
      <div class="grid-container">
        {weeks.map((week) => (
          <div
            class={`grid-cell level-${week.level}`}
            title={`第${week.week}週 (${week.weekStart} - ${week.weekEnd}): ${week.count}件の投稿`}
          />
        ))}
      </div>
      <div class="grid-legend">
        <span>Less</span>
        <div class="legend-cells">
          <div class="grid-cell level-0" />
          <div class="grid-cell level-1" />
          <div class="grid-cell level-2" />
          <div class="grid-cell level-3" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getDateFromWeek(week: number, year: number): Date {
  const jan1 = new Date(year, 0, 1)
  const dayOfWeek = jan1.getDay()
  const firstWeekStart = new Date(jan1)
  firstWeekStart.setDate(jan1.getDate() - dayOfWeek + 1)
  
  const weekStart = new Date(firstWeekStart)
  weekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7)
  return weekStart
}

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