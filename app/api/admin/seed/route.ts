import { NextResponse } from "next/server";
import { seedProduction } from "@/lib/seed-production";
import { secureCompare } from "@/lib/secure-compare";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = process.env.SEED_SECRET;

  if (!expected || !secureCompare(authHeader, `Bearer ${expected}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await seedProduction();
  return NextResponse.json(result);
}
