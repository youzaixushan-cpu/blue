import type { FormationTemplate } from "@/lib/types";

// x, y は縦向きピッチ上のパーセンテージ座標（y: 小さいほど相手ゴール側、大きいほど自陣ゴール側）
// GK/DFラインは、選手アバター＋名前ラベルがピッチ外にはみ出さないよう
// 中央(y:50)寄りに圧縮した値にしている（詳細は match-lineup-pitch などのCSSコメント参照）。
export const formationTemplates: FormationTemplate[] = [
  {
    id: "f-433",
    name: "4-3-3",
    description: "両ウイングが幅を取り、中盤の3枚が主導権を握る攻撃的布陣",
    slots: [
      { id: "f433-gk", label: "GK", x: 50, y: 84 },
      { id: "f433-rb", label: "RB", x: 80, y: 68 },
      { id: "f433-cb1", label: "CB", x: 62, y: 73 },
      { id: "f433-cb2", label: "CB", x: 38, y: 73 },
      { id: "f433-lb", label: "LB", x: 20, y: 68 },
      { id: "f433-rcm", label: "MF", x: 65, y: 50 },
      { id: "f433-cm", label: "MF", x: 50, y: 54 },
      { id: "f433-lcm", label: "MF", x: 35, y: 50 },
      { id: "f433-rw", label: "FW", x: 78, y: 25 },
      { id: "f433-st", label: "FW", x: 50, y: 20 },
      { id: "f433-lw", label: "FW", x: 22, y: 25 },
    ],
  },
  {
    id: "f-442",
    name: "4-4-2",
    description: "バランス重視のオーソドックスな2トップ布陣",
    slots: [
      { id: "f442-gk", label: "GK", x: 50, y: 84 },
      { id: "f442-rb", label: "RB", x: 80, y: 68 },
      { id: "f442-cb1", label: "CB", x: 62, y: 73 },
      { id: "f442-cb2", label: "CB", x: 38, y: 73 },
      { id: "f442-lb", label: "LB", x: 20, y: 68 },
      { id: "f442-rm", label: "MF", x: 82, y: 47 },
      { id: "f442-rcm", label: "MF", x: 58, y: 52 },
      { id: "f442-lcm", label: "MF", x: 42, y: 52 },
      { id: "f442-lm", label: "MF", x: 18, y: 47 },
      { id: "f442-st1", label: "FW", x: 62, y: 22 },
      { id: "f442-st2", label: "FW", x: 38, y: 22 },
    ],
  },
  {
    id: "f-4231",
    name: "4-2-3-1",
    description: "2ボランチが土台を作り、3枚のシャドーが流動的に仕掛ける布陣",
    slots: [
      { id: "f4231-gk", label: "GK", x: 50, y: 84 },
      { id: "f4231-rb", label: "RB", x: 80, y: 68 },
      { id: "f4231-cb1", label: "CB", x: 62, y: 73 },
      { id: "f4231-cb2", label: "CB", x: 38, y: 73 },
      { id: "f4231-lb", label: "LB", x: 20, y: 68 },
      { id: "f4231-rdm", label: "MF", x: 62, y: 57 },
      { id: "f4231-ldm", label: "MF", x: 38, y: 57 },
      { id: "f4231-ram", label: "MF", x: 75, y: 37 },
      { id: "f4231-cam", label: "MF", x: 50, y: 34 },
      { id: "f4231-lam", label: "MF", x: 25, y: 37 },
      { id: "f4231-st", label: "FW", x: 50, y: 19 },
    ],
  },
  {
    id: "f-343",
    name: "3-4-3",
    description: "3バックとウイングバックで幅を確保する超攻撃的布陣",
    slots: [
      { id: "f343-gk", label: "GK", x: 50, y: 84 },
      { id: "f343-cb1", label: "CB", x: 70, y: 73 },
      { id: "f343-cb2", label: "CB", x: 50, y: 76 },
      { id: "f343-cb3", label: "CB", x: 30, y: 73 },
      { id: "f343-rm", label: "MF", x: 85, y: 50 },
      { id: "f343-rcm", label: "MF", x: 60, y: 53 },
      { id: "f343-lcm", label: "MF", x: 40, y: 53 },
      { id: "f343-lm", label: "MF", x: 15, y: 50 },
      { id: "f343-rw", label: "FW", x: 75, y: 25 },
      { id: "f343-st", label: "FW", x: 50, y: 20 },
      { id: "f343-lw", label: "FW", x: 25, y: 25 },
    ],
  },
  {
    id: "f-352",
    name: "3-5-2",
    description: "中盤5枚で数的優位を作り、2トップが最前線で仕留める布陣",
    slots: [
      { id: "f352-gk", label: "GK", x: 50, y: 84 },
      { id: "f352-cb1", label: "CB", x: 70, y: 73 },
      { id: "f352-cb2", label: "CB", x: 50, y: 76 },
      { id: "f352-cb3", label: "CB", x: 30, y: 73 },
      { id: "f352-rwb", label: "MF", x: 88, y: 52 },
      { id: "f352-rcm", label: "MF", x: 65, y: 48 },
      { id: "f352-cm", label: "MF", x: 50, y: 53 },
      { id: "f352-lcm", label: "MF", x: 35, y: 48 },
      { id: "f352-lwb", label: "MF", x: 12, y: 52 },
      { id: "f352-st1", label: "FW", x: 60, y: 22 },
      { id: "f352-st2", label: "FW", x: 40, y: 22 },
    ],
  },
];

export function getFormationById(id: string): FormationTemplate | undefined {
  return formationTemplates.find((f) => f.id === id);
}
