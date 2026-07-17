import "./quick-links.scss";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allNavItems } from "@/lib/nav";
import { SectionHeading } from "@/components/shared/section-heading";

const DESCRIPTIONS: Record<string, string> = {
  "/": "最新情報をまとめてチェック",
  "/players": "全選手のプロフィールを検索",
  "/my-squad": "推し26人を集めてピッチに自由配置",
  "/matches": "全試合の結果とスケジュールを確認",
  "/ai-team": "AIが予想するベストイレブン",
  "/community": "みんなの人気選出をランキングで",
  "/mypage": "あなたのファン活動を管理",
};

export function QuickLinks() {
  const items = allNavItems.filter((item) => item.href !== "/");

  return (
    <section className="quick-links">
      <SectionHeading eyebrow="Explore" title="サービスをはじめる" className="quick-links__heading" />
      <div className="quick-links__grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="quick-links__card">
              <div className="quick-links__card-top">
                <span className="quick-links__card-icon">
                  <Icon />
                </span>
                <ArrowUpRight className="quick-links__card-arrow" />
              </div>
              <div>
                <p className="quick-links__card-title">{item.label}</p>
                <p className="quick-links__card-desc">{DESCRIPTIONS[item.href]}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
