import "./page.scss";
import { players } from "@/lib/data/players";
import { aiPrediction } from "@/lib/data/ai-team";
import { SectionHeading } from "@/components/shared/section-heading";
import { BestXiPitch } from "@/components/ai-team/best-xi-pitch";
import { PickList } from "@/components/ai-team/pick-list";

const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AiTeamPage() {
  return (
    <div className="ai-team-page">
      <SectionHeading
        eyebrow="AI Prediction"
        title="AI代表"
        description="直近の代表戦データをもとにした、現時点で最も可能性の高いベストイレブンです。"
        className="ai-team-page__heading"
      />
      <p className="ai-team-page__updated">
        最終更新: {formatDate(aiPrediction.generatedAt)} ・ フォーメーション:{" "}
        {aiPrediction.formationName}
      </p>
      <p className="ai-team-page__source">{aiPrediction.source}</p>

      <div className="ai-team-page__layout">
        <BestXiPitch prediction={aiPrediction} players={playersById} />
        <PickList prediction={aiPrediction} players={playersById} />
      </div>
    </div>
  );
}
