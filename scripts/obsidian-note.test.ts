import { describe, expect, it } from 'vitest'
import { convertObsidianSyntax, toPost } from './obsidian-note'

describe('convertObsidianSyntax', () => {
  it('wikilink は表示テキストだけ残し、埋め込みとコメントは消す', () => {
    expect(convertObsidianSyntax('[[dir/note#h]] と [[note|別名]] ![[img.png]]%%memo%%')).toBe('note と 別名 ')
  })
})

describe('toPost', () => {
  it('ファイル名から date を作り、frontmatter を title と date だけにする', () => {
    const note = '---\ntags:\n  - x\n---\n# タイトル: です\n\n本文 {a} <b'

    expect(toPost(note, '20261024')).toEqual({
      title: 'タイトル: です',
      fileName: '20261024.md',
      content: '---\ntitle: "タイトル: です"\ndate: 2026-10-24\n---\n\n# タイトル: です\n\n本文 {a} <b\n',
    })
  })

  it('frontmatter の title を見出しより優先する', () => {
    expect(toPost('---\ntitle: 表題\n---\n# 見出し', '20261024').title).toBe('表題')
  })

  it('ファイル名が yyyymmdd でなければエラー', () => {
    expect(() => toPost('# t', 'memo')).toThrow('yyyymmdd')
  })

  it('タイトルが取れなければエラー', () => {
    expect(() => toPost('本文だけ', '20261024')).toThrow('title')
  })
})
