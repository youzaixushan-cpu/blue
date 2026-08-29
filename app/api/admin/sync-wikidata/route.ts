import { NextResponse } from "next/server";
import { syncAllPlayers } from "@/lib/sync-wikidata";
import { secureCompare } from "@/lib/secure-compare";

// 手動実行用（CRON_SECRET認証つき）。定期実行は netlify/functions/sync-wikidata.mts が担う。
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = process.env.CRON_SECRET;

  if (!expected || !secureCompare(authHeader, `Bearer ${expected}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = await syncAllPlayers();
  const changed = results.filter((r) => r.clubChanged);
  const errored = results.filter((r) => r.error);

  return NextResponse.json({
    total: results.length,
    changed: changed.length,
    errored: errored.length,
    results,
  });
}
