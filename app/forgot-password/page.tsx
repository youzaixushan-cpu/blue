import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "パスワードをお忘れの方",
};

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div>
        <SectionHeading
          eyebrow="Account"
          title="パスワードをお忘れの方"
          description="ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。"
        />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
