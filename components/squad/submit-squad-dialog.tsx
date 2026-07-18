"use client";

import "./submit-squad-dialog.scss";
import { useState } from "react";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { useSquad } from "@/lib/squad-context";
import { getFormationById } from "@/lib/data/formations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SubmitSquadDialog() {
  const { formationId, assignments, members } = useSquad();
  const [open, setOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formation = getFormationById(formationId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formation) return;

    const membersById = Object.fromEntries(members.map((m) => [m.id, m]));
    const payloadMembers = formation.slots.map((slot) => {
      const memberId = assignments[slot.id];
      const member = memberId ? membersById[memberId] : undefined;
      if (!member) return null;
      return {
        slotId: slot.id,
        playerId: member.playerId ?? null,
        name: member.name,
        position: member.position,
      };
    });

    if (payloadMembers.some((m) => m === null)) {
      toast.error("全てのポジションに選手を配置してから投稿してください");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/community/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId, authorName, title, members: payloadMembers }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "投稿に失敗しました");
      }
      toast.success("みんなの代表に投稿しました！");
      setOpen(false);
      setAuthorName("");
      setTitle("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="my-squad-page__action">
          <Share2 className="my-squad-page__action-icon" />
          共有する
        </Button>
      </DialogTrigger>
      <DialogContent className="submit-squad-dialog">
        <DialogHeader>
          <DialogTitle>みんなの代表に投稿</DialogTitle>
          <DialogDescription>
            今組んでいる布陣を「みんなの代表」ページに投稿します。全ポジションに選手を配置してから投稿してください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="submit-squad-dialog__form">
          <div className="submit-squad-dialog__field">
            <Label htmlFor="submit-squad-author">表示名（任意）</Label>
            <Input
              id="submit-squad-author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="匿名サポーター"
              maxLength={40}
            />
          </div>
          <div className="submit-squad-dialog__field">
            <Label htmlFor="submit-squad-title">タイトル（任意）</Label>
            <Input
              id="submit-squad-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={formation ? `${formation.name}の予想布陣` : ""}
              maxLength={80}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "投稿中..." : "投稿する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
