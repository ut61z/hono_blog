import type { Meta } from '../types';

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

export function ContributionGrid({ posts, year }: { posts: Array<[string, { frontmatter: Meta }]>, year?: number }) {
  const targetYear = year || new Date().getFullYear()
  
  const postCounts = new Map<number, number>()
  posts.forEach(([_, module]) => {
    if (module.frontmatter?.date) {
      const postDate = new Date(module.frontmatter.date)
      if (postDate.getFullYear() === targetYear) {
        const weekNumber = getWeekNumber(postDate)
        postCounts.set(weekNumber, (postCounts.get(weekNumber) || 0) + 1)
      }
    }
  })
  
  const weeks = []
  for (let week = 1; week <= 52; week++) {
    const count = postCounts.get(week) || 0
    const weekStart = getDateFromWeek(week, targetYear)
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
      <h3>{targetYear}</h3>
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