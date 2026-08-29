import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { consumePasswordResetToken } from "@/lib/auth-tokens";

// このエンドポイントは netlify.toml の /api/auth/* レート制限の対象。トークン自体も
// 32バイトのランダム値なので総当たりは現実的でないが、多層防御として機能する。
export async function POST(request: Request) {
  let body: { email?: unknown; token?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !token) {
    return NextResponse.json({ error: "リンクが正しくありません" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上にしてください" }, { status: 400 });
  }

  // consumePasswordResetTokenは呼んだ時点でトークンを削除する（有効/無効いずれの場合も再利用不可にする）。
  const valid = await consumePasswordResetToken(email, token);
  if (!valid) {
    return NextResponse.json(
      { error: "リンクの有効期限が切れているか、無効です。もう一度お試しください。" },
      { status: 400 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email }, data: { password: hashed } });

  return NextResponse.json({ ok: true });
}
