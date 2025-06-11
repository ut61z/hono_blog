import build from '@hono/vite-build/cloudflare-workers'
import mdx from '@mdx-js/rollup';
import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    honox({ devServer: { adapter } }),
    build(),
    mdx({
      jsxImportSource: 'hono/jsx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank' }],
        rehypeHighlight
      ]
    })
  ]
})
