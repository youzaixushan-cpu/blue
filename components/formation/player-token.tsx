"use client";

import "./player-token.scss";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PitchPlayerMarker } from "@/components/formation/pitch-player-marker";
import { PositionBadge } from "@/components/players/position-badge";
import { cn } from "@/lib/utils";
import type { RosterMember } from "@/lib/types";

interface PlayerTokenProps {
  player: RosterMember;
  dragId: string;
  origin: "pool" | string;
  variant: "pitch" | "pool" | "bench";
  onRemove?: () => void;
}

export function PlayerToken({ player, dragId, origin, variant, onRemove }: PlayerTokenProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    data: { memberId: player.id, origin },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  if (variant === "bench") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn("player-token", "player-token--bench", isDragging && "player-token--dragging")}
      >
        <span className="player-token__bench-label">（{player.name}）</span>
        {onRemove && (
          <button
            type="button"
            aria-label="ベンチから外す"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="player-token__bench-remove"
          >
            <X className="player-token__remove-icon" />
          </button>
        )}
      </div>
    );
  }

  if (variant === "pool") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn("player-token", "player-token--pool", isDragging && "player-token--dragging")}
      >
        <PlayerAvatar label={player.nameEn} theme={player.avatarTheme} size="sm" />
        <div className="player-token__body">
          <p className="player-token__name">{player.name}</p>
          <p className="player-token__club">{player.club}</p>
        </div>
        <PositionBadge position={player.position} />
        {onRemove && (
          <button
            type="button"
            aria-label="あなたの26人から外す"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="player-token__pool-remove"
          >
            <X className="player-token__remove-icon" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("player-token", "player-token--pitch", isDragging && "player-token--dragging")}
    >
      <div {...listeners} {...attributes} className="player-token__handle">
        <PitchPlayerMarker seed={player.nameEn} theme={player.avatarTheme} size="md" />
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label="配置を外す"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="player-token__remove"
        >
          <X className="player-token__remove-icon" />
        </button>
      )}
      <span className="player-token__label">{player.name}</span>
    </div>
  );
}
