"use client";

import "./bottom-nav.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/lib/nav";
import { MoreSheet } from "@/components/layout/more-sheet";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__inner">
        {primaryNavItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("bottom-nav__link", active && "bottom-nav__link--active")}
            >
              <Icon className="bottom-nav__icon" />
              {item.label}
            </Link>
          );
        })}
        <MoreSheet />
      </div>
    </nav>
  );
}
