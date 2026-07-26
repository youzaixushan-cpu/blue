import "./match-status-badge.scss";
import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/lib/squad-comparison";

const LABEL: Record<MatchStatus, string> = {
  hit: "的中",
  "predicted-miss": "落選予想",
  surprise: "サプライズ選出",
};

const MODIFIER: Record<MatchStatus, string> = {
  hit: "match-status-badge--hit",
  "predicted-miss": "match-status-badge--miss",
  surprise: "match-status-badge--surprise",
};

export function MatchStatusBadge({ status, className }: { status: MatchStatus; className?: string }) {
  return <span className={cn("match-status-badge", MODIFIER[status], className)}>{LABEL[status]}</span>;
}
