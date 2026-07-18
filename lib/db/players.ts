import { prisma } from "@/lib/db/client";
import type { Player, Position } from "@/lib/types";
import type { AvatarThemeKey } from "@/lib/avatar";
import type { PlayerModel } from "@/lib/generated/prisma/models";

function toPlayer(row: PlayerModel): Player {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.nameEn,
    position: row.position as Position,
    club: row.club,
    age: row.age,
    height: row.height,
    weight: row.weight,
    caps: row.caps,
    goals: row.goals,
    bio: row.bio,
    recentRatings: row.recentRatings as unknown as number[],
    career: row.career as unknown as { year: string; club: string }[],
    avatarTheme: row.avatarTheme as AvatarThemeKey,
    officialSquad: row.officialSquad,
  };
}

export async function getAllPlayers(): Promise<Player[]> {
  const rows = await prisma.player.findMany({ orderBy: { id: "asc" } });
  return rows.map(toPlayer);
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const row = await prisma.player.findUnique({ where: { id } });
  return row ? toPlayer(row) : undefined;
}
