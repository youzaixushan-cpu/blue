import "./squad-detail-pitch.scss";
import { PitchLines } from "@/components/formation/pitch-lines";
import { PlayerAvatar } from "@/components/shared/player-avatar";
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
            <PlayerAvatar
              label={player?.nameEn ?? member.name}
              seed={player ? undefined : member.name}
              theme={player?.avatarTheme}
              size="sm"
              className="squad-detail-pitch__avatar"
            />
            <span className="squad-detail-pitch__name">{member.name}</span>
          </div>
        );
      })}
    </div>
  );
}
