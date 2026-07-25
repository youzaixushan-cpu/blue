import "./best-xi-pitch.scss";
import { PitchLines } from "@/components/formation/pitch-lines";
import { PitchFrame } from "@/components/formation/pitch-frame";
import { PitchPlayerMarker } from "@/components/formation/pitch-player-marker";
import type { AiPrediction, Player } from "@/lib/types";

function haloForConfidence(confidence: number) {
  if (confidence >= 90) return "best-xi-pitch__halo--high";
  if (confidence >= 80) return "best-xi-pitch__halo--good";
  if (confidence >= 70) return "best-xi-pitch__halo--fair";
  return "best-xi-pitch__halo--low";
}

export function BestXiPitch({
  prediction,
  players,
}: {
  prediction: AiPrediction;
  players: Record<string, Player>;
}) {
  return (
    <PitchFrame>
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
              <PitchPlayerMarker size="md" haloClassName={haloForConfidence(pick.confidence)} />
              <span className="best-xi-pitch__name">{player.name}</span>
            </div>
          );
        })}
      </div>
    </PitchFrame>
  );
}
