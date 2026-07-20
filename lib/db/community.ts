import { prisma } from "@/lib/db/client";
import { Prisma } from "@/lib/generated/prisma/client";
import { getFormationById } from "@/lib/data/formations";
import type { CommunitySquad, FormationRanking, PlayerRanking, Position } from "@/lib/types";

export interface CommunitySquadDetail {
  id: string;
  authorName: string;
  title: string;
  formationId: string;
  formationName: string;
  likes: number;
  createdAt: string;
  members: { slotId: string; playerId: string | null; name: string; position: Position }[];
}

export interface SubmitSquadMemberInput {
  slotId: string;
  playerId: string | null;
  name: string;
  position: Position;
}

export interface SubmitSquadInput {
  formationId: string;
  authorName?: string;
  title?: string;
  members: SubmitSquadMemberInput[];
  ipHash: string;
}

const SUBMIT_RATE_LIMIT_MAX = 5;
const SUBMIT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export class SubmitSquadValidationError extends Error {}
export class SubmitSquadRateLimitError extends Error {}
export class AlreadyLikedError extends Error {}

export async function submitSquad(input: SubmitSquadInput): Promise<string> {
  const formation = getFormationById(input.formationId);
  if (!formation) {
    throw new SubmitSquadValidationError("不明なフォーメーションです");
  }
  if (input.members.length !== formation.slots.length) {
    throw new SubmitSquadValidationError("全ポジションに選手を配置してから投稿してください");
  }
  if (input.members.some((m) => !m.name.trim())) {
    throw new SubmitSquadValidationError("選手名が空のスロットがあります");
  }

  const recentCount = await prisma.communitySubmission.count({
    where: {
      ipHash: input.ipHash,
      createdAt: { gte: new Date(Date.now() - SUBMIT_RATE_LIMIT_WINDOW_MS) },
    },
  });
  if (recentCount >= SUBMIT_RATE_LIMIT_MAX) {
    throw new SubmitSquadRateLimitError("投稿回数の上限に達しました。しばらくしてからお試しください。");
  }

  const authorName = (input.authorName?.trim() || "匿名サポーター").slice(0, 40);
  const title = (input.title?.trim() || `${formation.name}の予想布陣`).slice(0, 80);

  const submission = await prisma.communitySubmission.create({
    data: {
      formationId: input.formationId,
      authorName,
      title,
      ipHash: input.ipHash,
      members: {
        create: input.members.map((m) => ({
          slotId: m.slotId,
          playerId: m.playerId,
          name: m.name,
          position: m.position,
        })),
      },
    },
  });

  return submission.id;
}

export async function likeSubmission(id: string, ipHash: string): Promise<number> {
  try {
    await prisma.communitySubmissionLike.create({ data: { submissionId: id, ipHash } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AlreadyLikedError("すでにいいね済みです");
    }
    throw error;
  }

  const updated = await prisma.communitySubmission.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });
  return updated.likes;
}

// 「上昇/下降/変化なし」は前回このランキングを計算した時点の順位（PlayerRankStat）との比較で決まる。
// 呼び出すたびに現在の順位を新しい基準値として保存し直すため、「前回表示時からの変化」を表す。
export async function getPlayerRankings(): Promise<PlayerRanking[]> {
  const totalSubmissions = await prisma.communitySubmission.count();
  if (totalSubmissions === 0) return [];

  const grouped = await prisma.communitySubmissionMember.groupBy({
    by: ["playerId"],
    where: { playerId: { not: null } },
    _count: { _all: true },
  });

  const ranked = grouped
    .map((g) => ({ playerId: g.playerId as string, count: g._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((entry, index) => ({
      playerId: entry.playerId,
      selectionRate: Math.round((entry.count / totalSubmissions) * 100),
      rank: index + 1,
    }));

  if (ranked.length === 0) return [];

  const stats = await prisma.playerRankStat.findMany({
    where: { playerId: { in: ranked.map((r) => r.playerId) } },
  });
  const lastRankByPlayer = new Map(stats.map((s) => [s.playerId, s.lastRank]));

  const result: PlayerRanking[] = ranked.map((r) => {
    const lastRank = lastRankByPlayer.get(r.playerId);
    let trend: PlayerRanking["trend"] = "same";
    if (lastRank !== undefined) {
      if (r.rank < lastRank) trend = "up";
      else if (r.rank > lastRank) trend = "down";
    }
    return { playerId: r.playerId, selectionRate: r.selectionRate, rank: r.rank, trend };
  });

  await Promise.all(
    ranked.map((r) =>
      prisma.playerRankStat.upsert({
        where: { playerId: r.playerId },
        update: { lastRank: r.rank },
        create: { playerId: r.playerId, lastRank: r.rank },
      }),
    ),
  );

  return result;
}

export async function getFormationRankings(): Promise<FormationRanking[]> {
  const total = await prisma.communitySubmission.count();
  if (total === 0) return [];

  const grouped = await prisma.communitySubmission.groupBy({
    by: ["formationId"],
    _count: { _all: true },
  });

  return grouped
    .map((g) => ({ formationId: g.formationId, count: g._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((entry, index) => ({
      formationId: entry.formationId,
      share: Math.round((entry.count / total) * 100),
      rank: index + 1,
    }));
}

export async function getCommunitySquads(limit = 12): Promise<CommunitySquad[]> {
  const submissions = await prisma.communitySubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { members: true },
  });

  return submissions.map((s) => {
    const formation = getFormationById(s.formationId);
    const topPlayers = s.members
      .filter((m) => m.playerId)
      .slice(0, 3)
      .map((m) => m.playerId as string);

    return {
      id: s.id,
      authorName: s.authorName,
      authorAvatarSeed: s.authorName,
      formationName: formation?.name ?? s.formationId,
      title: s.title,
      likes: s.likes,
      createdAt: s.createdAt.toISOString().slice(0, 10),
      topPlayers,
    };
  });
}

export async function getCommunitySquadDetail(id: string): Promise<CommunitySquadDetail | null> {
  const submission = await prisma.communitySubmission.findUnique({
    where: { id },
    include: { members: true },
  });
  if (!submission) return null;

  const formation = getFormationById(submission.formationId);

  return {
    id: submission.id,
    authorName: submission.authorName,
    title: submission.title,
    formationId: submission.formationId,
    formationName: formation?.name ?? submission.formationId,
    likes: submission.likes,
    createdAt: submission.createdAt.toISOString(),
    members: submission.members.map((m) => ({
      slotId: m.slotId,
      playerId: m.playerId,
      name: m.name,
      position: m.position as Position,
    })),
  };
}
