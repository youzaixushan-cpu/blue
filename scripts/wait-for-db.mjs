// Neonのコンピュートはアイドル後にサスペンドされ、次の接続で再起動(コールドスタート)が
// 発生する。この待ち時間が数十秒に及ぶことがある一方、`prisma migrate deploy`の
// advisory lock取得は固定10秒でタイムアウトする(設定変更不可)ため、migrateの前に
// 十分長いタイムアウトでDBの応答を待ってからmigrateを実行する。
import pg from "pg";

const { Client } = pg;
const connectionString =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

const MAX_WAIT_MS = 90_000;
const RETRY_INTERVAL_MS = 3_000;

const start = Date.now();
let lastError;

while (Date.now() - start < MAX_WAIT_MS) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end();
    console.log(`[wait-for-db] DB is ready (${Date.now() - start}ms)`);
    process.exit(0);
  } catch (err) {
    lastError = err;
    await client.end().catch(() => {});
    console.log(
      `[wait-for-db] not ready yet (${Date.now() - start}ms): ${err.message}`,
    );
    await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
  }
}

console.error(`[wait-for-db] DB did not become ready within ${MAX_WAIT_MS}ms`);
console.error(lastError);
process.exit(1);
