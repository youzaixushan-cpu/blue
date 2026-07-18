import { prisma } from "@/lib/db/client";
import { wikidataIds } from "@/lib/data/wikidata-ids";
import { fetchPlayerFacts, resolveEntityLabel } from "@/lib/wikidata";

const REQUEST_DELAY_MS = 250;

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

export async function syncAllPlayers(): Promise<PlayerSyncResult[]> {
  const results: PlayerSyncResult[] = [];

  for (const [playerId, qid] of Object.entries(wikidataIds)) {
    const player = await prisma.player.findUnique({ where: { id: playerId } });
    if (!player) {
      results.push({ playerId, name: playerId, clubChanged: false, birthDateSet: false, error: "選手が見つかりません" });
      continue;
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

      const newClubLabel = isRealTransfer
        ? await resolveEntityLabel(facts.currentClubQid!)
        : null;

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

      results.push({
        playerId,
        name: player.name,
        clubChanged: Boolean(newClubLabel),
        previousClub: newClubLabel ? player.club : undefined,
        newClub: newClubLabel ?? undefined,
        birthDateSet: Boolean(facts.birthDate),
      });
    } catch (error) {
      results.push({
        playerId,
        name: player.name,
        clubChanged: false,
        birthDateSet: false,
        error: error instanceof Error ? error.message : "不明なエラー",
      });
    }

    await sleep(REQUEST_DELAY_MS);
  }

  return results;
}
