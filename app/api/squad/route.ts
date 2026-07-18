import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const record = await prisma.userSquad.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json({ state: record?.state ?? null });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { state?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }
  if (typeof body.state !== "object" || body.state === null) {
    return NextResponse.json({ error: "state は必須です" }, { status: 400 });
  }

  await prisma.userSquad.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, state: body.state },
    update: { state: body.state },
  });

  return NextResponse.json({ ok: true });
}
