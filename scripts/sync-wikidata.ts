import "dotenv/config";
import { syncAllPlayers } from "../lib/sync-wikidata";

async function main() {
  const results = await syncAllPlayers();

  const changed = results.filter((r) => r.clubChanged);
  const errored = results.filter((r) => r.error);

  console.log(`同期対象: ${results.length}人`);
  console.log(`クラブ変更: ${changed.length}人`);
  for (const r of changed) {
    console.log(`  ${r.name}: ${r.previousClub} → ${r.newClub}`);
  }
  if (errored.length > 0) {
    console.log(`エラー: ${errored.length}人`);
    for (const r of errored) {
      console.log(`  ${r.name} (${r.playerId}): ${r.error}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
