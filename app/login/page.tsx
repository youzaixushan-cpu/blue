import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div>
        <SectionHeading
          eyebrow="Account"
          title="ログイン"
          description="ログインすると「あなたの26人」がどの端末からでも同じ内容で見られるようになります。ログインしなくても全ての機能はご利用いただけます。"
        />
        <LoginForm />
      </div>
    </div>
  );
}
