"use client";

import "./auth-form.scss";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "送信できませんでした。しばらくしてからもう一度お試しください。");
        return;
      }
      setMessage(data?.message ?? "パスワード再設定用のリンクをお送りしました。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form">
      {error && <p className="auth-form__error">{error}</p>}
      {message ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <Label htmlFor="forgot-email">メールアドレス</Label>
            <Input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="auth-form__submit" disabled={submitting}>
            {submitting ? "送信中..." : "再設定リンクを送る"}
          </Button>
        </form>
      )}

      <p className="auth-form__footer">
        <Link href="/login">ログインに戻る</Link>
      </p>
    </div>
  );
}
