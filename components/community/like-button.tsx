"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function LikeButton({
  submissionId,
  initialLikes,
  className,
  iconClassName,
}: {
  submissionId: string;
  initialLikes: number;
  className?: string;
  iconClassName?: string;
}) {
  const [likes, setLikes] = useState(initialLikes);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/community/submissions/${submissionId}/like`, {
        method: "POST",
      });
      if (res.status === 409) {
        toast("この投稿にはすでにいいね済みです");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { likes: number };
      setLikes(data.likes);
    } catch {
      toast.error("いいねに失敗しました");
    }
  }

  return (
    <button type="button" onClick={handleLike} className={className}>
      <Heart className={iconClassName} />
      {likes}
    </button>
  );
}
