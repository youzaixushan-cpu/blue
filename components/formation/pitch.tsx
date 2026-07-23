import "./pitch.scss";
import { PositionSlot } from "@/components/formation/position-slot";
import { PitchLines } from "@/components/formation/pitch-lines";
import { cn } from "@/lib/utils";
import type { FormationTemplate, RosterMember } from "@/lib/types";

export function Pitch({
  formation,
  assignments,
  members,
  onRemoveSlot,
  benchAssignments,
  showBench,
  onRemoveBenchSlot,
  ref,
}: {
  formation: FormationTemplate;
  assignments: Record<string, string>;
  members: Record<string, RosterMember>;
  onRemoveSlot: (slotId: string) => void;
  benchAssignments?: Record<string, string>;
  showBench?: boolean;
  onRemoveBenchSlot?: (slotId: string) => void;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className={cn("pitch", showBench && "pitch--with-bench")} ref={ref}>
      <PitchLines />
      {formation.slots.map((slot) => (
        <PositionSlot
          key={slot.id}
          slot={slot}
          member={assignments[slot.id] ? members[assignments[slot.id]] : undefined}
          onRemove={() => onRemoveSlot(slot.id)}
          benchMember={
            benchAssignments?.[slot.id] ? members[benchAssignments[slot.id]] : undefined
          }
          showBench={showBench ?? false}
          onRemoveBench={() => onRemoveBenchSlot?.(slot.id)}
        />
      ))}
    </div>
  );
}
