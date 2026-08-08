"use client";

import { useSyncExternalStore } from "react";
import { Link as LinkIcon, Share2, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import "./share-buttons.scss";

interface ShareButtonsProps {
  title: string;
  formationName: string;
  url: string;
  className?: string;
}

// navigator.shareの対応状況は実行中に変化しないので、購読は何もしないダミーで良い。
// useSyncExternalStoreを使うことで、SSR時（getServerSnapshot: false）とhydration直後の
// クライアント初回描画を必ず一致させ、useEffect+setStateによるcascading re-renderを避ける。
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
function getServerSnapshot() {
  return false;
}

export function ShareButtons({ title, formationName, url, className }: ShareButtonsProps) {
  const canNativeShare = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const text = `私が予想する日本代表の布陣はこれ！【${title}】${formationName} #BlueScout #あなたの26人`;

  function handleShareX() {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      toast("URLをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // ユーザーによるキャンセル等。何もしない。
    }
  }

  return (
    <div className={className}>
      <button type="button" className="share-buttons__item" onClick={handleShareX}>
        <XIcon className="share-buttons__icon" />
        Xでシェア
      </button>
      <button type="button" className="share-buttons__item" onClick={handleCopy}>
        <LinkIcon className="share-buttons__icon" />
        URLをコピー
      </button>
      {canNativeShare && (
        <button type="button" className="share-buttons__item" onClick={handleNativeShare}>
          <Share2 className="share-buttons__icon" />
          共有
        </button>
      )}
    </div>
  );
}
