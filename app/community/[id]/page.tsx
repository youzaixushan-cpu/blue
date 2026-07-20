import "./page.scss";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCommunitySquadDetail } from "@/lib/db/community";
import { getFormationById } from "@/lib/data/formations";
import { getAllPlayers } from "@/lib/db/players";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { Badge } from "@/components/ui/badge";
import { SquadDetailPitch } from "@/components/community/squad-detail-pitch";
import { LikeButton } from "@/components/community/like-button";

// 投稿ごとにいいね数などが変わるため、ビルド時に静的化せず常に最新のDB内容を表示する
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getCommunitySquadDetail(id);
  if (!detail) return {};
  return {
    title: detail.title,
    description: `${detail.authorName}さんが投稿した${detail.formationName}の予想布陣。`,
  };
}

export default async function CommunitySquadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getCommunitySquadDetail(id);
  if (!detail) notFound();

  const formation = getFormationById(detail.formationId);
  if (!formation) notFound();

  const players = await getAllPlayers();
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

  return (
    <div className="squad-detail-page">
      <Link href="/community" className="squad-detail-page__back">
        <ArrowLeft className="squad-detail-page__back-icon" />
        みんなの代表に戻る
      </Link>

      <div className="squad-detail-page__header">
        <div className="squad-detail-page__author">
          <PlayerAvatar label={detail.authorName} seed={detail.authorName} size="md" />
          <div>
            <p className="squad-detail-page__author-name">{detail.authorName}</p>
            <p className="squad-detail-page__date">
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(
                new Date(detail.createdAt),
              )}
            </p>
          </div>
        </div>
        <Badge variant="secondary">{detail.formationName}</Badge>
      </div>

      <h1 className="squad-detail-page__title">{detail.title}</h1>

      <SquadDetailPitch formation={formation} members={detail.members} players={playersById} />

      <LikeButton
        submissionId={detail.id}
        initialLikes={detail.likes}
        className="squad-detail-page__like"
        iconClassName="squad-detail-page__like-icon"
      />
    </div>
  );
}
