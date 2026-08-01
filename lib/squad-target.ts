export type SquadTarget = "next" | "2030";

export const SQUAD_TARGETS: { value: SquadTarget; label: string; shortLabel: string }[] = [
  { value: "next", label: "次回の試合（直近の代表招集）", shortLabel: "次回の試合" },
  { value: "2030", label: "2030年 FIFAワールドカップ", shortLabel: "2030年W杯" },
];

export const DEFAULT_SQUAD_TARGET: SquadTarget = "next";

export function isSquadTarget(value: unknown): value is SquadTarget {
  return value === "next" || value === "2030";
}

export function squadTargetLabel(target: SquadTarget): string {
  return SQUAD_TARGETS.find((t) => t.value === target)?.label ?? target;
}

export function squadTargetShortLabel(target: SquadTarget): string {
  return SQUAD_TARGETS.find((t) => t.value === target)?.shortLabel ?? target;
}
