"use client";

import "./page.scss";
import { useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { ArrowLeft, Download, X as XIcon } from "lucide-react";
import { useSquad } from "@/lib/squad-context";
import { SectionHeading } from "@/components/shared/section-heading";
import { SquadComparisonPanel } from "@/components/squad/squad-comparison-panel";
import { Button } from "@/components/ui/button";

export default function MyPageResultsPage() {
  const { membersByTarget, players, isHydrated } = useSquad();
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleExportImage() {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "samurai-blue-results-next.png";
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("画像の書き出しに失敗しました");
    }
  }

  function handleShareX() {
    const text = "「次回の試合」の予想結果をチェックしました！ #SAMURAIBLUE";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  if (!isHydrated) {
    return <div className="mypage-results-page" />;
  }

  return (
    <div className="mypage-results-page">
      <Link href="/mypage" className="mypage-results-page__back">
        <ArrowLeft className="mypage-results-page__back-icon" />
        マイページに戻る
      </Link>

      <SectionHeading
        eyebrow="Results"
        title="次回の試合 結果"
        description="あなたの26人と公式発表メンバーの一致率を確認できます。"
        className="mypage-results-page__heading"
      />

      <div className="mypage-results-page__actions">
        <Button variant="outline" className="mypage-results-page__action" onClick={handleExportImage}>
          <Download className="mypage-results-page__action-icon" />
          画像で保存
        </Button>
        <Button variant="outline" className="mypage-results-page__action" onClick={handleShareX}>
          <XIcon className="mypage-results-page__action-icon" />
          Xでシェア
        </Button>
      </div>

      <div ref={resultRef}>
        <SquadComparisonPanel members={membersByTarget.next} players={players} />
      </div>
    </div>
  );
}
