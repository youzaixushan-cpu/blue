import type { Player, Position, RosterMember } from "@/lib/types";
import type { AvatarThemeKey } from "@/lib/avatar";
import { SQUAD_MAX_SIZE } from "@/lib/squad-context";

export type MatchStatus = "hit" | "predicted-miss" | "surprise";

export interface ComparedMember {
  member: RosterMember;
  status: Extract<MatchStatus, "hit" | "predicted-miss">;
}

export interface SurpriseSelection {
  playerId: string;
  name: string;
  nameEn: string;
  position: Position;
  club: string;
  avatarTheme: AvatarThemeKey;
}

export interface SquadComparisonResult {
  matchRate: number; // 0-100、常にhitCount / SQUAD_MAX_SIZE（26）で計算
  hitCount: number;
  comparedMembers: ComparedMember[]; // membersと同じ順序・件数
  surpriseSelections: SurpriseSelection[];
}

// 前後の空白トリム＋半角/全角(　)スペースの除去により表記ゆれを吸収する
export function normalizePlayerName(raw: string): string {
  return raw.trim().replace(/[\s　]+/g, "");
}

export function compareSquad(
  members: RosterMember[],
  officialSquadPlayerIds: readonly string[],
  players: Player[],
): SquadComparisonResult {
  const officialIdSet = new Set(officialSquadPlayerIds);
  const officialPlayers = players.filter((p) => officialIdSet.has(p.id));
  const officialNameSet = new Set(officialPlayers.map((p) => normalizePlayerName(p.name)));

  const pickedPlayerIds = new Set(
    members.filter((m) => m.playerId).map((m) => m.playerId as string),
  );
  const pickedNormalizedNames = new Set(
    members.filter((m) => !m.playerId).map((m) => normalizePlayerName(m.name)),
  );

  const comparedMembers: ComparedMember[] = members.map((member) => {
    const hit = member.playerId
      ? officialIdSet.has(member.playerId)
      : officialNameSet.has(normalizePlayerName(member.name));
    return { member, status: hit ? "hit" : "predicted-miss" };
  });

  const hitCount = comparedMembers.filter((c) => c.status === "hit").length;
  const matchRate = Math.min(100, Math.round((hitCount / SQUAD_MAX_SIZE) * 100));

  const surpriseSelections: SurpriseSelection[] = officialPlayers
    .filter(
      (p) => !pickedPlayerIds.has(p.id) && !pickedNormalizedNames.has(normalizePlayerName(p.name)),
    )
    .map((p) => ({
      playerId: p.id,
      name: p.name,
      nameEn: p.nameEn,
      position: p.position,
      club: p.club,
      avatarTheme: p.avatarTheme,
    }));

  return { matchRate, hitCount, comparedMembers, surpriseSelections };
}
