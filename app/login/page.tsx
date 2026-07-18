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
        <SectionHeading eyebrow="Account" title="ログイン" />
        <LoginForm />
      </div>
    </div>
  );
}
