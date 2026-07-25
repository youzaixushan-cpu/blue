"use client";

import "./header.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { allNavItems } from "@/lib/nav";
import { PlayerAvatar } from "@/components/shared/player-avatar";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="header__brand">
          <span className="header__brand-name">BlueScout</span>
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
          {session?.user ? (
            <Link href="/mypage" aria-label="マイページ">
              <PlayerAvatar
                label={session.user.name ?? session.user.email ?? "User"}
                seed={session.user.email ?? session.user.name ?? undefined}
                size="sm"
              />
            </Link>
          ) : (
            <Link href="/login" className="header__login-link">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
