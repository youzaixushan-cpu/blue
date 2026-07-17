"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { players } from "@/lib/data/players";
import type { Position, RosterMember } from "@/lib/types";

const STORAGE_KEY = "samurai-squad-v4";
const MAX_SQUAD_SIZE = 26;
const DEFAULT_FORMATION_ID = "f-433";

interface SquadState {
  members: RosterMember[];
  formationId: string;
  assignmentsByFormation: Record<string, Record<string, string>>;
}

const DEFAULT_STATE: SquadState = {
  members: [],
  formationId: DEFAULT_FORMATION_ID,
  assignmentsByFormation: {},
};

interface SquadContextValue {
  members: RosterMember[];
  addMember: (name: string, position: Position) => void;
  removeMember: (memberId: string) => void;
  formationId: string;
  setFormationId: (id: string) => void;
  assignments: Record<string, string>;
  assignMember: (slotId: string, memberId: string) => void;
  unassignSlot: (slotId: string) => void;
  clearAssignments: () => void;
  isHydrated: boolean;
}

const SquadContext = createContext<SquadContextValue | null>(null);

export function SquadProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SquadState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SquadState;
        // localStorage（外部システム）からの初回同期のため、マウント時に一度だけ実行
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // 破損データは無視してデフォルトを使用
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  const value = useMemo<SquadContextValue>(() => {
    const addMember = (rawName: string, position: Position) => {
      const name = rawName.trim();
      if (!name) return;

      setState((prev) => {
        if (prev.members.length >= MAX_SQUAD_SIZE) {
          toast.error("あなたの26人はすでに定員です。誰かを外してから追加してください。");
          return prev;
        }

        const matched = players.find((p) => p.name === name);

        if (matched) {
          if (prev.members.some((m) => m.playerId === matched.id)) {
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
          return { ...prev, members: [...prev.members, member] };
        }

        const member: RosterMember = {
          id: `custom-${crypto.randomUUID()}`,
          name,
          nameEn: name,
          position,
          club: "未登録",
        };
        toast.success(`${name}を予想メンバーとして追加しました`);
        return { ...prev, members: [...prev.members, member] };
      });
    };

    const removeMember = (memberId: string) => {
      setState((prev) => {
        const assignmentsByFormation = Object.fromEntries(
          Object.entries(prev.assignmentsByFormation).map(([formationId, assignments]) => [
            formationId,
            Object.fromEntries(
              Object.entries(assignments).filter(([, id]) => id !== memberId),
            ),
          ]),
        );
        return {
          ...prev,
          members: prev.members.filter((m) => m.id !== memberId),
          assignmentsByFormation,
        };
      });
    };

    const setFormationId = (id: string) => {
      setState((prev) => ({ ...prev, formationId: id }));
    };

    const assignMember = (slotId: string, memberId: string) => {
      setState((prev) => {
        const current = { ...(prev.assignmentsByFormation[prev.formationId] ?? {}) };
        for (const [existingSlot, existingMemberId] of Object.entries(current)) {
          if (existingMemberId === memberId && existingSlot !== slotId) {
            delete current[existingSlot];
          }
        }
        current[slotId] = memberId;
        return {
          ...prev,
          assignmentsByFormation: {
            ...prev.assignmentsByFormation,
            [prev.formationId]: current,
          },
        };
      });
    };

    const unassignSlot = (slotId: string) => {
      setState((prev) => {
        const current = { ...(prev.assignmentsByFormation[prev.formationId] ?? {}) };
        delete current[slotId];
        return {
          ...prev,
          assignmentsByFormation: {
            ...prev.assignmentsByFormation,
            [prev.formationId]: current,
          },
        };
      });
    };

    const clearAssignments = () => {
      setState((prev) => ({
        ...prev,
        assignmentsByFormation: {
          ...prev.assignmentsByFormation,
          [prev.formationId]: {},
        },
      }));
    };

    return {
      members: state.members,
      addMember,
      removeMember,
      formationId: state.formationId,
      setFormationId,
      assignments: state.assignmentsByFormation[state.formationId] ?? {},
      assignMember,
      unassignSlot,
      clearAssignments,
      isHydrated,
    };
  }, [state, isHydrated]);

  return <SquadContext.Provider value={value}>{children}</SquadContext.Provider>;
}

export function useSquad() {
  const ctx = useContext(SquadContext);
  if (!ctx) throw new Error("useSquad must be used within SquadProvider");
  return ctx;
}

export const SQUAD_MAX_SIZE = MAX_SQUAD_SIZE;
