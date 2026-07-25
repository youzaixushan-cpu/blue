import "./squad-detail-pitch.scss";
import { PitchLines } from "@/components/formation/pitch-lines";
import { PitchFrame } from "@/components/formation/pitch-frame";
import { PitchPlayerMarker } from "@/components/formation/pitch-player-marker";
import type { FormationTemplate, Player, Position } from "@/lib/types";

export interface SquadDetailMember {
  slotId: string;
  playerId: string | null;
  name: string;
  position: Position;
}

export function SquadDetailPitch({
  formation,
  members,
  players,
}: {
  formation: FormationTemplate;
  members: SquadDetailMember[];
  players: Record<string, Player>;
}) {
  const memberBySlot = Object.fromEntries(members.map((m) => [m.slotId, m]));

  return (
    <PitchFrame>
      <div className="squad-detail-pitch">
        <PitchLines />
        {formation.slots.map((slot) => {
          const member = memberBySlot[slot.id];
          if (!member) return null;
          const player = member.playerId ? players[member.playerId] : undefined;

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              className="squad-detail-pitch__slot"
            >
              <PitchPlayerMarker
                seed={player?.nameEn ?? member.name}
                theme={player?.avatarTheme}
                size="sm"
              />
              <span className="squad-detail-pitch__name">{member.name}</span>
            </div>
          );
        })}
      </div>
    </PitchFrame>
  );
}
