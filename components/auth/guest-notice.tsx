"use client";

import "./guest-notice.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function GuestNotice() {
  const { status } = useSession();
  if (status !== "unauthenticated") return null;

  return (
    <div className="guest-notice">
      <p className="guest-notice__text">
        ログインしなくてもこのページは自由に使えます。ログインすると、ここで組んだ内容をどの端末からでも同じように見られるようになります。
      </p>
      <Link href="/login" className="guest-notice__link">
        ログイン / 新規登録
      </Link>
    </div>
  );
}
