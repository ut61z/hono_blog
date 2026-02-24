# Repository Guidelines

## プロジェクト構成とモジュール整理
- `app/` は Hono と Honox ベースの本体だよね。`routes/` に各ページ、`components/` に共有 UI、`client.ts` と `server.ts` がフロントとバックのエントリとして並んでるよ。
- `app/routes/posts/*.mdx` にはブログ記事が入ってて、フロントマターで日付やタイトルを宣言するスタイルだよ。新規記事はここに追加してね。
- 型定義や共通ロジックは `app/types.ts` と `app/global.d.ts` にまとまってるから、再利用したい値はここに寄せてほしいな。
- 静的アセットは `public/` にまとめて配置して、Vite がそのまま配信するって感じ。補助資料は `doc/` に置いてあるから、参照すると安心かな。
- ルートレベルの `vite.config.ts` と `vitest.config.ts` がビルドとテスト設定を握ってるし、`wrangler.toml` が Cloudflare Workers デプロイの設定を決めてるよ。

## ビルド・テスト・開発コマンド
- `pnpm dev` : Vite の開発サーバーを起動してホットリロードするよ。初回は `pnpm install` を忘れないでね。
- `pnpm build` : 静的アセットと Cloudflare Workers バンドルを作る本番ビルドだよ。
- `pnpm preview` : Wrangler のエミュレーターで本番挙動を確認できるよ。
- `pnpm deploy` : 本番ビルドを走らせてから `wrangler deploy` まで一気に進めるから、環境変数は Wrangler 側でセットしておいてほしいな。
- `pnpm test` / `pnpm test:run` / `pnpm test:ui` : Vitest を通常実行、CI 用一括実行、UI ランチャーで起動するパターンだよ。

## コーディングスタイルと命名
- TypeScript と TSX は二スペースインデントをキープして、Prettier 既定の整形に合わせてるよ。未使用 import はこまめに消してね。
- コンポーネント名とファイル名はパスカルケース、ユーティリティ関数はキャメルケースでそろえてるし、MDX 記事ファイルは `YYYYMMDD-title.mdx` 形式がわかりやすいよ。
- CSS in JS よりユーティリティクラス中心で書く方針だから、Tailwind 風のクラス名を再利用してね。
- `tsconfig.json` の `strict` オプションがオンだから、型は明示的に書いて型安全をキープしてほしいな。

## テスト指針
- テストは Vitest と Testing Library DOM を使って、`app/` 配下に `*.test.ts` か `*.test.tsx` を並べる流れが安心だよ。ファイルは対象と同じディレクトリに置くと見つけやすいよね。
- DOM をテストするときは `happy-dom` か `jsdom` を切り替えて、アクセシビリティ属性とユーザー操作をカバーしておいてほしいな。
- 主要コンポーネントはレンダリングテストとロジック検証をペアで書いて、CI 目線では失敗ゼロを守る感じで行こう。
- カバレッジ計測が必要なときは `pnpm test -- --coverage` を追加実行して、閾値は 80% 以上を目安にキープしてね。

## コミットとプルリク運用
- 過去ログを見ると `feat: ...` や `refactor: ...` みたいに Conventional Commits をベースにした書き方が多いよ。短く要点をまとめて、ブランチ単位でスコープを意識してね。
- プルリクは目的、変更点、テスト結果、関連 issue を明記して、UI 変更があるならスクリーンショットも添えてほしいな。
- レビュー前に `pnpm test:run` と `pnpm build` を通して、Wrangler 用のシークレットや設定差分が無いかチェックするのがマナーだよ。

## デプロイと設定のヒント
- Cloudflare へ出す前に `wrangler.toml` の `name` や `account_id` を環境ごとに確認して、ステージングと本番で衝突しないようにしてね。
- 環境変数は Cloudflare Dashboard か `wrangler secret put` で管理して、ローカル `.env` はコミットしないのが鉄則だよ。
- 新しい記事を出すときはビルドを走らせてリンク切れを `pnpm build` でチェックしてからマージするのが安全って感じ。
