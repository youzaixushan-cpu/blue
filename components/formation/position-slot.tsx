"use client";

import "./position-slot.scss";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { PlayerToken } from "@/components/formation/player-token";
import type { FormationSlot, RosterMember } from "@/lib/types";

export function PositionSlot({
  slot,
  member,
  onRemove,
}: {
  slot: FormationSlot;
  member?: RosterMember;
  onRemove: () => void;
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
    </div>
  );
}
