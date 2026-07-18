import "./pitch.scss";
import { PositionSlot } from "@/components/formation/position-slot";
import { PitchLines } from "@/components/formation/pitch-lines";
import type { FormationTemplate, RosterMember } from "@/lib/types";

export function Pitch({
  formation,
  assignments,
  members,
  onRemoveSlot,
  ref,
}: {
  formation: FormationTemplate;
  assignments: Record<string, string>;
  members: Record<string, RosterMember>;
  onRemoveSlot: (slotId: string) => void;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="pitch" ref={ref}>
      <PitchLines />
      {formation.slots.map((slot) => (
        <PositionSlot
          key={slot.id}
          slot={slot}
          member={assignments[slot.id] ? members[assignments[slot.id]] : undefined}
          onRemove={() => onRemoveSlot(slot.id)}
        />
      ))}
    </div>
  );
}
