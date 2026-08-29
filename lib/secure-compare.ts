import { timingSafeEqual } from "node:crypto";

// `a !== b`は文字が一致しなくなった時点で比較を打ち切るため、正解の秘密鍵に
// 近い値ほど僅かに応答が遅くなるタイミング攻撃が理論上成立する。管理系
// エンドポイントの認証はtimingSafeEqualで比較する。
export function secureCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
