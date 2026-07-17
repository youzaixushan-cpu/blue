import "./pick-list.scss";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PositionBadge } from "@/components/players/position-badge";
import { ConfidenceBar } from "@/components/ai-team/confidence-bar";
import type { AiPrediction, Player } from "@/lib/types";

export function PickList({
  prediction,
  players,
}: {
  prediction: AiPrediction;
  players: Record<string, Player>;
}) {
  const orderedPicks = [...prediction.picks].sort((a, b) => a.y - b.y);

  return (
    <div className="pick-list">
      {orderedPicks.map((pick) => {
        const player = players[pick.playerId];
        if (!player) return null;
        return (
          <div key={pick.playerId} className="pick-list__row">
            <PlayerAvatar label={player.nameEn} theme={player.avatarTheme} size="sm" />
            <div className="pick-list__body">
              <p className="pick-list__name">
                {player.name}
                <PositionBadge position={player.position} className="pick-list__slot" />
              </p>
              <ConfidenceBar confidence={pick.confidence} />
              <p className="pick-list__reason">{pick.reason}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
