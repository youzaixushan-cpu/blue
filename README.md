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

### 手順

1. **まず検証用ブランチでデプロイ確認してからmainにマージする**

   Next.js 16とNetlifyの組み合わせは実績が少なく未検証のリスクがあるため、`main`に
   マージしてから初デプロイするのではなく、**`migrate/leave-vercel`ブランチをNetlifyの
   Production branchに指定してデプロイ検証し、成功を確認してから`main`にマージする**こと。

   a. Netlifyでサイトを作成する（Production branchを一時的に`migrate/leave-vercel`にする）
   b. Site configuration → Change site name でサイト名を確定させる
   c. 下記「必要な環境変数」を設定する（`NEXT_PUBLIC_SITE_URL`にはbで確定したドメインを登録する）
   d. Deploys → Trigger deploy → **Clear cache and deploy site** で再ビルドする
   e. デプロイ結果（ページ表示・ログイン・`robots.txt`・OGP画像など）を確認し、
      問題なければ`main`にマージし、Netlify側のProduction branchを`main`に戻す

2. **`NEXT_PUBLIC_SITE_URL`を変更した時は必ずキャッシュクリア再ビルドする**

   `NEXT_PUBLIC_`接頭辞の環境変数はビルド時にバンドルへ埋め込まれるため、値を追加・変更
   しただけでは反映されない。環境変数を保存した後、必ず **Deploys → Trigger deploy →
   Clear cache and deploy site** から再ビルドすること。これを飛ばすと`robots.txt`の
   SitemapやOGP画像のURLが`http://localhost:3000`のままになる（過去に本番で実際に
   発生した障害と同じ現象）。

### 必要な環境変数

Netlifyのサイト設定 → Environment variables に以下のキーを設定してください（値はここには書きません）。

- `DATABASE_URL` — Neonの**pooled**接続文字列（ホスト名に`-pooler`を含むもの。`POSTGRES_URL_NON_POOLING`ではない。サーバーレス環境でのコネクション枯渇を避けるため）
- `NEXT_PUBLIC_SITE_URL` — デプロイ後のNetlifyドメイン（例: `https://your-site.netlify.app`）
- `IP_HASH_SALT`
- `CRON_SECRET` — Scheduled Function自体はこの変数を使わない（`syncAllPlayers()`を直接importして実行するため）。手動実行用に残している`/api/admin/sync-wikidata`エンドポイントの認証にのみ使う
- `SEED_SECRET`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST` — `true`（コード側の`trustHost: true`と二重設定だが念のため）
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`（Googleログインを使う場合）

環境変数を追加する際は、**Scopeに「Functions」を含めること**（Builds専用スコープのままだと`netlify/functions/`配下のスケジュール関数から`process.env`で読めません）。

### Google OAuth側の設定

Googleログインを使う場合、[Google Cloud Console](https://console.cloud.google.com/)のOAuthクライアント設定で、**承認済みのリダイレクトURI**にNetlifyの本番ドメインを追加する必要があります（例: `https://your-site.netlify.app/api/auth/callback/google`）。Vercelのドメインのみ登録されている場合はログインが失敗します。

### データベース（Neon）について

このプロジェクトはNeon（PostgreSQL）を使用しています。Netlify Functionsはサーバーレスで実行のたびにコネクションを新規に張る可能性があるため、**`DATABASE_URL`は必ずNeonのpooled connection（PgBouncer経由）の文字列を使ってください**。Neonダッシュボードの「Connection Details」で"Pooled connection"を選んだ接続文字列がこれにあたります。

### Scheduled Functionsの制約

`netlify/functions/sync-wikidata.mts`（毎週日曜3:00 UTCにWikidata同期を実行）は通常のScheduled Functionとして実装されていますが、Netlifyには以下の制約があります。

- **実行時間の上限は30秒**。超えると途中で打ち切られる。この関数は`lib/sync-wikidata.ts`の`syncAllPlayers()`を直接呼び出し、対象選手（現在39人）を4件ずつ並列処理することで実測11〜13秒程度に収めている。対象選手数が大きく増える場合は`CONCURRENCY`定数の調整や、それでも収まらなければBackground Function化を検討すること
- **無料プラン(Free)のFunction呼び出しは月125,000回まで**。この関数自体は週1回の実行なので影響しないが、他のAPI Routes（`/api/community/submissions`等、アクセスのたびに実行されるもの）も同じ上限を共有する点に注意
- **Scheduled Functionsはpublished deploy（Production branchとして公開されたデプロイ）でのみ自動実行される**。Deploy Previews/ブランチデプロイでは指定した時刻になっても自動では動かない。動作確認したい場合は、サイトダッシュボードの**Functions**タブから対象の関数（`sync-wikidata`）を開き、**Run now**ボタンで手動実行できる（`/api/admin/sync-wikidata`をCRON_SECRET付きで叩く方法と合わせて、動作確認の手段は2通りある）
