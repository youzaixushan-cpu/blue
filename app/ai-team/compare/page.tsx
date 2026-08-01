import "./page.scss";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPlayers } from "@/lib/db/players";
import { aiPredictions } from "@/lib/data/ai-team";
import { DEFAULT_SQUAD_TARGET, isSquadTarget, squadTargetShortLabel } from "@/lib/squad-target";
import { SectionHeading } from "@/components/shared/section-heading";
import { AiComparePanel } from "@/components/ai-team/ai-compare-panel";

export const metadata: Metadata = {
  title: "AI代表との比較",
  description: "あなたの26人とAI代表の予想を比較し、一致率を確認できます。",
};

interface AiComparePageProps {
  searchParams: Promise<{ target?: string }>;
}

export default async function AiComparePage({ searchParams }: AiComparePageProps) {
  const { target: rawTarget } = await searchParams;
  const target = isSquadTarget(rawTarget) ? rawTarget : DEFAULT_SQUAD_TARGET;
  const prediction = aiPredictions[target];
  const aiPlayerIds = prediction.picks.map((p) => p.playerId);

  const players = await getAllPlayers();

  return (
    <div className="ai-compare-page">
      <Link href="/ai-team" className="ai-compare-page__back">
        <ArrowLeft className="ai-compare-page__back-icon" />
        AI代表に戻る
      </Link>

      <SectionHeading
        eyebrow="Compare"
        title="AI代表との比較"
        description={`「${squadTargetShortLabel(target)}」のAI代表とあなたの26人を比較します。`}
        className="ai-compare-page__heading"
      />

      <AiComparePanel target={target} aiPlayerIds={aiPlayerIds} players={players} />
    </div>
  );
}
