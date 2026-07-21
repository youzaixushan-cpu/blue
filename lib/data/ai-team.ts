import type { AiPrediction } from "@/lib/types";
import type { SquadTarget } from "@/lib/squad-target";

// AI予想ベストイレブン。next=次回選考（直近の代表招集）、2030=2030年FIFAワールドカップに向けた長期予想。
export const aiPredictions: Record<SquadTarget, AiPrediction> = {
  // 布陣・先発は2026年6月21日 対チュニジア戦（4-0勝利）で実際に採用された
  // 3-4-2-1システムとスタメンを基にしている。confidence・reasonは演出用の参考値。
  next: {
    formationName: "3-4-2-1",
    generatedAt: "2026-07-01T09:00:00+09:00",
    source: "2026年6月21日 対チュニジア戦（4-0勝利）で採用された実際のシステムを基に予測",
    picks: [
      { playerId: "gk-03", x: 50, y: 86, confidence: 95, reason: "本大会でスタメンを掴んだ守護神。安定したセービングが持ち味。" },
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
  },

  // 現在の年齢・出場実績・伸びしろを踏まえた、2030年FIFAワールドカップ本大会に向けた長期シミュレーション。
  // 実際の試合結果に基づくものではなく、若手の成長を見込んだ参考予想のため、confidenceは次回選考予想より
  // 全体的に低め・幅広めに設定している（不確実性を反映）。formationは4-3-3。
  "2030": {
    formationName: "4-3-3",
    generatedAt: "2026-07-01T09:05:00+09:00",
    source: "現在の年齢・出場実績と今後の成長見込みを踏まえた、2030年FIFAワールドカップ本大会に向けた長期シミュレーション（若手選手の伸びしろを加味した参考予想）",
    picks: [
      { playerId: "gk-03", x: 50, y: 86, confidence: 78, reason: "23歳(2030年時点27歳)。すでに本大会でスタメンを掴んだ経験があり、守護神候補の筆頭であり続ける可能性が高い。" },
      { playerId: "df-08", x: 80, y: 68, confidence: 63, reason: "26歳(30歳)。対人の強さと攻撃参加を兼ね備え、右SBの軸になり得る。" },
      { playerId: "df-09", x: 62, y: 73, confidence: 55, reason: "22歳(26歳)。次世代CBとして期待される逸材。経験を積めば最終ラインの中心に。" },
      { playerId: "df-10", x: 38, y: 73, confidence: 60, reason: "21歳(25歳)。将来性豊かな長身CB。2030年には完成形に近づいている可能性がある。" },
      { playerId: "df-07", x: 20, y: 68, confidence: 64, reason: "26歳(30歳)。CB・SB双方をこなせる対応力の高さを評価。" },
      { playerId: "mf-14", x: 65, y: 50, confidence: 65, reason: "24歳(28歳)。運動量とインテンシティの高さが持ち味。中盤の推進力として台頭が期待される。" },
      { playerId: "mf-02", x: 50, y: 54, confidence: 70, reason: "25歳(29歳)。ボール奪取力に優れ、長期的にも中盤の底を支える存在。" },
      { playerId: "mf-17", x: 35, y: 50, confidence: 62, reason: "23歳(27歳)。ボックストゥボックスの資質を持つ次世代の中盤の柱候補。" },
      { playerId: "mf-08", x: 78, y: 25, confidence: 80, reason: "25歳(29歳)。世界トップクラスの技術と得点関与力で、2030年も攻撃の中心を担う可能性が高い。" },
      { playerId: "fw-04", x: 50, y: 20, confidence: 58, reason: "21歳(25歳)。将来のエース候補と目される高い決定力。伸びしろに大きな期待がかかる。" },
      { playerId: "mf-10", x: 22, y: 25, confidence: 75, reason: "29歳(33歳)。卓越したドリブル突破は年齢を重ねても武器であり続けると期待される。" },
    ],
  },
};
