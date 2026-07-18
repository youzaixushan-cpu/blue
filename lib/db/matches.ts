import { prisma } from "@/lib/db/client";
import type { MatchResult, MatchScorer, MatchLineupEntry } from "@/lib/types";
import type { MatchModel } from "@/lib/generated/prisma/models";

function toMatch(row: MatchModel): MatchResult {
  return {
    id: row.id,
    opponent: row.opponent,
    opponentFlag: row.opponentFlag,
    competition: row.competition,
    venue: row.venue,
    date: row.date,
    score: row.score,
    result: row.result as "win" | "draw" | "lose",
    scorers: row.scorers as unknown as MatchScorer[],
    lineup: row.lineup as unknown as MatchLineupEntry[],
  };
}

export async function getRecentResults(): Promise<MatchResult[]> {
  const rows = await prisma.match.findMany({ orderBy: { date: "desc" } });
  return rows.map(toMatch);
}
