import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import { Prisma } from "@/lib/generated/prisma/client";
import { SQUAD_TARGETS } from "@/lib/squad-target";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const records = await prisma.userSquad.findMany({ where: { userId: session.user.id } });
  const byTarget = Object.fromEntries(records.map((r) => [r.target, r.state]));
  return NextResponse.json({
    next: byTarget.next ?? null,
    "2030": byTarget["2030"] ?? null,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const userId = session.user.id;
  const upserts = [];
  for (const { value: target } of SQUAD_TARGETS) {
    const state = body[target];
    if (state === undefined) continue;
    if (typeof state !== "object" || state === null) {
      return NextResponse.json({ error: "state は必須です" }, { status: 400 });
    }
    upserts.push(
      prisma.userSquad.upsert({
        where: { userId_target: { userId, target } },
        create: { userId, target, state: state as Prisma.InputJsonValue },
        update: { state: state as Prisma.InputJsonValue },
      }),
    );
  }

  if (upserts.length === 0) {
    return NextResponse.json({ error: "state は必須です" }, { status: 400 });
  }

  await prisma.$transaction(upserts);

  return NextResponse.json({ ok: true });
}
