import type { Player } from "@/lib/types";
import type { SquadTarget } from "@/lib/squad-target";

// 所属クラブがJ1クラブかどうかで「海外組かどうか」を簡易的に判定する
// （選手データにはoverseas/playingTimeのような専用フィールドが無いため、
// クラブ名からの推定で代用するダミーロジック）。
const J_LEAGUE_CLUBS = new Set([
  "FC東京",
  "サンフレッチェ広島",
  "ジュビロ磐田",
  "セレッソ大阪",
  "名古屋グランパス",
  "川崎フロンターレ",
  "東京ヴェルディ",
  "柏レイソル",
  "横浜F・マリノス",
  "浦和レッズ",
  "湘南ベルマーレ",
  "鹿島アントラーズ",
  "アビスパ福岡",
  "FC町田ゼルビア",
]);

function isOverseas(player: Player): boolean {
  return !J_LEAGUE_CLUBS.has(player.club);
}

// recentRatingsの0は「出場なし」を表す既存の慣習（lib/data/players.ts参照）。
// 0を除いた平均を「直近の好調度」の代理指標として使う。
function recentForm(player: Player): { average: number; playedCount: number } {
  const played = player.recentRatings.filter((r) => r > 0);
  if (played.length === 0) return { average: 0, playedCount: 0 };
  return { average: played.reduce((sum, r) => sum + r, 0) / played.length, playedCount: played.length };
}

// 選手のダミーステータス（年齢・キャップ数・所属クラブでの出場機会等）を根拠に、
// モード別（次回の試合=実績・コンディション重視／2030年W杯=若さ・海外挑戦重視）の
// 選出理由コメントを組み立てる。完全なランダム文にせず、選手データと矛盾しない内容にする。
export function generateSelectionReason(player: Player, target: SquadTarget): string {
  const overseas = isOverseas(player);
  const { average: form, playedCount } = recentForm(player);
  const young = player.age <= 23;
  const veteran = player.caps >= 40;

  if (target === "next") {
    if (form >= 7.3) {
      return `直近${playedCount}試合の采配レーティング平均${form.toFixed(1)}と、今シーズンの好調ぶりを高く評価。`;
    }
    if (overseas) {
      return `${player.club}で出場機会を掴む海外組。現地での実戦経験の豊富さを評価。`;
    }
    if (veteran) {
      return `${player.caps}キャップを誇る豊富な経験と安定感が信頼材料。`;
    }
    return `${player.club}でのコンディションと出場実績を踏まえた選出。`;
  }

  // 2030年W杯: 若さ・海外挑戦・伸びしろを重視
  if (young && overseas) {
    return `${player.age}歳ながら${player.club}に身を置き、海外での武者修行が評価ポイント。2030年に向けて大きな成長が期待される。`;
  }
  if (young) {
    return `${player.age}歳、伸びしろの大きさを買われての選出。2030年には円熟期を迎える計算。`;
  }
  if (overseas) {
    return `${player.club}で経験を積む実力者。長期的な戦力としても期待がかかる。`;
  }
  return `${player.age}歳というピーク年齢を見据えた中長期的な選出。`;
}
