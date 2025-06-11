# HonoX Blog

A modern blog application built with HonoX and deployed on Cloudflare Workers.

## Features

- **HonoX Framework**: Meta-framework for Hono with file-based routing
- **MDX Support**: Write blog posts in MDX format with frontmatter
- **Cloudflare Workers**: Serverless deployment with global edge network
- **Fast SSR**: Server-side rendering with optional client-side hydration
- **TypeScript**: Full TypeScript support throughout the application

## Tech Stack

- **Framework**: [HonoX](https://github.com/honojs/honox) v0.1.42
- **Runtime**: [Hono](https://hono.dev/) v4.7.11
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Build Tool**: [Vite](https://vitejs.dev/) v5.4.19
- **Content**: MDX with frontmatter support
- **Styling**: CSS (static assets via Workers Assets)

## Project Structure

```
├── app/
│   ├── routes/           # File-based routing
│   │   ├── _renderer.tsx # Global JSX renderer
│   │   ├── index.tsx     # Homepage
│   │   └── posts/        # Blog posts (MDX)
│   ├── server.ts         # Server entry point
│   ├── client.ts         # Client hydration
│   └── types.ts          # TypeScript definitions
├── public/
│   ├── favicon.ico
│   └── static/
│       └── style.css     # Global styles
├── wrangler.toml         # Cloudflare Workers configuration
├── vite.config.ts        # Vite configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hono_blog

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# The application will be available at http://localhost:5173
```

### Building

```bash
# Build for production
pnpm build

# Preview the built application locally
pnpm preview
```

## Deployment

### Cloudflare Workers

1. Install Wrangler CLI (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy to Cloudflare Workers:
   ```bash
   pnpm deploy
   ```

### Configuration

Edit `wrangler.toml` to customize your deployment:

```toml
name = "hono-blog"              # Your Worker name
main = "./dist/index.js"        # Entry point
compatibility_date = "2024-04-01"

[assets]
directory = "./dist"            # Static assets directory
binding = "ASSETS"              # Assets binding name

[vars]
NODE_ENV = "production"         # Environment variables
```

## Writing Blog Posts

Create new blog posts in the `app/routes/posts/` directory using MDX format:

```mdx
---
title: "Your Post Title"
date: "2024-01-01"
---

# Your Post Title

Your content goes here...
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview built application
- `pnpm deploy` - Build and deploy to Cloudflare Workers

## License

This project is licensed under the MIT License.