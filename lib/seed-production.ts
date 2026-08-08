import { prisma } from "@/lib/db/client";
import { Prisma } from "@/lib/generated/prisma/client";
import { players } from "@/lib/data/players";
import { recentResults } from "@/lib/data/matches";
import { wikidataIds } from "@/lib/data/wikidata-ids";
import { buildCommunitySampleSubmissions } from "@/lib/community-samples";
import { submitSquad } from "@/lib/db/community";

export interface SeedProductionResult {
  playersUpserted: number;
  matchesUpserted: number;
  communitySeeded: { target: string; count: number }[];
  communitySkipped: { target: string; existing: number }[];
}

// 本番用シード。既存データ（実際のユーザー投稿・いいね等）を削除しない。
// 何度実行してもデータが重複・消失しないことを重視する（idempotent）。
export async function seedProduction(): Promise<SeedProductionResult> {
  for (const p of players) {
    const data = {
      name: p.name,
      nameEn: p.nameEn,
      position: p.position,
      club: p.club,
      age: p.age,
      height: p.height,
      weight: p.weight,
      caps: p.caps,
      goals: p.goals,
      bio: p.bio,
      recentRatings: p.recentRatings as unknown as Prisma.InputJsonValue,
      career: p.career as unknown as Prisma.InputJsonValue,
      avatarTheme: p.avatarTheme,
      officialSquad: p.officialSquad,
      wikidataId: wikidataIds[p.id] ?? null,
    };
    await prisma.player.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });
  }

  for (const m of recentResults) {
    const data = {
      opponent: m.opponent,
      opponentFlag: m.opponentFlag,
      competition: m.competition,
      venue: m.venue,
      date: m.date,
      score: m.score,
      result: m.result,
      scorers: m.scorers as unknown as Prisma.InputJsonValue,
      lineup: m.lineup as unknown as Prisma.InputJsonValue,
    };
    await prisma.match.upsert({ where: { id: m.id }, update: data, create: { id: m.id, ...data } });
  }

  const communitySeeded: SeedProductionResult["communitySeeded"] = [];
  const communitySkipped: SeedProductionResult["communitySkipped"] = [];

  // みんなの代表のサンプル投稿は「対象トラックがまだ1件も投稿を持っていない」場合のみ投入する。
  // 実際のユーザー投稿が既にあるトラックには一切手を加えない（削除も追加もしない）。
  for (const target of ["next", "2030"] as const) {
    const existing = await prisma.communitySubmission.count({ where: { target } });
    if (existing > 0) {
      communitySkipped.push({ target, existing });
      continue;
    }
    const count = target === "next" ? 24 : 16;
    const samples = buildCommunitySampleSubmissions(count, target);
    for (const sample of samples) {
      const id = await submitSquad(sample);
      await prisma.communitySubmission.update({
        where: { id },
        data: { createdAt: sample.createdAt, likes: sample.likes },
      });
    }
    communitySeeded.push({ target, count: samples.length });
  }

  return {
    playersUpserted: players.length,
    matchesUpserted: recentResults.length,
    communitySeeded,
    communitySkipped,
  };
}
