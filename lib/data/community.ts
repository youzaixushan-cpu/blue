import type { CommunitySquad, FormationRanking, PlayerRanking } from "@/lib/types";

// 「みんなの代表」用の集計ダミーデータ（全ファンの選出結果を集計したという想定）
export const playerRankings: PlayerRanking[] = [
  { playerId: "mf-01", selectionRate: 94, rank: 1, trend: "same" },
  { playerId: "fw-01", selectionRate: 92, rank: 2, trend: "up" },
  { playerId: "mf-06", selectionRate: 88, rank: 3, trend: "up" },
  { playerId: "mf-05", selectionRate: 85, rank: 4, trend: "down" },
  { playerId: "df-01", selectionRate: 81, rank: 5, trend: "same" },
  { playerId: "df-02", selectionRate: 77, rank: 6, trend: "up" },
  { playerId: "gk-03", selectionRate: 74, rank: 7, trend: "same" },
  { playerId: "mf-07", selectionRate: 68, rank: 8, trend: "down" },
  { playerId: "mf-04", selectionRate: 61, rank: 9, trend: "up" },
  { playerId: "fw-03", selectionRate: 55, rank: 10, trend: "down" },
];

export const formationRankings: FormationRanking[] = [
  { formationId: "f-433", share: 46, rank: 1 },
  { formationId: "f-4231", share: 28, rank: 2 },
  { formationId: "f-352", share: 14, rank: 3 },
];

export const communitySquads: CommunitySquad[] = [
  {
    id: "cs-1",
    authorName: "青き戦士サポ",
    authorAvatarSeed: "AokiSensi",
    formationName: "4-3-3",
    title: "攻撃全振り！次世代アタッキングフットボール",
    likes: 482,
    createdAt: "2026-08-24",
    topPlayers: ["mf-06", "fw-01", "mf-05"],
  },
  {
    id: "cs-2",
    authorName: "サムライブルー侍",
    authorAvatarSeed: "SamuraiB",
    formationName: "3-4-3",
    title: "ウイングバック大活用の超攻撃布陣",
    likes: 367,
    createdAt: "2026-08-23",
    topPlayers: ["df-01", "mf-07", "fw-01"],
  },
  {
    id: "cs-3",
    authorName: "満員御礼スタジアム",
    authorAvatarSeed: "ManinStad",
    formationName: "4-2-3-1",
    title: "堅守速攻、鉄壁の2ボランチ構成",
    likes: 298,
    createdAt: "2026-08-21",
    topPlayers: ["mf-01", "mf-04", "gk-01"],
  },
  {
    id: "cs-4",
    authorName: "国立の青",
    authorAvatarSeed: "KokuritsuBlue",
    formationName: "4-4-2",
    title: "ベテランと若手の融合ベストミックス",
    likes: 251,
    createdAt: "2026-08-19",
    topPlayers: ["mf-06", "fw-01", "df-05"],
  },
];
