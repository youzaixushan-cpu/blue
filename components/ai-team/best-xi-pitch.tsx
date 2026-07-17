import "./best-xi-pitch.scss";
import { PitchLines } from "@/components/formation/pitch-lines";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { cn } from "@/lib/utils";
import type { AiPrediction, Player } from "@/lib/types";

function modifierForConfidence(confidence: number) {
  if (confidence >= 90) return "best-xi-pitch__avatar--high";
  if (confidence >= 80) return "best-xi-pitch__avatar--good";
  if (confidence >= 70) return "best-xi-pitch__avatar--fair";
  return "best-xi-pitch__avatar--low";
}

export function BestXiPitch({
  prediction,
  players,
}: {
  prediction: AiPrediction;
  players: Record<string, Player>;
}) {
  return (
    <div className="best-xi-pitch">
      <PitchLines />
      {prediction.picks.map((pick) => {
        const player = players[pick.playerId];
        if (!player) return null;
        return (
          <div
            key={pick.playerId}
            style={{ left: `${pick.x}%`, top: `${pick.y}%` }}
            className="best-xi-pitch__slot"
          >
            <PlayerAvatar
              label={player.nameEn}
              theme={player.avatarTheme}
              size="md"
              className={cn("best-xi-pitch__avatar", modifierForConfidence(pick.confidence))}
            />
            <span className="best-xi-pitch__name">{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}
