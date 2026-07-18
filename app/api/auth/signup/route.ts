import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";

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

  return NextResponse.json({ ok: true }, { status: 201 });
}
