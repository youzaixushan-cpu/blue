import { NextResponse } from "next/server";
import { likeSubmission, AlreadyLikedError } from "@/lib/db/community";
import { getClientIp, hashIp } from "@/lib/rate-limit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const ipHash = hashIp(getClientIp(request));
    const likes = await likeSubmission(id, ipHash);
    return NextResponse.json({ likes });
  } catch (error) {
    if (error instanceof AlreadyLikedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
}
