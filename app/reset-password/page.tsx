import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "パスワードの再設定",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { email, token } = await searchParams;

  return (
    <div className="auth-page">
      <div>
        <SectionHeading
          eyebrow="Account"
          title="パスワードの再設定"
          description="新しいパスワードを入力してください。"
        />
        <ResetPasswordForm email={email ?? ""} token={token ?? ""} />
      </div>
    </div>
  );
}
