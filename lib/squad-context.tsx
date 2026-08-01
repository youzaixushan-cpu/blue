"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import type { Player, Position, RosterMember } from "@/lib/types";
import { DEFAULT_SQUAD_TARGET, isSquadTarget, type SquadTarget } from "@/lib/squad-target";

const STORAGE_KEY = "samurai-squad-v5";
const MAX_SQUAD_SIZE = 26;
const DEFAULT_FORMATION_ID = "f-433";

interface SquadState {
  members: RosterMember[];
  formationId: string;
  assignmentsByFormation: Record<string, Record<string, string>>;
  benchAssignmentsByFormation: Record<string, Record<string, string>>;
}

const DEFAULT_SQUAD_STATE: SquadState = {
  members: [],
  formationId: DEFAULT_FORMATION_ID,
  assignmentsByFormation: {},
  benchAssignmentsByFormation: {},
};

type SquadStateByTarget = Record<SquadTarget, SquadState>;

interface StoredBlob {
  next?: Partial<SquadState>;
  "2030"?: Partial<SquadState>;
  activeTarget?: SquadTarget;
}

function normalizeSquadState(raw: Partial<SquadState> | null | undefined): SquadState {
  return { ...DEFAULT_SQUAD_STATE, ...raw };
}

// 指定したmemberIdを、そのマップ内のどのスロットに割り当てられていても取り除く
// （1人が同じ役割（スタメン or ベンチ）内で複数スロットを兼任しないようにするための共通ロジック）
function stripMemberFromMap(
  map: Record<string, string>,
  memberId: string,
): Record<string, string> {
  const next = { ...map };
  for (const [slotId, existingMemberId] of Object.entries(next)) {
    if (existingMemberId === memberId) {
      delete next[slotId];
    }
  }
  return next;
}

interface SquadContextValue {
  players: Player[];
  members: RosterMember[];
  addMember: (name: string, position: Position) => void;
  removeMember: (memberId: string) => void;
  formationId: string;
  setFormationId: (id: string) => void;
  assignments: Record<string, string>;
  assignMember: (slotId: string, memberId: string) => void;
  unassignSlot: (slotId: string) => void;
  benchAssignments: Record<string, string>;
  assignBench: (slotId: string, memberId: string) => void;
  unassignBench: (slotId: string) => void;
  clearSquad: () => void;
  isHydrated: boolean;
  target: SquadTarget;
  setTarget: (target: SquadTarget) => void;
  // 現在アクティブなタブに関係なく、特定のターゲットのメンバーを読みたい場面
  // （AI代表との比較、マイページの照合結果など）向けの参照専用データ
  membersByTarget: Record<SquadTarget, RosterMember[]>;
}

const SquadContext = createContext<SquadContextValue | null>(null);

