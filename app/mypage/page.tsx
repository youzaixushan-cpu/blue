"use client";

import "./page.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSquad } from "@/lib/squad-context";
import { getFormationById } from "@/lib/data/formations";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProfileCard } from "@/components/mypage/profile-card";
import { SummaryStats } from "@/components/mypage/summary-stats";
import { SettingsList } from "@/components/mypage/settings-list";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  const { data: session, status } = useSession();
  const { members, assignments, formationId } = useSquad();

  if (status === "loading") {
    return <div className="mypage-page" />;
  }

  if (!session?.user) {
    return (
      <div className="mypage-page">
        <SectionHeading eyebrow="My Page" title="マイページ" />
        <p className="mypage-page__signed-out">
          マイページを見るにはログインが必要です。ログインすると「あなたの26人」がどの端末からでも同じ内容で見られるようになります。
          <br />
          なお、ログインしなくても選手一覧・試合結果・AI代表・みんなの代表・あなたの26人（この端末内）は引き続きご利用いただけます。
        </p>
        <Button asChild>
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    );
  }

  const formation = getFormationById(formationId);

  return (
    <div className="mypage-page">
      <SectionHeading eyebrow="My Page" title="マイページ" />
      <ProfileCard
        name={session.user.name ?? "サポーター"}
        email={session.user.email ?? ""}
        memberSince={
          session.user.createdAt
            ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long" }).format(
                new Date(session.user.createdAt),
              )
            : "-"
        }
      />
      <SummaryStats
        squadCount={members.length}
        assignedCount={Object.keys(assignments).length}
        formationName={formation?.name ?? "-"}
      />
      <SettingsList />
    </div>
  );
}
