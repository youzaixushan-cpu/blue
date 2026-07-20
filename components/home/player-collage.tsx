import "./player-collage.scss";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import type { Player } from "@/lib/types";

interface CollageSlot {
  playerId: string;
  size: "sm" | "md" | "lg" | "xl";
  top: number;
  left: number;
  rotate: number;
}

const COLLAGE_SLOTS: CollageSlot[] = [
  { playerId: "mf-08", size: "xl", top: 38, left: 46, rotate: -4 },
  { playerId: "mf-10", size: "lg", top: 12, left: 14, rotate: 6 },
  { playerId: "fw-02", size: "lg", top: 14, left: 78, rotate: -7 },
  { playerId: "mf-06", size: "md", top: 62, left: 10, rotate: 8 },
  { playerId: "df-05", size: "md", top: 66, left: 82, rotate: -5 },
  { playerId: "df-03", size: "sm", top: 90, left: 32, rotate: 10 },
  { playerId: "mf-11", size: "sm", top: 88, left: 66, rotate: -9 },
];

export function PlayerCollage({ players }: { players: Record<string, Player> }) {
  return (
    <div className="player-collage">
      {COLLAGE_SLOTS.map((slot) => {
        const player = players[slot.playerId];
        if (!player) return null;
        return (
          <div
            key={slot.playerId}
            className="player-collage__avatar"
            style={{
              top: `${slot.top}%`,
              left: `${slot.left}%`,
              "--collage-transform": `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
            } as React.CSSProperties}
          >
            <PlayerAvatar label={player.nameEn} seed={player.id} theme={player.avatarTheme} size={slot.size} />
          </div>
        );
      })}
    </div>
  );
}
