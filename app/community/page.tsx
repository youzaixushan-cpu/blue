import "./page.scss";
import type { Metadata } from "next";
import { getPlayerRankings, getFormationRankings, getCommunitySquads } from "@/lib/db/community";
import { getAllPlayers } from "@/lib/db/players";
import { DEFAULT_SQUAD_TARGET, isSquadTarget } from "@/lib/squad-target";
import { SectionHeading } from "@/components/shared/section-heading";
import { TargetLinkTabs } from "@/components/shared/target-link-tabs";
import { PlayerRankingList } from "@/components/community/player-ranking-list";
import { FormationRankingList } from "@/components/community/formation-ranking";
import { TrendingSquads } from "@/components/community/trending-squads";

// 投稿ごとにランキング・投稿一覧が変わるため、ビルド時に静的化せず常に最新のDB内容を表示する
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "みんなの代表",
  description: "全国のファンが選んだ「あなたの26人」を集計。人気選手・人気フォーメーションが分かります。",
};

interface CommunityPageProps {
  searchParams: Promise<{ target?: string }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { target: rawTarget } = await searchParams;
  const target = isSquadTarget(rawTarget) ? rawTarget : DEFAULT_SQUAD_TARGET;

  const [playerRankings, formationRankings, communitySquads, players] = await Promise.all([
    getPlayerRankings(target),
    getFormationRankings(target),
    getCommunitySquads(target),
    getAllPlayers(),
  ]);
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

  return (
    <div className="community-page">
      <SectionHeading
        eyebrow="Community"
        title="みんなの代表"
        description="全国のファンが選んだ「あなたの26人」を集計。人気選手・人気フォーメーションが分かります。"
        action={<TargetLinkTabs active={target} basePath="/community" />}
      />

      <section>
        <h2 className="community-page__section-title">人気フォーメーション TOP3</h2>
        {formationRankings.length > 0 ? (
          <FormationRankingList rankings={formationRankings} />
        ) : (
          <p className="community-page__empty">まだ投稿がありません。「あなたの26人」から布陣を投稿してみましょう。</p>
        )}
      </section>

      <section>
        <h2 className="community-page__section-title">選手選出率ランキング</h2>
        {playerRankings.length > 0 ? (
          <PlayerRankingList rankings={playerRankings} players={playersById} />
        ) : (
          <p className="community-page__empty">まだ集計データがありません。</p>
        )}
      </section>

      <section>
        <h2 className="community-page__section-title">みんなの注目チーム編成</h2>
        {communitySquads.length > 0 ? (
          <TrendingSquads squads={communitySquads} players={playersById} />
        ) : (
          <p className="community-page__empty">まだ投稿がありません。最初の投稿者になりましょう！</p>
        )}
      </section>
    </div>
  );
}
