"use client";

import "./page.scss";
import { useSquad } from "@/lib/squad-context";
import { dummyUser } from "@/lib/data/user";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProfileCard } from "@/components/mypage/profile-card";
import { SummaryStats } from "@/components/mypage/summary-stats";
import { SettingsList } from "@/components/mypage/settings-list";

export default function MyPage() {
  const { members, players } = useSquad();
  const favoritePlayer = players.find((p) => p.id === dummyUser.favoritePlayerId);

  return (
    <div className="mypage-page">
      <SectionHeading eyebrow="My Page" title="マイページ" />
      <ProfileCard user={dummyUser} />
      <SummaryStats
        squadCount={members.length}
        favoriteFormation={dummyUser.favoriteFormation}
        favoritePlayerName={favoritePlayer?.name ?? "-"}
      />
      <SettingsList />
    </div>
  );
}
