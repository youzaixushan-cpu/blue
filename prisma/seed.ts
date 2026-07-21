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

async function main() {
  await prisma.communitySubmissionLike.deleteMany();
  await prisma.communitySubmissionMember.deleteMany();
  await prisma.communitySubmission.deleteMany();
  await prisma.playerRankStat.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();

  await prisma.player.createMany({
    data: players.map((p) => ({
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
    })),
  });
  console.log(`Seeded ${players.length} players`);

  await prisma.match.createMany({
    data: recentResults.map((m) => ({
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
    })),
  });
  console.log(`Seeded ${recentResults.length} matches`);

  // 「みんなの代表」が最初から空/不自然にならないよう、人気選手ほど選ばれやすい
  // 重み付けをしたフルの11人編成サンプルを、実際の投稿と同じsubmitSquad()経由で投入する。
  // next（次回選考）より2030（2030年W杯）はまだ新しいトラックという体で件数を少なめにする。
  const samples = [
    ...buildCommunitySampleSubmissions(24, "next"),
    ...buildCommunitySampleSubmissions(16, "2030"),
  ];
  let seededCommunityCount = 0;
  for (const sample of samples) {
    const id = await submitSquad(sample);
    await prisma.communitySubmission.update({
      where: { id },
      data: { createdAt: sample.createdAt, likes: sample.likes },
    });
    seededCommunityCount++;
  }
  console.log(`Seeded ${seededCommunityCount} community submissions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
