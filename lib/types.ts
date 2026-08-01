import type { AvatarThemeKey } from "@/lib/avatar";

export type Position = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: string;
  name: string;
  nameEn: string;
  position: Position;
  club: string;
  age: number;
  height: number;
  weight: number;
  caps: number;
  goals: number;
  bio: string;
  recentRatings: number[];
  career: { year: string; club: string }[];
  avatarTheme: AvatarThemeKey;
  // 直近の実際の招集メンバー（26名）かどうか。false は登録されていない予想用の候補選手。
  officialSquad: boolean;
  // Wikidataと同期できた場合のみ設定される（未設定の場合はageが手入力の固定値のまま）
  birthDate?: string;
  lastSyncedAt?: string;
}

// 「あなたの26人」に入る1エントリー。登録選手を参照する場合と、
// 登録されていない選手を自由入力したカスタムエントリーの場合がある。
export interface RosterMember {
  id: string;
  name: string;
  nameEn: string;
  position: Position;
  club: string;
  avatarTheme?: AvatarThemeKey;
  playerId?: string;
}

export interface MatchScorer {
  playerId: string;
  minute: number;
}

export interface MatchLineupEntry {
  playerId: string;
  x: number;
  y: number;
}

export interface MatchResult {
  id: string;
  opponent: string;
  opponentFlag: string;
  competition: string;
  venue: string;
  date: string;
  score: string;
  result: "win" | "draw" | "lose";
  scorers: MatchScorer[];
  lineup: MatchLineupEntry[];
}

export interface FormationSlot {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface FormationTemplate {
  id: string;
  name: string;
  description: string;
  slots: FormationSlot[];
}

export interface AiPick {
  playerId: string;
  x: number;
  y: number;
  confidence: number;
  reason: string;
}

export interface AiPrediction {
  formationName: string;
  generatedAt: string;
  source: string;
  picks: AiPick[];
}

export interface CommunitySquad {
  id: string;
  authorName: string;
  authorAvatarSeed: string;
  formationName: string;
  title: string;
  likes: number;
  createdAt: string;
  topPlayers: string[];
}

export interface PlayerRanking {
  playerId: string;
  selectionRate: number;
  rank: number;
  trend: "up" | "down" | "same";
}

export interface FormationRanking {
  formationId: string;
  share: number;
  rank: number;
}
