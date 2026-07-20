import "./hero.scss";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { upcomingNotice } from "@/lib/data/matches";
import { PlayerCollage } from "@/components/home/player-collage";
import type { Player } from "@/lib/types";

export function Hero({ players }: { players: Record<string, Player> }) {
  return (
    <section className="hero">
      <div aria-hidden className="hero__glow" />
      <div aria-hidden className="hero__blob" />
      <div className="hero__inner">
        <div className="hero__intro">
          <p className="hero__eyebrow">JAPAN NATIONAL FOOTBALL TEAM</p>
          <h1 className="hero__title">
            SAMURAI BLUE
            <br />
            <span className="hero__title-sub">を、もっと近くで。</span>
          </h1>
          <p className="hero__description">
            最新の試合結果から選手データ、あなただけの代表チーム作りまで。日本代表を愛する全てのファンのためのハブ。
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
          <p className="hero__notice">
            <CalendarClock className="hero__notice-icon" />
            {upcomingNotice}
          </p>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-glow" aria-hidden />
          <PlayerCollage players={players} />
        </div>
      </div>
    </section>
  );
}
