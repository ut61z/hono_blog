# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (builds both client and server)
- `pnpm preview` - Preview built app using Wrangler Workers dev server
- `pnpm deploy` - Build and deploy to Cloudflare Workers

## Architecture

This is a **HonoX** blog application built for **Cloudflare Workers** deployment:

- **Framework**: HonoX (meta-framework for Hono) with JSX rendering
- **Deployment Target**: Cloudflare Workers
- **Build Tool**: Vite with Cloudflare dev server adapter
- **Content**: MDX files with frontmatter for blog posts

### Key Structure

- `app/server.ts` - Server entry point using HonoX
- `app/client.ts` - Client-side hydration entry point
- `app/routes/` - File-based routing directory
  - `_renderer.tsx` - Global JSX renderer with layout
  - `index.tsx` - Homepage that lists all blog posts
  - `posts/*.mdx` - Individual blog post files
- `app/types.ts` - TypeScript definitions for frontmatter metadata

### MDX Integration

Blog posts are written in MDX format with YAML frontmatter:
- Frontmatter contains `title` and `date` fields
- Posts are automatically discovered via `import.meta.glob()` pattern
- Remark plugins handle frontmatter parsing (`remark-frontmatter`, `remark-mdx-frontmatter`)

### JSX Configuration

- Uses Hono's JSX implementation (`jsxImportSource: "hono/jsx"`)
- Server-side rendering with optional client-side hydration
- Global layout defined in `_renderer.tsx` handles title, metadata, and common structure

### Cloudflare Integration

- `wrangler.toml` configures Cloudflare Workers deployment with entry point at `./dist/index.js`
- Uses `@hono/vite-dev-server/cloudflare` adapter for local development
- Built files output to `./dist` directory for Workers deployment