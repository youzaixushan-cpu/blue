import { NextResponse } from "next/server";
import { submitSquad, SubmitSquadValidationError, type SubmitSquadMemberInput } from "@/lib/db/community";

interface SubmitSquadRequestBody {
  formationId?: unknown;
  authorName?: unknown;
  title?: unknown;
  members?: unknown;
}

function isMemberInput(value: unknown): value is SubmitSquadMemberInput {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.slotId === "string" &&
    (m.playerId === null || typeof m.playerId === "string") &&
    typeof m.name === "string" &&
    typeof m.position === "string"
  );
}

export async function POST(request: Request) {
  let body: SubmitSquadRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  if (typeof body.formationId !== "string" || !Array.isArray(body.members)) {
    return NextResponse.json({ error: "formationId と members は必須です" }, { status: 400 });
  }
  if (!body.members.every(isMemberInput)) {
    return NextResponse.json({ error: "members の形式が正しくありません" }, { status: 400 });
  }

  try {
    const id = await submitSquad({
      formationId: body.formationId,
      authorName: typeof body.authorName === "string" ? body.authorName : undefined,
      title: typeof body.title === "string" ? body.title : undefined,
      members: body.members,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof SubmitSquadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "投稿に失敗しました" }, { status: 500 });
  }
}
