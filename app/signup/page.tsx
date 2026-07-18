import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div>
        <SectionHeading
          eyebrow="Account"
          title="新規登録"
          description="登録すると「あなたの26人」がどの端末からでも同じ内容で見られるようになります。登録しなくても全ての機能はご利用いただけます。"
        />
        <SignupForm />
      </div>
    </div>
  );
}
