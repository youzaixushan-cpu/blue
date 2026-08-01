"use client";

import "./page.scss";
import Link from "next/link";
import { X } from "lucide-react";
import { useSquad } from "@/lib/squad-context";
import { SQUAD_TARGETS, type SquadTarget } from "@/lib/squad-target";
import { SectionHeading } from "@/components/shared/section-heading";
import { GuestNotice } from "@/components/auth/guest-notice";
import { SquadSummaryBar } from "@/components/squad/squad-summary-bar";
import { AddMemberForm } from "@/components/squad/add-member-form";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PositionBadge } from "@/components/players/position-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Position } from "@/lib/types";

const POSITION_ORDER: Position[] = ["GK", "DF", "MF", "FW"];

export default function MySquadPage() {
  const { members, addMember, removeMember, isHydrated, target, setTarget } = useSquad();

  const countsByPosition = POSITION_ORDER.reduce(
    (acc, pos) => {
      acc[pos] = members.filter((m) => m.position === pos).length;
      return acc;
    },
    {} as Record<Position, number>,
  );

  if (!isHydrated) {
    return <div className="my-squad-page" />;
  }

  return (
    <div className="my-squad-page">
      <SectionHeading
        eyebrow="Your Squad"
        title="あなたの26人"
        description="登録選手に関係なく、あなたの予想を自由に追加できます。名前を入力して追加しましょう。フォーメーションを組むにはフォーメーションメーカーへ進んでください。"
        action={
          <Tabs value={target} onValueChange={(v) => setTarget(v as SquadTarget)}>
            <TabsList>
              {SQUAD_TARGETS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.shortLabel}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        className="my-squad-page__heading"
      />

      <GuestNotice />

      <SquadSummaryBar countsByPosition={countsByPosition} total={members.length} />

      <div className="my-squad-page__add">
        <AddMemberForm onAdd={addMember} />
      </div>

      {members.length === 0 ? (
        <p className="my-squad-page__empty-hint">
          まだ誰も追加されていません。上のフォームから最初のメンバーを追加してみましょう。
        </p>
      ) : (
        <div className="my-squad-page__roster">
          {members.map((member) => (
            <div key={member.id} className="my-squad-page__roster-item">
              <PlayerAvatar label={member.nameEn} theme={member.avatarTheme} size="sm" />
              <div className="my-squad-page__roster-body">
                <p className="my-squad-page__roster-name">{member.name}</p>
                <p className="my-squad-page__roster-club">{member.club}</p>
              </div>
              <PositionBadge position={member.position} />
              <button
                type="button"
                aria-label="あなたの26人から外す"
                onClick={() => removeMember(member.id)}
                className="my-squad-page__roster-remove"
              >
                <X className="my-squad-page__roster-remove-icon" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="my-squad-page__cta">
        {members.length === 0 ? (
          <Button disabled>フォーメーションメーカーで使う</Button>
        ) : (
          <Button asChild>
            <Link href="/my-squad/formation">フォーメーションメーカーで使う</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
