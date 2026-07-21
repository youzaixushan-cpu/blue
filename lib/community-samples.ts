// 「みんなの代表」の初期表示が空/薄いデータにならないよう、実際の投稿と同じ形の
// フルの11人編成サンプルを生成するための共通ロジック。人気選手ほど選ばれやすいよう
// 重み付けしてあり、prisma/seed.ts から呼び出して現実味のあるランキングを作る。
import { formationTemplates } from "@/lib/data/formations";
import { players } from "@/lib/data/players";
import type { Position } from "@/lib/types";
import type { SubmitSquadMemberInput } from "@/lib/db/community";
import type { SquadTarget } from "@/lib/squad-target";

type Tier = "star" | "mid" | "low";

const TIERS: Record<string, Tier> = {
  "gk-03": "star",
  "df-03": "star",
  "df-05": "star",
  "mf-08": "star",
  "mf-06": "star",
  "mf-10": "star",
  "mf-11": "star",
  "fw-02": "star",
  "mf-01": "star",
  "gk-01": "mid",
  "df-01": "mid",
  "df-06": "mid",
  "df-02": "mid",
  "mf-02": "mid",
  "mf-03": "mid",
  "mf-05": "mid",
  "mf-07": "mid",
  "mf-12": "mid",
  "fw-01": "mid",
};

const TIER_WEIGHT: Record<Tier, number> = { star: 10, mid: 4, low: 1 };

const playersByPosition: Record<Position, typeof players> = {
  GK: players.filter((p) => p.position === "GK"),
  DF: players.filter((p) => p.position === "DF"),
  MF: players.filter((p) => p.position === "MF"),
  FW: players.filter((p) => p.position === "FW"),
};

// フォーメーションのスロットラベルは"RB"/"CB"/"LB"等の細かい表記のことがあるため、
// Player.position（GK/DF/MF/FW）の粒度に正規化してからプレイヤーを探す。
const LABEL_TO_POSITION: Record<string, Position> = {
  GK: "GK",
  RB: "DF",
  CB: "DF",
  LB: "DF",
  DF: "DF",
  MF: "MF",
  FW: "FW",
};

const FORMATION_WEIGHTS: Record<string, number> = {
  "f-433": 40,
  "f-4231": 25,
  "f-343": 15,
  "f-442": 12,
  "f-352": 8,
};

const AUTHOR_NAMES = [
  "青き軍団サポ", "国立の常連", "サムライ魂", "アウェイ遠征勢", "ゴール裏歴10年",
  "戦術オタク侍", "ブルーロック信者", "堂安推し", "久保建英ファンクラブ", "三笘マジック",
  "ロスタイムの奇跡", "サッカー観戦歴20年", "代表戦皆勤賞", "深夜観戦部", "応援歌担当",
  "スタメン予想士", "移籍情報通", "戦術ボード職人", "リプレイ職人", "代表愛が重い",
];

const TITLES = [
  "王道の攻撃布陣", "堅守速攻フォーメーション", "若手大抜擢プラン", "ベテラン軸の安定編成",
  "超攻撃的3バック案", "バランス重視の中盤構成", "スピードスター起用プラン", "守備固め用フォーメーション",
  "個人的ベストイレブン", "次の代表戦予想スタメン", "夢の攻撃カルテット", "鉄壁最終ライン案",
];

function weightedPick<T>(pool: { item: T; weight: number }[]): T | null {
  const total = pool.reduce((sum, p) => sum + p.weight, 0);
  if (total === 0) return null;
  let roll = Math.random() * total;
  for (const p of pool) {
    roll -= p.weight;
    if (roll <= 0) return p.item;
  }
  return pool[pool.length - 1].item;
}

function pickPlayerForPosition(position: Position, usedIds: Set<string>) {
  const pool = playersByPosition[position]
    .filter((p) => !usedIds.has(p.id))
    .map((p) => ({ item: p, weight: TIER_WEIGHT[TIERS[p.id] ?? "low"] }));
  return weightedPick(pool);
}

function randomPastDate(maxDaysAgo: number): Date {
  const now = Date.now();
  const daysAgo = Math.random() * maxDaysAgo;
  return new Date(now - daysAgo * 24 * 60 * 60 * 1000);
}

export interface CommunitySampleSubmission {
  formationId: string;
  authorName: string;
  title: string;
  members: SubmitSquadMemberInput[];
  ipHash: string;
  createdAt: Date;
  likes: number;
  target: SquadTarget;
}

export function buildCommunitySampleSubmissions(
  count: number,
  target: SquadTarget,
): CommunitySampleSubmission[] {
  const formationPool = Object.entries(FORMATION_WEIGHTS).map(([id, weight]) => ({ item: id, weight }));
  const samples: CommunitySampleSubmission[] = [];

  for (let i = 0; i < count; i++) {
    const formationId = weightedPick(formationPool)!;
    const formation = formationTemplates.find((f) => f.id === formationId)!;

    const used = new Set<string>();
    const members: SubmitSquadMemberInput[] = [];
    let ok = true;
    for (const slot of formation.slots) {
      const position = LABEL_TO_POSITION[slot.label] ?? "MF";
      const player = pickPlayerForPosition(position, used);
      if (!player) {
        ok = false;
        break;
      }
      used.add(player.id);
      members.push({
        slotId: slot.id,
        playerId: player.id,
        name: player.name,
        position: player.position,
      });
    }
    if (!ok) continue;

    samples.push({
      formationId,
      authorName: AUTHOR_NAMES[i % AUTHOR_NAMES.length],
      title: TITLES[i % TITLES.length],
      members,
      // targetを含めることで、next/2030を別々に生成してもipHashが衝突して
      // レート制限（submitSquad内、1時間5件/IP）に引っかからないようにする
      ipHash: `sample-fan-${target}-${i}`,
      createdAt: randomPastDate(21),
      likes: Math.floor(Math.random() * 350),
      target,
    });
  }

  return samples;
}
