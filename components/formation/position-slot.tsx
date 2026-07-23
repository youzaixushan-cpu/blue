"use client";

import "./position-slot.scss";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { PlayerToken } from "@/components/formation/player-token";
import type { FormationSlot, RosterMember } from "@/lib/types";

export function PositionSlot({
  slot,
  member,
  benchMember,
  showBench,
  onRemove,
  onRemoveBench,
}: {
  slot: FormationSlot;
  member?: RosterMember;
  benchMember?: RosterMember;
  showBench: boolean;
  onRemove: () => void;
  onRemoveBench: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id });
  const { setNodeRef: setBenchNodeRef, isOver: isBenchOver } = useDroppable({
    id: `bench:${slot.id}`,
  });

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
        <div ref={setBenchNodeRef} className="position-slot__bench">
          {benchMember ? (
            <PlayerToken
              player={benchMember}
              dragId={`bench:${slot.id}`}
              origin={`bench:${slot.id}`}
              variant="bench"
              onRemove={onRemoveBench}
            />
          ) : (
            <div
              className={cn(
                "position-slot__bench-placeholder",
                isBenchOver && "position-slot__bench-placeholder--over",
              )}
            >
              控え
            </div>
          )}
        </div>
      )}
    </div>
  );
}
