import type { AiPrediction } from "@/lib/types";

// AI予想ベストイレブン（単一の最新予想のみを表示する）
// 布陣・先発は2026年6月21日 対チュニジア戦（4-0勝利）で実際に採用された
// 3-4-2-1システムとスタメンを基にしている。confidence・reasonは演出用の参考値。
export const aiPrediction: AiPrediction = {
  formationName: "3-4-2-1",
  generatedAt: "2026-07-01T09:00:00+09:00",
  source: "2026年6月21日 対チュニジア戦（4-0勝利）で採用された実際のシステムを基に予測",
  picks: [
    { playerId: "gk-03", x: 50, y: 83, confidence: 95, reason: "本大会でスタメンを掴んだ守護神。安定したセービングが持ち味。" },
    { playerId: "df-05", x: 74, y: 70, confidence: 90, reason: "3バック右のCB。対人守備とカバーリングの範囲の広さを評価。" },
    { playerId: "df-03", x: 50, y: 73, confidence: 96, reason: "キャプテンとして最終ラインを統率する中心選手。" },
    { playerId: "df-06", x: 26, y: 70, confidence: 89, reason: "左利きの展開力でビルドアップの起点になれる。" },
    { playerId: "mf-06", x: 84, y: 52, confidence: 93, reason: "4-2-3-1脇からのカットインで違いを作れる右のアタッカー。" },
    { playerId: "mf-03", x: 60, y: 55, confidence: 90, reason: "運動量と展開力を兼ね備えた中盤の推進役。" },
    { playerId: "mf-02", x: 40, y: 55, confidence: 88, reason: "ボール奪取からの展開力で中盤のバランスを取る。" },
    { playerId: "mf-07", x: 16, y: 52, confidence: 87, reason: "スピードと得点感覚を活かした左のアタッカー。" },
    { playerId: "mf-05", x: 63, y: 34, confidence: 91, reason: "シャドーの位置から裏抜けとフィニッシュで違いを作る。" },
    { playerId: "mf-01", x: 37, y: 34, confidence: 92, reason: "得点・アシストの両面で関与できるシャドーストライカー。" },
    { playerId: "fw-02", x: 50, y: 19, confidence: 94, reason: "決定力と空間把握力が突出したエースストライカー。" },
  ],
};
