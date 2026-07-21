import "./page.scss";
import type { Metadata } from "next";
import { getAllPlayers } from "@/lib/db/players";
import { aiPredictions } from "@/lib/data/ai-team";
import { DEFAULT_SQUAD_TARGET, isSquadTarget } from "@/lib/squad-target";
import { SectionHeading } from "@/components/shared/section-heading";
import { TargetLinkTabs } from "@/components/shared/target-link-tabs";
import { BestXiPitch } from "@/components/ai-team/best-xi-pitch";
import { PickList } from "@/components/ai-team/pick-list";

// DB管理データのため、ビルド時に静的化せず常に最新の内容を表示する
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI代表",
  description: "直近の代表戦データをもとにした、現時点で最も可能性の高いAI予想ベストイレブン。",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

interface AiTeamPageProps {
  searchParams: Promise<{ target?: string }>;
}

export default async function AiTeamPage({ searchParams }: AiTeamPageProps) {
  const { target: rawTarget } = await searchParams;
  const target = isSquadTarget(rawTarget) ? rawTarget : DEFAULT_SQUAD_TARGET;
  const prediction = aiPredictions[target];

  const players = await getAllPlayers();
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

  return (
    <div className="ai-team-page">
      <SectionHeading
        eyebrow="AI Prediction"
        title="AI代表"
        description="直近の代表戦データをもとにした、現時点で最も可能性の高いベストイレブンです。"
        action={<TargetLinkTabs active={target} basePath="/ai-team" />}
        className="ai-team-page__heading"
      />
      <p className="ai-team-page__updated">
        最終更新: {formatDate(prediction.generatedAt)} ・ フォーメーション:{" "}
        {prediction.formationName}
      </p>
      <p className="ai-team-page__source">{prediction.source}</p>

      <div className="ai-team-page__layout">
        <BestXiPitch prediction={prediction} players={playersById} />
        <PickList prediction={prediction} players={playersById} />
      </div>
    </div>
  );
}
