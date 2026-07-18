import "./recent-results.scss";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { MatchResultCard } from "@/components/matches/match-result-card";
import { Button } from "@/components/ui/button";
import type { MatchResult, Player } from "@/lib/types";

export function RecentResults({
  recentResults,
  players,
}: {
  recentResults: MatchResult[];
  players: Record<string, Player>;
}) {
  const latestFive = recentResults.slice(0, 5);

  return (
    <section className="recent-results">
      <SectionHeading
        eyebrow="Results"
        title="直近の試合結果"
        action={
          <Button asChild variant="ghost" className="recent-results__see-all">
            <Link href="/matches">すべての試合を見る</Link>
          </Button>
        }
        className="recent-results__heading"
      />
      <div className="recent-results__grid">
        {latestFive.map((match) => (
          <MatchResultCard key={match.id} match={match} players={players} />
        ))}
      </div>
    </section>
  );
}
