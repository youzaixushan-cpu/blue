import "./stats-highlight.scss";
import { FIFA_RANKING } from "@/lib/data/site-stats";
import type { MatchResult } from "@/lib/types";

interface StatsHighlightProps {
  recentResults: MatchResult[];
  officialSquadCount: number;
}

export function StatsHighlight({ recentResults, officialSquadCount }: StatsHighlightProps) {
  if (recentResults.length === 0 && officialSquadCount === 0) return null;

  const win = recentResults.filter((m) => m.result === "win").length;
  const draw = recentResults.filter((m) => m.result === "draw").length;
  const lose = recentResults.filter((m) => m.result === "lose").length;

  const stats = [
    { label: `FIFAランキング（${FIFA_RANKING.asOf}時点）`, value: String(FIFA_RANKING.value), suffix: "位" },
    { label: "直近の通算成績", value: `${win}勝${draw}分${lose}敗`, suffix: "" },
    { label: "登録選手数", value: String(officialSquadCount), suffix: "人" },
  ];

  return (
    <section className="stats-highlight">
      <div className="stats-highlight__panel">
        <div className="stats-highlight__stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="stats-highlight__value">
                {stat.value}
                <span className="stats-highlight__suffix">{stat.suffix}</span>
              </p>
              <p className="stats-highlight__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
