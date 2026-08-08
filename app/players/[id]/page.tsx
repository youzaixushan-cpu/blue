import "./page.scss";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlayers, getPlayerById } from "@/lib/db/players";
import { ProfileHeader } from "@/components/player-detail/profile-header";
import { StatTiles } from "@/components/player-detail/stat-tiles";
import { PlayerOverview } from "@/components/player-detail/player-overview";

export const dynamicParams = false;

// officialSquadに限定すると、みんなの代表やAI予想が参照する候補選手
// （officialSquad: false）の詳細ページが404になってしまうため、DBの全選手を対象にする。
export async function generateStaticParams() {
  const players = await getAllPlayers();
  return players.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) return {};
  return {
    title: `${player.name}（${player.nameEn}）`,
    description: `${player.name}選手（${player.position} / ${player.club}）のプロフィール・スタッツ・経歴。`,
  };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  return (
    <div>
      <ProfileHeader player={player} />
      <div className="player-detail-page">
        <StatTiles player={player} />
        <PlayerOverview player={player} />
      </div>
    </div>
  );
}
