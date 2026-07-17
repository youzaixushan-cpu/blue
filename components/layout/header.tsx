"use client";

import "./header.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { allNavItems } from "@/lib/nav";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { dummyUser } from "@/lib/data/user";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="header__brand">
          <span className="header__brand-name">SAMURAI BLUE FAN HUB</span>
        </Link>

        <nav className="header__nav">
          {allNavItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("header__nav-link", active && "header__nav-link--active")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header__actions">
          <Link href="/mypage" aria-label="マイページ">
            <PlayerAvatar label={dummyUser.name} seed={dummyUser.avatarSeed} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
