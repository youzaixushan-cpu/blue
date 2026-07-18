import "./page.scss";
import type { Metadata } from "next";
import { getAllPlayers } from "@/lib/db/players";
import { PlayersBrowser } from "@/components/players/players-browser";
import { SectionHeading } from "@/components/shared/section-heading";

// DB管理データのため、ビルド時に静的化せず常に最新の内容を表示する
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "選手一覧",
  description: "SAMURAI BLUEの直近の招集メンバー26名のプロフィールを検索・閲覧できます。",
};

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="players-page">
      <SectionHeading
        eyebrow="Players"
        title="選手一覧"
        description="直近の招集メンバー26名のプロフィールを検索・閲覧できます。"
        className="players-page__heading"
      />

      <PlayersBrowser players={players} />
    </div>
  );
}
