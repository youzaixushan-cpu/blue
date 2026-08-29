"use client";

import "./auth-form.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const linkInvalid = !email || !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "パスワードの再設定に失敗しました");
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        router.push("/login");
        return;
      }
      router.push("/mypage");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (linkInvalid) {
    return (
      <div className="auth-form">
        <p className="auth-form__error">リンクが正しくありません。もう一度リクエストしてください。</p>
        <p className="auth-form__footer">
          <Link href="/forgot-password">パスワードをお忘れの方はこちら</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-form">
      {error && <p className="auth-form__error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <Label htmlFor="reset-password">新しいパスワード（8文字以上）</Label>
          <Input
            id="reset-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="auth-form__field">
          <Label htmlFor="reset-password-confirm">新しいパスワード（確認）</Label>
          <Input
            id="reset-password-confirm"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="auth-form__submit" disabled={submitting}>
          {submitting ? "設定中..." : "パスワードを再設定する"}
        </Button>
      </form>
    </div>
  );
}
