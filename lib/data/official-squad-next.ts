import type { Player } from "@/lib/types";
import { players } from "@/lib/data/players";

// 「次回選考（直近の代表招集）」の公式発表メンバー26名を模したダミーデータです。
// 実在の選手データを参照していますが、実際の招集結果ではありません（演出用のモックアップ）。
// lib/data/players.ts の officialSquad フラグ（追加フォームの候補表示用）とは別管理です。
export const OFFICIAL_SQUAD_NEXT_PLAYER_IDS: readonly string[] = [
  "gk-01", "gk-02", "gk-03",
  "df-01", "df-02", "df-03", "df-04", "df-05", "df-06", "df-07", "df-08",
  // df-09（鈴木 淳之介）は今回選外 → 落選予想のデモ用
  "df-10", // 高井 幸大: officialSquad:falseの候補だが今回サプライズ選出という設定
  "mf-01", "mf-02", "mf-03", "mf-04", "mf-05", "mf-06", "mf-07", "mf-08", "mf-09",
  "mf-16", // 旗手 怜央: officialSquad:falseの候補だが今回サプライズ選出という設定
  "fw-01", "fw-02", "fw-03", "fw-04",
  // fw-05（塩貝 健人）は今回選外 → 落選予想のデモ用
];

export function getOfficialSquadNextPlayers(allPlayers: Player[] = players): Player[] {
  const idSet = new Set(OFFICIAL_SQUAD_NEXT_PLAYER_IDS);
  return allPlayers.filter((p) => idSet.has(p.id));
}
