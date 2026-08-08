import "dotenv/config";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { players } from "../lib/data/players";
import { recentResults } from "../lib/data/matches";
import { wikidataIds } from "../lib/data/wikidata-ids";
import { buildCommunitySampleSubmissions } from "../lib/community-samples";
import { submitSquad } from "../lib/db/community";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// 本番用シード。prisma/seed.ts と違い、既存データ（実際のユーザー投稿・いいね等）を
// 削除しない。何度実行してもデータが重複・消失しないことを重視する（idempotent）。
async function main() {
  for (const p of players) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: {
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
      },
      create: {
        id: p.id,
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
      },
    });
  }
  console.log(`Upserted ${players.length} players`);

  for (const m of recentResults) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: {
        opponent: m.opponent,
        opponentFlag: m.opponentFlag,
        competition: m.competition,
        venue: m.venue,
        date: m.date,
        score: m.score,
        result: m.result,
        scorers: m.scorers as unknown as Prisma.InputJsonValue,
        lineup: m.lineup as unknown as Prisma.InputJsonValue,
      },
      create: {
        id: m.id,
        opponent: m.opponent,
        opponentFlag: m.opponentFlag,
        competition: m.competition,
        venue: m.venue,
        date: m.date,
        score: m.score,
        result: m.result,
        scorers: m.scorers as unknown as Prisma.InputJsonValue,
        lineup: m.lineup as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log(`Upserted ${recentResults.length} matches`);

  // みんなの代表のサンプル投稿は「対象トラックがまだ1件も投稿を持っていない」場合のみ投入する。
  // 実際のユーザー投稿が既にあるトラックには一切手を加えない（削除も追加もしない）。
  for (const target of ["next", "2030"] as const) {
    const existing = await prisma.communitySubmission.count({ where: { target } });
    if (existing > 0) {
      console.log(`Skip community samples for "${target}" (${existing} submissions already exist)`);
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
    console.log(`Seeded ${samples.length} community submissions for "${target}"`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
