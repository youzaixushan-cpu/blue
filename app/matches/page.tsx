import "./page.scss";
import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { upcomingNotice } from "@/lib/data/matches";
import { getRecentResults } from "@/lib/db/matches";
import { getAllPlayers } from "@/lib/db/players";
import { SectionHeading } from "@/components/shared/section-heading";
import { MatchResultCard } from "@/components/matches/match-result-card";

// DB管理データのため、ビルド時に静的化せず常に最新の内容を表示する
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "試合結果・スケジュール",
  description: "2026年のSAMURAI BLUEの全試合結果と、今後の予定をまとめて確認できます。",
};

export default async function MatchesPage() {
  const [recentResults, players] = await Promise.all([getRecentResults(), getAllPlayers()]);
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

  return (
    <div className="matches-page">
      <SectionHeading
        eyebrow="Matches"
        title="試合結果・スケジュール"
        description="2026年のSAMURAI BLUEの全試合結果と、今後の予定をまとめて確認できます。"
        className="matches-page__heading"
      />

      <section className="matches-page__section">
        <h2 className="matches-page__section-title">今後の予定</h2>
        <div className="matches-page__notice">
          <CalendarClock className="matches-page__notice-icon" />
          <p>{upcomingNotice}</p>
        </div>
      </section>

      <section className="matches-page__section">
        <h2 className="matches-page__section-title">試合結果（{recentResults.length}試合）</h2>
        <div className="matches-page__list">
          {recentResults.map((match) => (
            <MatchResultCard key={match.id} match={match} players={playersById} detailed />
          ))}
        </div>
      </section>
    </div>
  );
}
