// 一度だけ実行する調査用スクリプト。39選手ぶんの候補QIDを一覧化して標準出力に表示する。
// 結果を目視で確認したうえで、確からしいものだけを lib/data/wikidata-ids.ts に手動で転記すること。
import { players } from "../lib/data/players";
import { searchWikidataPerson } from "../lib/wikidata";

async function main() {
  for (const player of players) {
    try {
      // Wikidataの検索は「姓 名」の間にスペースが入っていると多くの場合ヒットしないため、詰めて検索する
      const results = await searchWikidataPerson(player.name.replace(/\s+/g, ""));
      console.log(`\n=== ${player.id} : ${player.name} (${player.club}) ===`);
      if (results.length === 0) {
        console.log("  候補なし");
      }
      for (const r of results) {
        console.log(`  ${r.id}\t${r.label}\t${r.description ?? ""}`);
      }
    } catch (e) {
      console.log(`\n=== ${player.id} : ${player.name} — ERROR: ${(e as Error).message} ===`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

main();
