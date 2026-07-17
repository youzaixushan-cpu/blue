import "./match-result-card.scss";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlayerById } from "@/lib/data/players";
import { MatchLineupPitch } from "@/components/matches/match-lineup-pitch";
import type { MatchResult } from "@/lib/types";

const RESULT_LABEL = { win: "勝", draw: "分", lose: "負" } as const;
const RESULT_MODIFIER = {
  win: "match-result-card__result--win",
  draw: "match-result-card__result--draw",
  lose: "match-result-card__result--lose",
} as const;

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export function MatchResultCard({
  match,
  detailed = false,
}: {
  match: MatchResult;
  detailed?: boolean;
}) {
  const scorers = [...match.scorers].sort((a, b) => a.minute - b.minute);

  return (
    <div className="match-result-card">
      <div className="match-result-card__top">
        <div className="match-result-card__meta">
          <span className="match-result-card__date">{formatDate(match.date)}</span>
          <span className="match-result-card__competition">{match.competition}</span>
        </div>
        <span className={cn("match-result-card__result", RESULT_MODIFIER[match.result])}>
          {RESULT_LABEL[match.result]}
        </span>
      </div>

      <div className="match-result-card__main">
        <p className="match-result-card__opponent">
          {match.opponentFlag} vs {match.opponent}
        </p>
        <p className="match-result-card__score">{match.score}</p>
      </div>

      {detailed && (
        <p className="match-result-card__venue">
          <MapPin className="match-result-card__venue-icon" />
          {match.venue}
        </p>
      )}

      {scorers.length > 0 && (
        <div className="match-result-card__scorers">
          <span className="match-result-card__scorers-label">得点者</span>
          {scorers.map((scorer, index) => {
            const player = getPlayerById(scorer.playerId);
            return (
              <span key={index} className="match-result-card__scorer">
                {player?.name ?? "不明"}
                <span className="match-result-card__scorer-minute">{scorer.minute}&apos;</span>
              </span>
            );
          })}
        </div>
      )}

      {detailed && match.lineup.length > 0 && (
        <div className="match-result-card__lineup">
          <p className="match-result-card__lineup-title">先発11人</p>
          <MatchLineupPitch lineup={match.lineup} />
        </div>
      )}
    </div>
  );
}
