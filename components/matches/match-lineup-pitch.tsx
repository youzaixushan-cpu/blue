import "./match-lineup-pitch.scss";
import { PitchLines } from "@/components/formation/pitch-lines";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { getPlayerById } from "@/lib/data/players";
import type { MatchLineupEntry } from "@/lib/types";

export function MatchLineupPitch({ lineup }: { lineup: MatchLineupEntry[] }) {
  return (
    <div className="match-lineup-pitch">
      <PitchLines />
      {lineup.map((entry) => {
        const player = getPlayerById(entry.playerId);
        if (!player) return null;
        return (
          <div
            key={entry.playerId}
            style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
            className="match-lineup-pitch__slot"
          >
            <PlayerAvatar
              label={player.nameEn}
              theme={player.avatarTheme}
              size="sm"
              className="match-lineup-pitch__avatar"
            />
            <span className="match-lineup-pitch__name">{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}
