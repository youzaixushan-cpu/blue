import { NextResponse } from "next/server";
import { likeSubmission } from "@/lib/db/community";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const likes = await likeSubmission(id);
    return NextResponse.json({ likes });
  } catch {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
}
