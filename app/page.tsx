import { Hero } from "@/components/home/hero";
import { QuickLinks } from "@/components/home/quick-links";
import { StatsHighlight } from "@/components/home/stats-highlight";
import { RecentResults } from "@/components/home/recent-results";
import { getRecentResults } from "@/lib/db/matches";
import { getAllPlayers } from "@/lib/db/players";

// DB管理データのため、ビルド時に静的化せず常に最新の内容を表示する
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recentResults, players] = await Promise.all([getRecentResults(), getAllPlayers()]);
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

  return (
    <div>
      <Hero />
      <QuickLinks />
      <StatsHighlight />
      <RecentResults recentResults={recentResults} players={playersById} />
    </div>
  );
}
