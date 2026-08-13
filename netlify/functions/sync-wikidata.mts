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

  const startedAt = Date.now();
  const res = await fetch(`${base}/api/admin/sync-wikidata`, {
    headers: { Authorization: `Bearer ${cronSecret}` },
  });
  const durationMs = Date.now() - startedAt;

  const body = await res.text();
  if (!res.ok) {
    // Response自体はレスポンスとして返せてしまうため、呼び出しが「失敗」だったことを
    // Netlifyの関数ログ・エラー計測に残すには例外を投げる必要がある。
    throw new Error(`sync-wikidata: request failed (${res.status}) after ${durationMs}ms: ${body}`);
  }

  const summary = parseSummary(body);
  const summaryText = summary
    ? `total=${summary.total}, changed=${summary.changed}, errored=${summary.errored}`
    : "(応答のサマリー解析に失敗)";
  console.log(`sync-wikidata: succeeded in ${durationMs}ms (${summaryText})`);

  // レスポンス自体は200でも、選手単位でエラーが出ている場合があるので別途警告を出す
  // （個々のWikidataエントリー不備は許容範囲のため、関数全体は失敗扱いにしない）。
  if (summary && summary.errored > 0) {
    console.warn(`sync-wikidata: ${summary.errored} player(s) failed to sync, see API response for details`);
  }

  return new Response(body);
}

function parseSummary(body: string): { total: number; changed: number; errored: number } | null {
  try {
    const data = JSON.parse(body) as { total?: number; changed?: number; errored?: number };
    if (typeof data.total !== "number") return null;
    return { total: data.total, changed: data.changed ?? 0, errored: data.errored ?? 0 };
  } catch {
    return null;
  }
}

export default handler;
