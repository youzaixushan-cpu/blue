"use client";

import "./auth-form.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "登録に失敗しました");
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("登録はできましたが、ログインに失敗しました。ログイン画面からお試しください。");
        return;
      }
      router.push("/mypage");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form">
      {error && <p className="auth-form__error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <Label htmlFor="signup-name">表示名（任意）</Label>
          <Input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="auth-form__field">
          <Label htmlFor="signup-email">メールアドレス</Label>
          <Input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form__field">
          <Label htmlFor="signup-password">パスワード（8文字以上）</Label>
          <Input
            id="signup-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="auth-form__submit" disabled={submitting}>
          {submitting ? "登録中..." : "新規登録"}
        </Button>
      </form>

      <div className="auth-form__divider">または</div>

      <Button
        type="button"
        variant="outline"
        className="auth-form__google"
        onClick={() => signIn("google", { callbackUrl: "/mypage" })}
      >
        Googleで登録
      </Button>

      <p className="auth-form__footer">
        すでにアカウントをお持ちの方は <Link href="/login">ログイン</Link>
      </p>
    </div>
  );
}
