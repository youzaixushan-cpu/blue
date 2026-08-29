import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { issuePasswordResetToken } from "@/lib/auth-tokens";
import { sendPasswordResetEmail } from "@/lib/email";

// このエンドポイントは netlify.toml の /api/auth/* レート制限（IPごと60秒30リクエスト）の対象。
export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  // メールアドレスの実在有無を応答から判別できないよう、存在しない場合も同じ成功レスポンスを返す。
  const genericResponse = () =>
    NextResponse.json({
      ok: true,
      message: "ご入力のメールアドレス宛にパスワード再設定用のリンクをお送りしました（該当するアカウントが存在する場合）。",
    });

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = await issuePasswordResetToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
  }

  return genericResponse();
}
