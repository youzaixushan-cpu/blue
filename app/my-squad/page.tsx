"use client";

import "./page.scss";
import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Download, RotateCcw, X as XIcon } from "lucide-react";
import { useSquad } from "@/lib/squad-context";
import { getFormationById } from "@/lib/data/formations";
import { SQUAD_TARGETS, squadTargetShortLabel, type SquadTarget } from "@/lib/squad-target";
import { SectionHeading } from "@/components/shared/section-heading";
import { GuestNotice } from "@/components/auth/guest-notice";
import { SquadSummaryBar } from "@/components/squad/squad-summary-bar";
import { AddMemberForm } from "@/components/squad/add-member-form";
import { SubmitSquadDialog } from "@/components/squad/submit-squad-dialog";
import { FormationSelect } from "@/components/formation/formation-select";
import { Pitch } from "@/components/formation/pitch";
import { PlayerPool, POOL_ZONE_ID } from "@/components/formation/player-pool";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Position, RosterMember } from "@/lib/types";

const BENCH_PREFIX = "bench:";
const SHOW_BENCH_STORAGE_KEY = "samurai-squad-show-bench";

const POSITION_ORDER: Position[] = ["GK", "DF", "MF", "FW"];

export default function MySquadPage() {
  const {
    members,
    addMember,
    removeMember,
    formationId,
    setFormationId,
    assignments,
    assignMember,
    unassignSlot,
    benchAssignments,
    assignBench,
    unassignBench,
    clearSquad,
    isHydrated,
    target,
    setTarget,
  } = useSquad();

  const [activeMember, setActiveMember] = useState<RosterMember | null>(null);
  // ページを離れて戻ってきても「控えもフォーメーションに当てはめる」表示が
  // オフに戻ってしまい、控えに配置した選手が見えなくなってしまうため永続化する
  const [showBench, setShowBench] = useState(false);
  useEffect(() => {
    // localStorage（外部システム）からの初回同期のため、マウント時に一度だけ実行
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBench(window.localStorage.getItem(SHOW_BENCH_STORAGE_KEY) === "true");
  }, []);
  useEffect(() => {
    window.localStorage.setItem(SHOW_BENCH_STORAGE_KEY, String(showBench));
  }, [showBench]);
  const pitchRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const formation = getFormationById(formationId);

  async function handleExportImage() {
    if (!pitchRef.current) return;
    try {
      const dataUrl = await toPng(pitchRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `samurai-blue-squad-${target}-${formationId}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("画像の書き出しに失敗しました");
    }
  }

  function handleClearSquad() {
    if (window.confirm("ベンチのメンバーも含めて「あなたの26人」を全員削除します。よろしいですか？")) {
      clearSquad();
    }
  }

  function handleShareX() {
    const targetLabel = squadTargetShortLabel(target);
    const text = `${formation ? formation.name + "で" : ""}「${targetLabel}」の あなたの26人 を作りました！ #SAMURAIBLUE`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  const countsByPosition = POSITION_ORDER.reduce(
    (acc, pos) => {
      acc[pos] = members.filter((m) => m.position === pos).length;
      return acc;
    },
    {} as Record<Position, number>,
  );

  const membersById = Object.fromEntries(members.map((m) => [m.id, m]));
  const assignedIds = new Set([
    ...Object.values(assignments),
    ...Object.values(benchAssignments),
  ]);
  const unassignedMembers = members.filter((m) => !assignedIds.has(m.id));

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { memberId: string } | undefined;
    if (!data) return;
    setActiveMember(membersById[data.memberId] ?? null);
  }

  function unassignByOrigin(origin: string) {
    if (origin === "pool") return;
    if (origin.startsWith(BENCH_PREFIX)) {
      unassignBench(origin.slice(BENCH_PREFIX.length));
      return;
    }
    unassignSlot(origin);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveMember(null);
    const { active, over } = event;
    const data = active.data.current as { memberId: string; origin: string } | undefined;
    if (!data) return;

    if (!over) {
      unassignByOrigin(data.origin);
      return;
    }
    if (over.id === POOL_ZONE_ID) {
      unassignByOrigin(data.origin);
      return;
    }
    const overId = String(over.id);
    if (overId.startsWith(BENCH_PREFIX)) {
      assignBench(overId.slice(BENCH_PREFIX.length), data.memberId);
      return;
    }
    assignMember(overId, data.memberId);
  }

  if (!isHydrated) {
    return <div className="my-squad-page" />;
  }

  return (
    <div className="my-squad-page">
      <SectionHeading
        eyebrow="Your Squad"
        title="あなたの26人"
        description="登録選手に関係なく、あなたの予想を自由に追加できます。名前を入力して追加し、フォーメーションの枠にドラッグして配置しましょう。"
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
        <>
          <div className="my-squad-page__toolbar">
            <FormationSelect value={formationId} onChange={setFormationId} />
            <div className="my-squad-page__toolbar-actions">
              <Button variant="outline" className="my-squad-page__action" onClick={handleClearSquad}>
                <RotateCcw className="my-squad-page__action-icon" />
                全てクリア
              </Button>
              <Button variant="outline" className="my-squad-page__action" onClick={handleExportImage}>
                <Download className="my-squad-page__action-icon" />
                画像で保存
              </Button>
              <Button variant="outline" className="my-squad-page__action" onClick={handleShareX}>
                <XIcon className="my-squad-page__action-icon" />
                Xでシェア
              </Button>
              <SubmitSquadDialog />
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="my-squad-page__layout">
              {formation && (
                <Pitch
                  ref={pitchRef}
                  formation={formation}
                  assignments={assignments}
                  members={membersById}
                  onRemoveSlot={unassignSlot}
                  benchAssignments={benchAssignments}
                  showBench={showBench}
                  onRemoveBenchSlot={unassignBench}
                />
              )}
              <PlayerPool
                members={unassignedMembers}
                onRemove={removeMember}
                showBench={showBench}
                onShowBenchChange={setShowBench}
              />
            </div>

            <DragOverlay>
              {activeMember ? (
                <div className="my-squad-page__drag-preview">
                  <PlayerAvatar
                    label={activeMember.nameEn}
                    theme={activeMember.avatarTheme}
                    size="md"
                    className="my-squad-page__drag-avatar"
                  />
                  <span className="my-squad-page__drag-name">{activeMember.name}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </div>
  );
}
