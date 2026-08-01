import type { AiPick, AiPrediction } from "@/lib/types";
import type { SquadTarget } from "@/lib/squad-target";
import { getPlayerById } from "@/lib/data/players";
import { generateSelectionReason } from "@/lib/ai-selection-reason";

type PickInput = Omit<AiPick, "reason">;

// 選出理由（reason）は選手のダミーステータス（年齢・キャップ数・所属クラブ等）から
// generateSelectionReasonで計算する。手書きのプレーンテキストにはしない
// （選手データと矛盾しない文章にするため）。
function withReasons(target: SquadTarget, picks: PickInput[]): AiPick[] {
  return picks.map((pick) => {
    const player = getPlayerById(pick.playerId);
    return { ...pick, reason: player ? generateSelectionReason(player, target) : "" };
  });
}

const NEXT_PICKS: PickInput[] = [
  { playerId: "gk-03", x: 50, y: 86, confidence: 95 },
  { playerId: "df-05", x: 74, y: 70, confidence: 90 },
  { playerId: "df-03", x: 50, y: 73, confidence: 96 },
  { playerId: "df-06", x: 26, y: 70, confidence: 89 },
  { playerId: "mf-06", x: 84, y: 52, confidence: 93 },
  { playerId: "mf-03", x: 60, y: 55, confidence: 90 },
  { playerId: "mf-02", x: 40, y: 55, confidence: 88 },
  { playerId: "mf-07", x: 16, y: 52, confidence: 87 },
  { playerId: "mf-05", x: 63, y: 34, confidence: 91 },
  { playerId: "mf-01", x: 37, y: 34, confidence: 92 },
  { playerId: "fw-02", x: 50, y: 19, confidence: 94 },
];

const PICKS_2030: PickInput[] = [
  { playerId: "gk-03", x: 50, y: 86, confidence: 78 },
  { playerId: "df-08", x: 80, y: 68, confidence: 63 },
  { playerId: "df-09", x: 62, y: 73, confidence: 55 },
  { playerId: "df-10", x: 38, y: 73, confidence: 60 },
  { playerId: "df-07", x: 20, y: 68, confidence: 64 },
  { playerId: "mf-14", x: 65, y: 50, confidence: 65 },
  { playerId: "mf-02", x: 50, y: 54, confidence: 70 },
  { playerId: "mf-17", x: 35, y: 50, confidence: 62 },
  { playerId: "mf-08", x: 78, y: 25, confidence: 80 },
  { playerId: "fw-04", x: 50, y: 20, confidence: 58 },
  { playerId: "mf-10", x: 22, y: 25, confidence: 75 },
];

// AI予想ベストイレブン。next=次回選考（直近の代表招集）、2030=2030年FIFAワールドカップに向けた長期予想。
export const aiPredictions: Record<SquadTarget, AiPrediction> = {
  // 布陣・先発は2026年6月21日 対チュニジア戦（4-0勝利）で実際に採用された
  // 3-4-2-1システムとスタメンを基にしている。confidenceは演出用の参考値。
  next: {
    formationName: "3-4-2-1",
    generatedAt: "2026-07-01T09:00:00+09:00",
    source: "2026年6月21日 対チュニジア戦（4-0勝利）で採用された実際のシステムを基に予測",
    picks: withReasons("next", NEXT_PICKS),
  },

  // 現在の年齢・出場実績・伸びしろを踏まえた、2030年FIFAワールドカップ本大会に向けた長期シミュレーション。
  // 実際の試合結果に基づくものではなく、若手の成長を見込んだ参考予想のため、confidenceは次回選考予想より
  // 全体的に低め・幅広めに設定している（不確実性を反映）。formationは4-3-3。
  "2030": {
    formationName: "4-3-3",
    generatedAt: "2026-07-01T09:05:00+09:00",
    source: "現在の年齢・出場実績と今後の成長見込みを踏まえた、2030年FIFAワールドカップ本大会に向けた長期シミュレーション（若手選手の伸びしろを加味した参考予想）",
    picks: withReasons("2030", PICKS_2030),
  },
};
