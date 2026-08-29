import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/db/client";

// VerificationTokenはAuth.js標準モデル（Emailプロバイダー用）だが、パスワードリセット・
// メール確認のどちらにもidentifierを使い分けて流用する（新規モデル追加を避けるため）。
const RESET_PREFIX = "pwreset";
const VERIFY_PREFIX = "emailverify";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1時間
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24時間

// トークンはDBに平文保存せずハッシュ化する（DBが漏洩してもリンクを再現できないように）。
// メールで送るのは平文、検証時に同じ方式でハッシュ化して照合する。
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function issueToken(identifier: string, ttlMs: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: { identifier, token: hashToken(token), expires: new Date(Date.now() + ttlMs) },
    }),
  ]);
  return token;
}

// 発行済みトークンを1回だけ使用可能として消費する。有効期限切れの場合もレコードは削除する
// （使い回されないように）が、戻り値はfalseにして呼び出し元には「無効なリンク」として扱わせる。
async function consumeToken(identifier: string, token: string): Promise<boolean> {
  const where = { identifier_token: { identifier, token: hashToken(token) } };
  const record = await prisma.verificationToken.findUnique({ where });
  if (!record) return false;

  await prisma.verificationToken.delete({ where });
  return record.expires.getTime() >= Date.now();
}

export function issuePasswordResetToken(email: string): Promise<string> {
  return issueToken(`${RESET_PREFIX}:${email}`, RESET_TOKEN_TTL_MS);
}

export function consumePasswordResetToken(email: string, token: string): Promise<boolean> {
  return consumeToken(`${RESET_PREFIX}:${email}`, token);
}

export function issueEmailVerificationToken(email: string): Promise<string> {
  return issueToken(`${VERIFY_PREFIX}:${email}`, VERIFY_TOKEN_TTL_MS);
}

export function consumeEmailVerificationToken(email: string, token: string): Promise<boolean> {
  return consumeToken(`${VERIFY_PREFIX}:${email}`, token);
}
