import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { issueEmailVerificationToken } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : undefined;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上にしてください" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "このメールアドレスはすでに登録されています" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, name: name || email.split("@")[0] },
  });

  // メール確認は必須のログイン条件にはしていない（実害が限定的なため）ので、送信に
  // 失敗してもサインアップ自体は成功させる。
  try {
    const token = await issueEmailVerificationToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
    await sendVerificationEmail(email, verifyUrl);
  } catch (error) {
    console.error("[signup] 確認メールの送信に失敗しました", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
