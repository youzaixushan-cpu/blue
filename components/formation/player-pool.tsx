"use client";

import "./player-pool.scss";
import { useDroppable } from "@dnd-kit/core";
import { PlayerToken } from "@/components/formation/player-token";
import { cn } from "@/lib/utils";
import type { RosterMember } from "@/lib/types";

export const POOL_ZONE_ID = "pool-zone";

export function PlayerPool({
  members,
  onRemove,
}: {
  members: RosterMember[];
  onRemove?: (memberId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: POOL_ZONE_ID });

  return (
    <div
      ref={setNodeRef}
      className={cn("player-pool", isOver && "player-pool--over")}
    >
      <div className="player-pool__header">
        <p className="player-pool__title">選手プール</p>
        <span className="player-pool__count">{members.length}人 未配置</span>
      </div>
      <div className="player-pool__list">
        {members.length === 0 ? (
          <p className="player-pool__empty">全員を配置済みです</p>
        ) : (
          members.map((member) => (
            <PlayerToken
              key={member.id}
              player={member}
              dragId={`pool:${member.id}`}
              origin="pool"
              variant="pool"
              onRemove={onRemove ? () => onRemove(member.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
