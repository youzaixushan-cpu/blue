import "./page.scss";
import { notFound } from "next/navigation";
import { players, getPlayerById } from "@/lib/data/players";
import { ProfileHeader } from "@/components/player-detail/profile-header";
import { StatTiles } from "@/components/player-detail/stat-tiles";
import { PlayerOverview } from "@/components/player-detail/player-overview";

export const dynamicParams = false;

export function generateStaticParams() {
  return players.filter((p) => p.officialSquad).map((p) => ({ id: p.id }));
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = getPlayerById(id);
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
