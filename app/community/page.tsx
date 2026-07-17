import "./page.scss";
import { playerRankings, formationRankings, communitySquads } from "@/lib/data/community";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlayerRankingList } from "@/components/community/player-ranking-list";
import { FormationRankingList } from "@/components/community/formation-ranking";
import { TrendingSquads } from "@/components/community/trending-squads";

export default function CommunityPage() {
  return (
    <div className="community-page">
      <SectionHeading
        eyebrow="Community"
        title="みんなの代表"
        description="全国のファンが選んだ「あなたの26人」を集計。人気選手・人気フォーメーションが分かります。"
      />

      <section>
        <h2 className="community-page__section-title">人気フォーメーション TOP3</h2>
        <FormationRankingList rankings={formationRankings} />
      </section>

      <section>
        <h2 className="community-page__section-title">選手選出率ランキング</h2>
        <PlayerRankingList rankings={playerRankings} />
      </section>

      <section>
        <h2 className="community-page__section-title">みんなの注目チーム編成</h2>
        <TrendingSquads squads={communitySquads} />
      </section>
    </div>
  );
}
