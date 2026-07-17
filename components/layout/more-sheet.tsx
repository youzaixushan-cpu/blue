"use client";

import "./more-sheet.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { moreNavItems } from "@/lib/nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function MoreSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = moreNavItems.some((item) => pathname.startsWith(item.href));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn("bottom-nav__link", isActive && "bottom-nav__link--active")}
        >
          <MoreHorizontal className="bottom-nav__icon" />
          もっと見る
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="more-sheet">
        <SheetHeader>
          <SheetTitle>もっと見る</SheetTitle>
        </SheetHeader>
        <div className="more-sheet__grid">
          {moreNavItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("more-sheet__item", active && "more-sheet__item--active")}
              >
                <Icon className="more-sheet__item-icon" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
