import "./position-badge.scss";
import { cn } from "@/lib/utils";
import type { Position } from "@/lib/types";

const MODIFIER: Record<Position, string> = {
  GK: "position-badge--gk",
  DF: "position-badge--df",
  MF: "position-badge--mf",
  FW: "position-badge--fw",
};

export function PositionBadge({
  position,
  className,
}: {
  position: Position;
  className?: string;
}) {
  return (
    <span className={cn("position-badge", MODIFIER[position], className)}>{position}</span>
  );
}
