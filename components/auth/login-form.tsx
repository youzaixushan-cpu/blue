"use client";

import "./auth-form.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
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
          <Label htmlFor="login-email">メールアドレス</Label>
          <Input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form__field">
          <Label htmlFor="login-password">パスワード</Label>
          <Input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="auth-form__submit" disabled={submitting}>
          {submitting ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <div className="auth-form__divider">または</div>

      <Button
        type="button"
        variant="outline"
        className="auth-form__google"
        onClick={() => signIn("google", { callbackUrl: "/mypage" })}
      >
        Googleでログイン
      </Button>

      <p className="auth-form__footer">
        アカウントをお持ちでない方は <Link href="/signup">新規登録</Link>
      </p>
    </div>
  );
}
