import { NextResponse } from "next/server";
import { syncAllPlayers } from "@/lib/sync-wikidata";

// Vercel Cron はこのパスへGETリクエストを送るため、GETで受ける
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
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
