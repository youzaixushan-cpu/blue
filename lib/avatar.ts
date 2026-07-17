// アバターのグラデーション配色テーマ。キー名だけ選手データに持たせておき、
// 実際の色（HEX）はここで一元管理する（配色を変えたい場合はここだけ編集すればよい）。
// 全体のスタイリッシュな統一感のため、青系統のみで構成している。
export const AVATAR_THEMES = {
  navy: { from: "#1e3a8a", to: "#0f172a" },
  royal: { from: "#1d4ed8", to: "#1e293b" },
  sky: { from: "#0284c7", to: "#0c4a6e" },
  azure: { from: "#2563eb", to: "#1e3a8a" },
  cobalt: { from: "#1e40af", to: "#172554" },
  steel: { from: "#475569", to: "#0f172a" },
  indigo: { from: "#4f46e5", to: "#1e1b4b" },
  cyan: { from: "#0891b2", to: "#164e63" },
  teal: { from: "#0d9488", to: "#134e4a" },
  slate: { from: "#3b82f6", to: "#312e81" },
} as const;

export type AvatarThemeKey = keyof typeof AVATAR_THEMES;

const THEME_KEYS = Object.keys(AVATAR_THEMES) as AvatarThemeKey[];

export function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function themeForSeed(seed: string): AvatarThemeKey {
  return THEME_KEYS[hashSeed(seed) % THEME_KEYS.length];
}