export function SquadProvider({
  children,
  players,
}: {
  children: ReactNode;
  players: Player[];
}) {
  const [state, setState] = useState<SquadStateByTarget>({
    next: DEFAULT_SQUAD_STATE,
    "2030": DEFAULT_SQUAD_STATE,
  });
  const [activeTarget, setActiveTarget] = useState<SquadTarget>(DEFAULT_SQUAD_TARGET);
  const [isHydrated, setIsHydrated] = useState(false);
  const { status } = useSession();
  const hasReconciledRef = useRef(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredBlob;
        // localStorage（外部システム）からの初回同期のため、マウント時に一度だけ実行
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          next: normalizeSquadState(parsed.next),
          "2030": normalizeSquadState(parsed["2030"]),
        });
        if (isSquadTarget(parsed.activeTarget)) {
          setActiveTarget(parsed.activeTarget);
        }
      }
    } catch {
      // 破損データは無視してデフォルトを使用
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const blob: StoredBlob = { ...state, activeTarget };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
  }, [state, activeTarget, isHydrated]);

  // ログイン時: next/2030それぞれ独立に「サーバーに保存済みのデータがあればそれを採用、
  // 無ければ（初回ログイン）ローカルの内容を一度だけサーバーへ移行する」を判定する。
  // 片方のtargetにサーバーデータが無いからといって、もう片方のローカルデータまで
  // 巻き込んで上書き・破棄しないようにするため、2つのtargetを混ぜずに個別処理する。
  // 未ログイン時は今まで通りlocalStorageのみで動作し、一切サーバーへ通信しない。
  useEffect(() => {
    if (status !== "authenticated" || hasReconciledRef.current) return;
    hasReconciledRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/squad");
        if (!res.ok) return;
        const data = (await res.json()) as {
          next: Partial<SquadState> | null;
          "2030": Partial<SquadState> | null;
        };

        let localBlob: StoredBlob | null = null;
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) localBlob = JSON.parse(raw) as StoredBlob;
        } catch {
          // 破損データは無視
        }

        const nextTargetState =
          data.next !== null ? normalizeSquadState(data.next) : normalizeSquadState(localBlob?.next);
        const target2030State =
          data["2030"] !== null
            ? normalizeSquadState(data["2030"])
            : normalizeSquadState(localBlob?.["2030"]);

        setState({ next: nextTargetState, "2030": target2030State });

        // サーバーに無く、ローカルにだけデータがあったtargetのみ一度だけ移行する
        const toMigrate: Partial<SquadStateByTarget> = {};
        if (data.next === null && nextTargetState.members.length > 0) {
          toMigrate.next = nextTargetState;
        }
        if (data["2030"] === null && target2030State.members.length > 0) {
          toMigrate["2030"] = target2030State;
        }
        if (Object.keys(toMigrate).length > 0) {
          await fetch("/api/squad", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toMigrate),
          });
        }
      } catch {
        // ネットワークエラー時はローカルの状態のまま継続する
      }
    })();
  }, [status]);

  // ログイン中の変更をサーバーへデバウンスして同期する（next/2030両方まとめて送信。
  // この規模のアプリでは書き込み量として問題にならないため、変更されていない方も毎回含めてシンプルに保つ）
  useEffect(() => {
    if (!isHydrated || status !== "authenticated") return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      fetch("/api/squad", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(() => {
        // 同期失敗時もローカルには保存済みなので致命的ではない
      });
    }, 800);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [state, isHydrated, status]);

  const value = useMemo<SquadContextValue>(() => {
    const current = state[activeTarget];

    const addMember = (rawName: string, position: Position) => {
      const name = rawName.trim();
      if (!name) return;

      setState((prev) => {
        const targetState = prev[activeTarget];
        if (targetState.members.length >= MAX_SQUAD_SIZE) {
          toast.error("あなたの26人はすでに定員です。誰かを外してから追加してください。");
          return prev;
        }

        const matched = players.find((p) => p.name === name);

        if (matched) {
          if (targetState.members.some((m) => m.playerId === matched.id)) {
            toast.error(`${matched.name}はすでに追加されています。`);
            return prev;
          }
          const member: RosterMember = {
            id: matched.id,
            name: matched.name,
            nameEn: matched.nameEn,
            position: matched.position,
            club: matched.club,
            avatarTheme: matched.avatarTheme,
            playerId: matched.id,
          };
          toast.success(`${matched.name}を追加しました`);
          return {
            ...prev,
            [activeTarget]: { ...targetState, members: [...targetState.members, member] },
          };
        }

        const member: RosterMember = {
          id: `custom-${crypto.randomUUID()}`,
          name,
          nameEn: name,
          position,
          club: "未登録",
        };
        toast.success(`${name}を予想メンバーとして追加しました`);
        return {
          ...prev,
          [activeTarget]: { ...targetState, members: [...targetState.members, member] },
        };
      });
    };

    const removeMember = (memberId: string) => {
      setState((prev) => {
        const targetState = prev[activeTarget];
        const assignmentsByFormation = Object.fromEntries(
          Object.entries(targetState.assignmentsByFormation).map(([formationId, assignments]) => [
            formationId,
            Object.fromEntries(Object.entries(assignments).filter(([, id]) => id !== memberId)),
          ]),
        );
        const benchAssignmentsByFormation = Object.fromEntries(
          Object.entries(targetState.benchAssignmentsByFormation).map(([formationId, assignments]) => [
            formationId,
            Object.fromEntries(Object.entries(assignments).filter(([, id]) => id !== memberId)),
          ]),
        );
        return {
          ...prev,
          [activeTarget]: {
            ...targetState,
            members: targetState.members.filter((m) => m.id !== memberId),
            assignmentsByFormation,
            benchAssignmentsByFormation,
          },
        };
      });
    };

    const setFormationId = (id: string) => {
      setState((prev) => ({
        ...prev,
        [activeTarget]: { ...prev[activeTarget], formationId: id },
      }));
    };

    // スタメンに割り当てる。同じ選手が他のスタメン枠・ベンチ枠にいた場合はそちらから外す
    // （1人がスタメンとベンチを同時に兼任しないようにするため）。
    const assignMember = (slotId: string, memberId: string) => {
      setState((prev) => {
        const targetState = prev[activeTarget];
        const starterMap = stripMemberFromMap(
          targetState.assignmentsByFormation[targetState.formationId] ?? {},
          memberId,
        );
        starterMap[slotId] = memberId;
        const benchMap = stripMemberFromMap(
          targetState.benchAssignmentsByFormation[targetState.formationId] ?? {},
          memberId,
        );
        return {
          ...prev,
          [activeTarget]: {
            ...targetState,
            assignmentsByFormation: {
              ...targetState.assignmentsByFormation,
              [targetState.formationId]: starterMap,
            },
            benchAssignmentsByFormation: {
              ...targetState.benchAssignmentsByFormation,
              [targetState.formationId]: benchMap,
            },
          },
        };
      });
    };

    const unassignSlot = (slotId: string) => {
      setState((prev) => {
        const targetState = prev[activeTarget];
        const starterMap = {
          ...(targetState.assignmentsByFormation[targetState.formationId] ?? {}),
        };
        delete starterMap[slotId];
        return {
          ...prev,
          [activeTarget]: {
            ...targetState,
            assignmentsByFormation: {
              ...targetState.assignmentsByFormation,
              [targetState.formationId]: starterMap,
            },
          },
        };
      });
    };

    // ベンチに割り当てる。assignMemberと対称のロジック（スタメン・ベンチ両方から重複を外してから設定する）。
    const assignBench = (slotId: string, memberId: string) => {
      setState((prev) => {
        const targetState = prev[activeTarget];
        const starterMap = stripMemberFromMap(
          targetState.assignmentsByFormation[targetState.formationId] ?? {},
          memberId,
        );
        const benchMap = stripMemberFromMap(
          targetState.benchAssignmentsByFormation[targetState.formationId] ?? {},
          memberId,
        );
        benchMap[slotId] = memberId;
        return {
          ...prev,
          [activeTarget]: {
            ...targetState,
            assignmentsByFormation: {
              ...targetState.assignmentsByFormation,
              [targetState.formationId]: starterMap,
            },
            benchAssignmentsByFormation: {
              ...targetState.benchAssignmentsByFormation,
              [targetState.formationId]: benchMap,
            },
          },
        };
      });
    };

    const unassignBench = (slotId: string) => {
      setState((prev) => {
        const targetState = prev[activeTarget];
        const benchMap = {
          ...(targetState.benchAssignmentsByFormation[targetState.formationId] ?? {}),
        };
        delete benchMap[slotId];
        return {
          ...prev,
          [activeTarget]: {
            ...targetState,
            benchAssignmentsByFormation: {
              ...targetState.benchAssignmentsByFormation,
              [targetState.formationId]: benchMap,
            },
          },
        };
      });
    };

    // ピッチの配置（スタメン・ベンチ）だけでなく、選択中ターゲットの「あなたの26人」全員を削除する
    // （もう一方のターゲットの編成には影響しない）
    const clearSquad = () => {
      setState((prev) => ({
        ...prev,
        [activeTarget]: {
          ...prev[activeTarget],
          members: [],
          assignmentsByFormation: {},
          benchAssignmentsByFormation: {},
        },
      }));
      toast.success("あなたの26人をすべてクリアしました");
    };

    return {
      players,
      members: current.members,
      addMember,
      removeMember,
      formationId: current.formationId,
      setFormationId,
      assignments: current.assignmentsByFormation[current.formationId] ?? {},
      assignMember,
      unassignSlot,
      benchAssignments: current.benchAssignmentsByFormation[current.formationId] ?? {},
      assignBench,
      unassignBench,
      clearSquad,
      isHydrated,
      target: activeTarget,
      setTarget: setActiveTarget,
      membersByTarget: { next: state.next.members, "2030": state["2030"].members },
    };
  }, [state, activeTarget, isHydrated, players]);

  return <SquadContext.Provider value={value}>{children}</SquadContext.Provider>;
}

export function useSquad() {
  const ctx = useContext(SquadContext);
  if (!ctx) throw new Error("useSquad must be used within SquadProvider");
  return ctx;
}

export const SQUAD_MAX_SIZE = MAX_SQUAD_SIZE;
