import type { Meta } from '../types';

export default function Top() {
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/*.mdx', {
    eager: true,
  })
  const sortedPosts = Object.entries(posts).sort(([a], [b]) => b.localeCompare(a))
  return (
    <div>
      <h2>Posts</h2>
      <ul class='article-list'>
        {sortedPosts.map(([id, module]) => {
          if (module.frontmatter) {
            return (
              <li>
                <a href={`${id.replace(/\.mdx$/, '')}`}>{module.frontmatter.title}</a>
                <span> - {module.frontmatter.date}</span>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
