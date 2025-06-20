import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title, frontmatter }) => {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        {<title>{title ?? frontmatter?.title ?? 'ut61z\'s Blog'}</title>}
        <link rel='stylesheet' href='/static/style.css' />
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css' />
      </head>
      <body>
        <header>
          <h1>
            <a href='/'>ut61z's Blog</a>
          </h1>
        </header>
        <main>
          <p>{frontmatter?.date}</p>
          <article>{children}</article>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} ut61z's Blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
})
