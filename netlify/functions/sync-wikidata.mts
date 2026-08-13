// スケジュール実行の定義はnetlify.toml側（[functions."sync-wikidata"] schedule = "..."）で行う。
// 旧vercel.jsonのcron設定（毎週日曜3:00 UTC）を移植したもの。
// HTTP経由で/api/admin/sync-wikidataを叩くのではなく、Netlify Scheduled Functionsの
// 30秒実行時間制限に収めるため、処理本体（syncAllPlayers）を直接importして呼び出す。
// 手動実行用に/api/admin/sync-wikidata自体（CRON_SECRET認証つき）は別途残っている。
import { syncAllPlayers } from "../../lib/sync-wikidata";

async function handler() {
  const startedAt = Date.now();
  const results = await syncAllPlayers();
  const durationMs = Date.now() - startedAt;

  const total = results.length;
  const changed = results.filter((r) => r.clubChanged).length;
  const errored = results.filter((r) => r.error).length;

  console.log(`sync-wikidata: succeeded in ${durationMs}ms (total=${total}, changed=${changed}, errored=${errored})`);

  // レスポンス自体は正常終了でも、選手単位でエラーが出ている場合があるので別途警告を出す
  // （個々のWikidataエントリー不備は許容範囲のため、関数全体は失敗扱いにしない）。
  if (errored > 0) {
    console.warn(`sync-wikidata: ${errored} player(s) failed to sync`, JSON.stringify(results.filter((r) => r.error)));
  }

  return new Response(JSON.stringify({ total, changed, errored, durationMs }));
}

export default handler;
