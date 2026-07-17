import "./player-card.scss";
import Link from "next/link";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PositionBadge } from "@/components/players/position-badge";
import type { Player } from "@/lib/types";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link href={`/players/${player.id}`} className="player-card">
      <PlayerAvatar
        label={player.nameEn}
        theme={player.avatarTheme}
        size="lg"
        className="player-card__avatar"
      />

      <div className="player-card__info">
        <p className="player-card__name">{player.name}</p>
        <p className="player-card__club">{player.club}</p>
      </div>

      <div className="player-card__meta">
        <PositionBadge position={player.position} />
        <span className="player-card__age">{player.age}歳</span>
      </div>
    </Link>
  );
}
