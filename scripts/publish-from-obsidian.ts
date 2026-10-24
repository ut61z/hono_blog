import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { glob, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { toPost, type Post } from './obsidian-note.ts'

const BLOG_DIR_IN_VAULT = '11_blog'
const POSTS_DIR = 'app/routes/posts'

const vault = process.env.OBSIDIAN_VAULT
if (!vault) throw new Error('環境変数 OBSIDIAN_VAULT に vault のパスを設定して')

const posts: Post[] = []
for await (const path of glob('*.md', { cwd: join(vault, BLOG_DIR_IN_VAULT) })) {
  const note = await readFile(join(vault, BLOG_DIR_IN_VAULT, path), 'utf8')
  posts.push(toPost(note, basename(path, '.md')))
}

for (const { fileName } of posts) {
  if (existsSync(join(POSTS_DIR, `${fileName}x`))) throw new Error(`同じ日付の .mdx 記事がすでにある: ${fileName}x`)
}

for (const post of posts) await writeFile(join(POSTS_DIR, post.fileName), post.content)

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' })

const changed = git('status', '--porcelain', '--', POSTS_DIR).trim()
if (!changed) {
  console.log('変更なし')
  process.exit(0)
}
console.log(changed)

const titles = posts.filter((p) => changed.includes(p.fileName)).map((p) => p.title)
git('add', '--', POSTS_DIR)
git('commit', '-m', `feat: ${titles.join(', ')}`)
git('push')
console.log('push した。Cloudflare の Git 連携で deploy される')
