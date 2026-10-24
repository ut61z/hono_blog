export type Post = {
  title: string
  fileName: string
  content: string
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/

export function parseFrontmatter(note: string): { fields: Record<string, string>; body: string } {
  const match = note.match(FRONTMATTER)
  if (!match) return { fields: {}, body: note }

  const fields: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const field = line.match(/^(\w+):\s*(.*)$/)
    if (field) fields[field[1]] = field[2].trim().replace(/^(["'])(.*)\1$/, '$2')
  }
  return { fields, body: note.slice(match[0].length) }
}

// 公開先にリンク先ノートは無いので、wikilink は表示テキストだけ残す
export function convertObsidianSyntax(body: string): string {
  return body
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[[^\]]*\]\]/g, '')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target: string, alias?: string) =>
      alias ?? target.split('#')[0].split('/').pop()!,
    )
}

export function toPost(note: string, noteName: string): Post {
  const yyyymmdd = noteName.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (!yyyymmdd) throw new Error(`${noteName}: ファイル名は yyyymmdd.md にして`)
  const date = `${yyyymmdd[1]}-${yyyymmdd[2]}-${yyyymmdd[3]}`

  const { fields, body } = parseFrontmatter(note)
  const title = fields.title || body.match(/^# (.+)$/m)?.[1].trim()
  if (!title) throw new Error(`${noteName}: frontmatter の title か本文の # 見出しが要る`)

  return {
    title,
    fileName: `${noteName}.md`,
    content: `---\ntitle: ${JSON.stringify(title)}\ndate: ${date}\n---\n\n${convertObsidianSyntax(body).trim()}\n`,
  }
}
