import { Hero } from "@/components/home/hero";
import { QuickLinks } from "@/components/home/quick-links";
import { StatsHighlight } from "@/components/home/stats-highlight";
import { RecentResults } from "@/components/home/recent-results";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <QuickLinks />
      <StatsHighlight />
      <RecentResults />
    </div>
  );
}
