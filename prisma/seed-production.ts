import "dotenv/config";
import { seedProduction } from "../lib/seed-production";
import { prisma } from "../lib/db/client";

seedProduction()
  .then((result) => {
    console.log(`Upserted ${result.playersUpserted} players`);
    console.log(`Upserted ${result.matchesUpserted} matches`);
    for (const s of result.communitySeeded) {
      console.log(`Seeded ${s.count} community submissions for "${s.target}"`);
    }
    for (const s of result.communitySkipped) {
      console.log(`Skip community samples for "${s.target}" (${s.existing} submissions already exist)`);
    }
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
