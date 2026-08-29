import { createHash } from "node:crypto";

export function getClientIp(request: Request): string {
  // x-nf-client-connection-ipはNetlifyのエッジが実際の接続元から設定する値で、
  // クライアントが送るヘッダーは上書きされるため偽装できない。x-forwarded-forの
  // 先頭値はクライアントが任意の文字列を差し込めてしまうため、レート制限や
  // いいね重複防止の回避に使われる可能性があり信頼しない。
  const nfIp = request.headers.get("x-nf-client-connection-ip");
  if (nfIp) return nfIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
