import "./target-link-tabs.scss";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SQUAD_TARGETS, type SquadTarget } from "@/lib/squad-target";

interface TargetLinkTabsProps {
  active: SquadTarget;
  basePath: string;
  className?: string;
}

export function TargetLinkTabs({ active, basePath, className }: TargetLinkTabsProps) {
  return (
    <div className={cn("target-link-tabs", className)}>
      {SQUAD_TARGETS.map((t) => (
        <Link
          key={t.value}
          href={t.value === "next" ? basePath : `${basePath}?target=${t.value}`}
          className={cn(
            "target-link-tabs__item",
            active === t.value && "target-link-tabs__item--active",
          )}
          aria-current={active === t.value ? "page" : undefined}
        >
          {t.shortLabel}
        </Link>
      ))}
    </div>
  );
}
