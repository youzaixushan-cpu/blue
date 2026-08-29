import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { consumeEmailVerificationToken } from "@/lib/auth-tokens";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "メールアドレスの確認",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email, token } = await searchParams;
  const success =
    typeof email === "string" && typeof token === "string" && email && token
      ? await verify(email, token)
      : false;

  return (
    <div className="auth-page">
      <div>
        <SectionHeading
          eyebrow="Account"
          title="メールアドレスの確認"
          description={
            success
              ? "メールアドレスの確認が完了しました。"
              : "リンクの有効期限が切れているか、無効です。メールアドレスの確認は必須ではないため、そのままサービスをご利用いただけます。"
          }
        />
        <Button asChild className="auth-form__submit">
          <Link href="/login">ログインへ進む</Link>
        </Button>
      </div>
    </div>
  );
}

async function verify(email: string, token: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const valid = await consumeEmailVerificationToken(normalizedEmail, token);
  if (!valid) return false;

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { emailVerified: new Date() },
  });
  return true;
}
