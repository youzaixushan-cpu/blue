This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Netlifyへのデプロイ手順

このリポジトリは[Netlify](https://www.netlify.com/)にデプロイする構成になっています（`netlify.toml` / `netlify/functions/`）。

### 必要な環境変数

Netlifyのサイト設定 → Environment variables に以下のキーを設定してください（値はここには書きません）。

- `DATABASE_URL` — Neonの**pooled**接続文字列（ホスト名に`-pooler`を含むもの。`POSTGRES_URL_NON_POOLING`ではない。サーバーレス環境でのコネクション枯渇を避けるため）
- `NEXT_PUBLIC_SITE_URL` — デプロイ後のNetlifyドメイン（例: `https://your-site.netlify.app`）
- `IP_HASH_SALT`
- `CRON_SECRET` — `netlify/functions/sync-wikidata.mts`が呼び出す`/api/admin/sync-wikidata`の認証に使用
- `SEED_SECRET`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST` — `true`（コード側の`trustHost: true`と二重設定だが念のため）
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`（Googleログインを使う場合）

環境変数を追加する際は、**Scopeに「Functions」を含めること**（Builds専用スコープのままだと`netlify/functions/`配下のスケジュール関数から`process.env`で読めません）。

### Google OAuth側の設定

Googleログインを使う場合、[Google Cloud Console](https://console.cloud.google.com/)のOAuthクライアント設定で、**承認済みのリダイレクトURI**にNetlifyの本番ドメインを追加する必要があります（例: `https://your-site.netlify.app/api/auth/callback/google`）。Vercelのドメインのみ登録されている場合はログインが失敗します。

### データベース（Neon）について

このプロジェクトはNeon（PostgreSQL）を使用しています。Netlify Functionsはサーバーレスで実行のたびにコネクションを新規に張る可能性があるため、**`DATABASE_URL`は必ずNeonのpooled connection（PgBouncer経由）の文字列を使ってください**。Neonダッシュボードの「Connection Details」で"Pooled connection"を選んだ接続文字列がこれにあたります。
