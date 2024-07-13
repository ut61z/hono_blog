import pages from '@hono/vite-cloudflare-pages'
import mdx from '@mdx-js/rollup';
import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    honox({ devServer: { adapter } }),
    pages(),
    mdx({
      jsxImportSource: 'hono/jsx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]
    })
  ]
})
