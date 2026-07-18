import "./player-ranking-list.scss";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PositionBadge } from "@/components/players/position-badge";
import type { Player, PlayerRanking } from "@/lib/types";

const TREND_ICON = { up: ArrowUp, down: ArrowDown, same: Minus } as const;
const TREND_MODIFIER = {
  up: "player-ranking-list__trend--up",
  down: "player-ranking-list__trend--down",
  same: "player-ranking-list__trend--same",
} as const;

export function PlayerRankingList({
  rankings,
  players,
}: {
  rankings: PlayerRanking[];
  players: Record<string, Player>;
}) {
  return (
    <div className="player-ranking-list">
      {rankings.map((ranking) => {
        const player = players[ranking.playerId];
        if (!player) return null;
        const TrendIcon = TREND_ICON[ranking.trend];
        return (
          <div key={ranking.playerId} className="player-ranking-list__row">
            <span className="player-ranking-list__rank">{ranking.rank}</span>
            <PlayerAvatar label={player.nameEn} theme={player.avatarTheme} size="sm" />
            <div className="player-ranking-list__body">
              <div className="player-ranking-list__name-row">
                <p className="player-ranking-list__name">{player.name}</p>
                <PositionBadge position={player.position} />
              </div>
              <div className="player-ranking-list__track">
                <div
                  className="player-ranking-list__fill"
                  style={{ width: `${ranking.selectionRate}%` }}
                />
              </div>
            </div>
            <div className="player-ranking-list__rate">
              {ranking.selectionRate}%
              <TrendIcon className={cn("player-ranking-list__trend", TREND_MODIFIER[ranking.trend])} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
