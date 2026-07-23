"use client";

import "./position-slot.scss";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { PlayerToken } from "@/components/formation/player-token";
import type { FormationSlot, RosterMember } from "@/lib/types";

export const MAX_BENCH_PER_SLOT = 2;

function BenchSlot({
  slot,
  index,
  member,
  onRemove,
}: {
  slot: FormationSlot;
  index: number;
  member?: RosterMember;
  onRemove: () => void;
}) {
  const benchSlotId = `${slot.id}:${index}`;
  const { setNodeRef, isOver } = useDroppable({ id: `bench:${benchSlotId}` });

  return (
    <div ref={setNodeRef} className="position-slot__bench-slot">
      {member ? (
        <PlayerToken
          player={member}
          dragId={`bench:${benchSlotId}`}
          origin={`bench:${benchSlotId}`}
          variant="bench"
          onRemove={onRemove}
        />
      ) : (
        <div
          className={cn(
            "position-slot__bench-placeholder",
            isOver && "position-slot__bench-placeholder--over",
          )}
        >
          控え
        </div>
      )}
    </div>
  );
}

export function PositionSlot({
  slot,
  member,
  benchMembers,
  showBench,
  onRemove,
  onRemoveBench,
}: {
  slot: FormationSlot;
  member?: RosterMember;
  benchMembers: (RosterMember | undefined)[];
  showBench: boolean;
  onRemove: () => void;
  onRemoveBench: (index: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id });

  return (
    <div
      ref={setNodeRef}
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      className="position-slot"
    >
      {member ? (
        <PlayerToken
          player={member}
          dragId={`pitch:${slot.id}`}
          origin={slot.id}
          variant="pitch"
          onRemove={onRemove}
        />
      ) : (
        <div className={cn("position-slot__placeholder", isOver && "position-slot__placeholder--over")}>
          {slot.label}
        </div>
      )}

      {showBench && (
        <div className="position-slot__bench">
          {Array.from({ length: MAX_BENCH_PER_SLOT }, (_, index) => (
            <BenchSlot
              key={index}
              slot={slot}
              index={index}
              member={benchMembers[index]}
              onRemove={() => onRemoveBench(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
