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

  // 控え枠は基本1人分だけ表示し、埋まったら次の1人分だけ追加で表示する
  // （最初から2人分の空き枠を出しっぱなしにすると、26人登録してもスカスカに
  // 見えてしまうため。上限のMAX_BENCH_PER_SLOTまでは埋まった数+1枠を出す）。
  const filledBenchCount = benchMembers.filter(Boolean).length;
  const benchSlotsToShow = Math.min(filledBenchCount + 1, MAX_BENCH_PER_SLOT);

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
        <div className={cn("position-slot__bench", member && "position-slot__bench--with-starter")}>
          {Array.from({ length: benchSlotsToShow }, (_, index) => (
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
