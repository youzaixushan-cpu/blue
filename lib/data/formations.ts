import type { FormationTemplate } from "@/lib/types";

// x, y は縦向きピッチ上のパーセンテージ座標（y: 0=相手ゴール側, 100=自陣ゴール側）
export const formationTemplates: FormationTemplate[] = [
  {
    id: "f-433",
    name: "4-3-3",
    description: "両ウイングが幅を取り、中盤の3枚が主導権を握る攻撃的布陣",
    slots: [
      { id: "f433-gk", label: "GK", x: 50, y: 92 },
      { id: "f433-rb", label: "RB", x: 80, y: 72 },
      { id: "f433-cb1", label: "CB", x: 62, y: 78 },
      { id: "f433-cb2", label: "CB", x: 38, y: 78 },
      { id: "f433-lb", label: "LB", x: 20, y: 72 },
      { id: "f433-rcm", label: "MF", x: 65, y: 50 },
      { id: "f433-cm", label: "MF", x: 50, y: 55 },
      { id: "f433-lcm", label: "MF", x: 35, y: 50 },
      { id: "f433-rw", label: "FW", x: 78, y: 20 },
      { id: "f433-st", label: "FW", x: 50, y: 13 },
      { id: "f433-lw", label: "FW", x: 22, y: 20 },
    ],
  },
  {
    id: "f-442",
    name: "4-4-2",
    description: "バランス重視のオーソドックスな2トップ布陣",
    slots: [
      { id: "f442-gk", label: "GK", x: 50, y: 92 },
      { id: "f442-rb", label: "RB", x: 80, y: 72 },
      { id: "f442-cb1", label: "CB", x: 62, y: 78 },
      { id: "f442-cb2", label: "CB", x: 38, y: 78 },
      { id: "f442-lb", label: "LB", x: 20, y: 72 },
      { id: "f442-rm", label: "MF", x: 82, y: 46 },
      { id: "f442-rcm", label: "MF", x: 58, y: 52 },
      { id: "f442-lcm", label: "MF", x: 42, y: 52 },
      { id: "f442-lm", label: "MF", x: 18, y: 46 },
      { id: "f442-st1", label: "FW", x: 62, y: 16 },
      { id: "f442-st2", label: "FW", x: 38, y: 16 },
    ],
  },
  {
    id: "f-4231",
    name: "4-2-3-1",
    description: "2ボランチが土台を作り、3枚のシャドーが流動的に仕掛ける布陣",
    slots: [
      { id: "f4231-gk", label: "GK", x: 50, y: 92 },
      { id: "f4231-rb", label: "RB", x: 80, y: 72 },
      { id: "f4231-cb1", label: "CB", x: 62, y: 78 },
      { id: "f4231-cb2", label: "CB", x: 38, y: 78 },
      { id: "f4231-lb", label: "LB", x: 20, y: 72 },
      { id: "f4231-rdm", label: "MF", x: 62, y: 58 },
      { id: "f4231-ldm", label: "MF", x: 38, y: 58 },
      { id: "f4231-ram", label: "MF", x: 75, y: 34 },
      { id: "f4231-cam", label: "MF", x: 50, y: 30 },
      { id: "f4231-lam", label: "MF", x: 25, y: 34 },
      { id: "f4231-st", label: "FW", x: 50, y: 12 },
    ],
  },
  {
    id: "f-343",
    name: "3-4-3",
    description: "3バックとウイングバックで幅を確保する超攻撃的布陣",
    slots: [
      { id: "f343-gk", label: "GK", x: 50, y: 92 },
      { id: "f343-cb1", label: "CB", x: 70, y: 78 },
      { id: "f343-cb2", label: "CB", x: 50, y: 82 },
      { id: "f343-cb3", label: "CB", x: 30, y: 78 },
      { id: "f343-rm", label: "MF", x: 85, y: 50 },
      { id: "f343-rcm", label: "MF", x: 60, y: 54 },
      { id: "f343-lcm", label: "MF", x: 40, y: 54 },
      { id: "f343-lm", label: "MF", x: 15, y: 50 },
      { id: "f343-rw", label: "FW", x: 75, y: 20 },
      { id: "f343-st", label: "FW", x: 50, y: 13 },
      { id: "f343-lw", label: "FW", x: 25, y: 20 },
    ],
  },
  {
    id: "f-352",
    name: "3-5-2",
    description: "中盤5枚で数的優位を作り、2トップが最前線で仕留める布陣",
    slots: [
      { id: "f352-gk", label: "GK", x: 50, y: 92 },
      { id: "f352-cb1", label: "CB", x: 70, y: 78 },
      { id: "f352-cb2", label: "CB", x: 50, y: 82 },
      { id: "f352-cb3", label: "CB", x: 30, y: 78 },
      { id: "f352-rwb", label: "MF", x: 88, y: 52 },
      { id: "f352-rcm", label: "MF", x: 65, y: 48 },
      { id: "f352-cm", label: "MF", x: 50, y: 54 },
      { id: "f352-lcm", label: "MF", x: 35, y: 48 },
      { id: "f352-lwb", label: "MF", x: 12, y: 52 },
      { id: "f352-st1", label: "FW", x: 60, y: 16 },
      { id: "f352-st2", label: "FW", x: 40, y: 16 },
    ],
  },
];

export function getFormationById(id: string): FormationTemplate | undefined {
  return formationTemplates.find((f) => f.id === id);
}
