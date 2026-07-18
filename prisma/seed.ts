import "dotenv/config";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { players } from "../lib/data/players";
import { recentResults } from "../lib/data/matches";
import { communitySquads } from "../lib/data/community";
import { formationTemplates } from "../lib/data/formations";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
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

  const playersById = new Map(players.map((p) => [p.id, p]));

  for (const squad of communitySquads) {
    const formation = formationTemplates.find((f) => f.name === squad.formationName);
    if (!formation) continue;

    await prisma.communitySubmission.create({
      data: {
        formationId: formation.id,
        authorName: squad.authorName,
        title: squad.title,
        likes: squad.likes,
        createdAt: new Date(squad.createdAt),
        members: {
          create: squad.topPlayers.map((playerId, index) => {
            const player = playersById.get(playerId);
            const slot = formation.slots[index] ?? formation.slots[0];
            return {
              slotId: slot.id,
              playerId,
              name: player?.name ?? playerId,
              position: player?.position ?? slot.label,
            };
          }),
        },
      },
    });
  }
  console.log(`Seeded ${communitySquads.length} community submissions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
