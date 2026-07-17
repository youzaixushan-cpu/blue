import "./recent-results.scss";
import Link from "next/link";
import { recentResults } from "@/lib/data/matches";
import { SectionHeading } from "@/components/shared/section-heading";
import { MatchResultCard } from "@/components/matches/match-result-card";
import { Button } from "@/components/ui/button";

export function RecentResults() {
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
          <MatchResultCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
