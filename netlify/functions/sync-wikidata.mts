// スケジュール実行の定義はnetlify.toml側（[functions."sync-wikidata"] schedule = "..."）で行う。
// ここでは実行内容（本体APIの呼び出し）のみを持つ。
// 旧vercel.jsonのcron設定（毎週日曜3:00 UTC）を移植したもの。
async function handler() {
  // NEXT_PUBLIC_SITE_URLの設定漏れでcronが静かに失敗しないよう、Netlifyが
  // Functionsランタイムに自動注入する本番ドメイン（process.env.URL）にフォールバックする。
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!base) {
    throw new Error("sync-wikidata: NEXT_PUBLIC_SITE_URL and URL are both unset, cannot resolve target host");
  }
  if (!cronSecret) {
    throw new Error("sync-wikidata: CRON_SECRET is not set");
  }

  const res = await fetch(`${base}/api/admin/sync-wikidata`, {
    headers: { Authorization: `Bearer ${cronSecret}` },
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`sync-wikidata: request failed (${res.status}): ${body}`);
    return new Response(body, { status: 502 });
  }

  console.log(`sync-wikidata: completed: ${body}`);
  return new Response(body);
}

export default handler;
