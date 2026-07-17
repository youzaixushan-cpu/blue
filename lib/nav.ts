import type { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  ListChecks,
  Sparkles,
  Trophy,
  UserCircle,
  CalendarClock,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/players", label: "選手一覧", icon: Users },
  { href: "/my-squad", label: "あなたの26人", icon: ListChecks },
];

export const moreNavItems: NavItem[] = [
  { href: "/matches", label: "試合結果", icon: CalendarClock },
  { href: "/ai-team", label: "AI代表", icon: Sparkles },
  { href: "/community", label: "みんなの代表", icon: Trophy },
  { href: "/mypage", label: "マイページ", icon: UserCircle },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...moreNavItems];
