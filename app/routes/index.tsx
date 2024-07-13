import type { Meta } from './types';
import BaseLayout from '../components/layout';

export default function Top() {
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/*.mdx', {
    eager: true,
  })
  return (
    <BaseLayout>
      <ul class='article-list'>
        {Object.entries(posts).map(([id, module]) => {
          if (module.frontmatter) {
            return (
              <li>
                <a href={`${id.replace(/\.mdx$/, '')}`}>{module.frontmatter.title}</a>
              </li>
            )
          }
        })}
      </ul>
    </BaseLayout>
  )
}
