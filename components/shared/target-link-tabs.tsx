import "./target-link-tabs.scss";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SQUAD_TARGETS, type SquadTarget } from "@/lib/squad-target";

interface TargetLinkTabsProps {
  active: SquadTarget | undefined;
  basePath: string;
  // trueの時だけ先頭に、クエリパラメータ無し（target未指定＝すべて）へのピルを追加する
  showAllOption?: boolean;
  className?: string;
}

export function TargetLinkTabs({ active, basePath, showAllOption, className }: TargetLinkTabsProps) {
  return (
    <div className={cn("target-link-tabs", className)}>
      {showAllOption && (
        <Link
          href={basePath}
          className={cn(
            "target-link-tabs__item",
            active === undefined && "target-link-tabs__item--active",
          )}
          aria-current={active === undefined ? "page" : undefined}
        >
          すべて
        </Link>
      )}
      {SQUAD_TARGETS.map((t) => (
        <Link
          key={t.value}
          href={`${basePath}?target=${t.value}`}
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
