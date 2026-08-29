import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "BlueScout <onboarding@resend.dev>";

// RESEND_API_KEY未設定（ローカル開発初期など）でもアプリ全体が壊れないよう遅延生成にする。
function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

// メール送信の成否はサインアップ/リセット申請そのものの成否に影響させない
// （送信先の実在有無を応答から推測されないようにするのと、メール基盤の障害で
// 認証機能全体を止めないため）。失敗はログにのみ残す。
async function sendMail(to: string, subject: string, html: string): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn(`[email] RESEND_API_KEY未設定のため送信をスキップしました: to=${to} subject=${subject}`);
    return;
  }

  const { error } = await client.emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error(`[email] 送信に失敗しました: to=${to} subject=${subject}`, error);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendMail(
    to,
    "【BlueScout】パスワード再設定のご案内",
    `
      <p>BlueScoutでパスワード再設定のリクエストを受け付けました。</p>
      <p>以下のリンクから新しいパスワードを設定してください（有効期限: 1時間）。</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>心当たりがない場合は、このメールを無視してください。</p>
    `,
  );
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  await sendMail(
    to,
    "【BlueScout】メールアドレスの確認",
    `
      <p>BlueScoutにご登録いただきありがとうございます。</p>
      <p>以下のリンクからメールアドレスの確認を完了してください（有効期限: 24時間）。</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>心当たりがない場合は、このメールを無視してください。</p>
    `,
  );
}
