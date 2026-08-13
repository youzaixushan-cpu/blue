// スケジュール実行の定義はnetlify.toml側（[functions."sync-wikidata"] schedule = "..."）で行う。
// ここでは実行内容（本体APIの呼び出し）のみを持つ。
// 旧vercel.jsonのcron設定（毎週日曜3:00 UTC）を移植したもの。
async function handler() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!siteUrl || !cronSecret) {
    console.error("sync-wikidata: NEXT_PUBLIC_SITE_URL or CRON_SECRET is not set");
    return new Response("Missing NEXT_PUBLIC_SITE_URL or CRON_SECRET", { status: 500 });
  }

  const res = await fetch(`${siteUrl}/api/admin/sync-wikidata`, {
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
