import "./hero.scss";
import Link from "next/link";
import { ArrowRight, CalendarClock, Flame, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { upcomingNotice } from "@/lib/data/matches";
import { aiPredictions } from "@/lib/data/ai-team";
import { BestXiPitch } from "@/components/ai-team/best-xi-pitch";
import type { CommunitySquad, Player, PlayerRanking } from "@/lib/types";

const aiPrediction = aiPredictions.next;

interface HeroProps {
  players: Record<string, Player>;
  playerCount: number;
  squadCount: number;
  topSquad: CommunitySquad | null;
  topRanking: PlayerRanking | null;
}

export function Hero({ players, playerCount, squadCount, topSquad, topRanking }: HeroProps) {
  const topRankingPlayer = topRanking ? players[topRanking.playerId] : null;

  return (
    <section className="hero">
      <div aria-hidden className="hero__glow" />
      <div aria-hidden className="hero__blob" />
      <div className="hero__inner">
        <div className="hero__intro">
          <p className="hero__badge">
            <span className="hero__badge-dot" aria-hidden />
            ROAD TO 2030 FIFA WORLD CUP
          </p>
          <h1 className="hero__title">
            SAMURAI BLUE
            <br />
            <span className="hero__title-sub">を、もっと近くで。</span>
          </h1>
          <p className="hero__description">
            2030年、世界の頂点へ。最新の試合結果から選手データ、あなただけの代表チーム作りまで
            — 日本代表を愛する全てのファンと一緒に、その舞台まで盛り上がっていこう。
          </p>
          <div className="hero__actions">
            <Button asChild size="lg" className="hero__cta hero__cta--primary">
              <Link href="/players">
                選手一覧を見る
                <ArrowRight className="hero__cta-icon" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hero__cta hero__cta--secondary"
            >
              <Link href="/my-squad">あなたの26人を作る</Link>
            </Button>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <Users className="hero__stat-icon" />
              <span className="hero__stat-value">{playerCount}</span>
              <span className="hero__stat-label">名の代表候補</span>
            </div>
            <div className="hero__stat">
              <TrendingUp className="hero__stat-icon" />
              <span className="hero__stat-value">{squadCount}</span>
              <span className="hero__stat-label">件のみんなの編成</span>
            </div>
            <div className="hero__stat">
              <Sparkles className="hero__stat-icon" />
              <span className="hero__stat-value">{aiPrediction.formationName}</span>
              <span className="hero__stat-label">AI予想フォーメーション</span>
            </div>
          </div>

          <p className="hero__notice">
            <CalendarClock className="hero__notice-icon" />
            {upcomingNotice}
          </p>
        </div>

        <div className="hero__showcase">
          {topRankingPlayer && topRanking && (
            <Link href="/community" className="hero__showcase-card hero__showcase-card--back">
              <p className="hero__showcase-card-eyebrow">
                <TrendingUp className="hero__showcase-card-eyebrow-icon" />
                選出率1位
              </p>
              <p className="hero__showcase-card-title">{topRankingPlayer.name}</p>
              <p className="hero__showcase-card-meta">選出率 {topRanking.selectionRate}%</p>
            </Link>
          )}

          {topSquad && (
            <Link
              href={`/community/${topSquad.id}`}
              className="hero__showcase-card hero__showcase-card--middle"
            >
              <p className="hero__showcase-card-eyebrow">
                <Flame className="hero__showcase-card-eyebrow-icon" />
                注目の編成
              </p>
              <p className="hero__showcase-card-title">{topSquad.title}</p>
              <p className="hero__showcase-card-meta">
                {topSquad.formationName} ・ {topSquad.likes}いいね
              </p>
            </Link>
          )}

          <Link href="/ai-team" className="hero__showcase-card hero__showcase-card--front">
            <p className="hero__showcase-card-eyebrow">
              <Sparkles className="hero__showcase-card-eyebrow-icon" />
              AI代表 最新予想
            </p>
            <div className="hero__showcase-pitch">
              <BestXiPitch prediction={aiPrediction} players={players} />
            </div>
            <p className="hero__showcase-card-link">
              {aiPrediction.formationName}のベストイレブンを見る
              <ArrowRight className="hero__showcase-card-link-icon" />
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
