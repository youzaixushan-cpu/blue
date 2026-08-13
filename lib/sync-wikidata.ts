import { prisma } from "@/lib/db/client";
import { wikidataIds } from "@/lib/data/wikidata-ids";
import { fetchPlayerFacts, resolveEntityLabel } from "@/lib/wikidata";

const REQUEST_DELAY_MS = 250;
// 同時実行数。Wikidata APIへの配慮とNetlify Scheduled Functionsの30秒制限の
// 両方のバランスを見て決めた値。調整する場合はここだけ変える。
const CONCURRENCY = 4;

export interface PlayerSyncResult {
  playerId: string;
  name: string;
  clubChanged: boolean;
  previousClub?: string;
  newClub?: string;
  birthDateSet: boolean;
  error?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

// 選手ごとにDBの自分の行だけを読み書きし、他の選手のエントリーとは一切干渉しないため、
// 並列実行しても処理順に依存する不整合は起きない（resultsへのpushはJSのシングルスレッド
// 特性により競合しないが、配列内の並び順は完了順になり、実行前とは変わる。
// 呼び出し側は件数の集計だけを見ており、順序に依存する処理は無いことを確認済み）。
async function syncOnePlayer(playerId: string, qid: string): Promise<PlayerSyncResult> {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) {
    return { playerId, name: playerId, clubChanged: false, birthDateSet: false, error: "選手が見つかりません" };
  }

  try {
    const facts = await fetchPlayerFacts(qid);

    // クラブの文言は「所属クラブのQIDが前回の同期時から実際に変わった時」だけ更新する。
    // 初回同期（currentClubQidが未設定）はベースラインを記録するだけで、
    // Wikidata側の表記ゆれ（例:「マインツ05」→「1.FSVマインツ05」）で
    // 元々正しかった表記を上書きしてしまわないようにする。
    const isRealTransfer =
      Boolean(facts.currentClubQid) &&
      player.currentClubQid !== null &&
      facts.currentClubQid !== player.currentClubQid;

    const newClubLabel = isRealTransfer ? await resolveEntityLabel(facts.currentClubQid!) : null;

    await prisma.player.update({
      where: { id: playerId },
      data: {
        wikidataId: qid,
        birthDate: facts.birthDate ?? player.birthDate,
        currentClubQid: facts.currentClubQid ?? player.currentClubQid,
        club: newClubLabel ?? player.club,
        lastSyncedAt: new Date(),
      },
    });

    return {
      playerId,
      name: player.name,
      clubChanged: Boolean(newClubLabel),
      previousClub: newClubLabel ? player.club : undefined,
      newClub: newClubLabel ?? undefined,
      birthDateSet: Boolean(facts.birthDate),
    };
  } catch (error) {
    return {
      playerId,
      name: player.name,
      clubChanged: false,
      birthDateSet: false,
      error: error instanceof Error ? error.message : "不明なエラー",
    };
  }
}

export async function syncAllPlayers(): Promise<PlayerSyncResult[]> {
  const batches = chunk(Object.entries(wikidataIds), CONCURRENCY);
  const results: PlayerSyncResult[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batchResults = await Promise.all(
      batches[i].map(([playerId, qid]) => syncOnePlayer(playerId, qid)),
    );
    results.push(...batchResults);

    // 最後のバッチの後は待つ必要が無い
    if (i < batches.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return results;
}
