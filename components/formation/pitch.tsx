import "./pitch.scss";
import { PositionSlot, MAX_BENCH_PER_SLOT } from "@/components/formation/position-slot";
import { PitchLines } from "@/components/formation/pitch-lines";
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
  onRemoveBenchSlot?: (benchSlotId: string) => void;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="pitch" ref={ref}>
      <PitchLines />
      {formation.slots.map((slot) => {
        const benchMembers = Array.from({ length: MAX_BENCH_PER_SLOT }, (_, index) => {
          const memberId = benchAssignments?.[`${slot.id}:${index}`];
          return memberId ? members[memberId] : undefined;
        });

        return (
          <PositionSlot
            key={slot.id}
            slot={slot}
            member={assignments[slot.id] ? members[assignments[slot.id]] : undefined}
            onRemove={() => onRemoveSlot(slot.id)}
            benchMembers={benchMembers}
            showBench={showBench ?? false}
            onRemoveBench={(index) => onRemoveBenchSlot?.(`${slot.id}:${index}`)}
          />
        );
      })}
    </div>
  );
}
