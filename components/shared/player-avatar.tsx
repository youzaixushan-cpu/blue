import "./player-avatar.scss";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVATAR_THEMES, themeForSeed, type AvatarThemeKey } from "@/lib/avatar";

interface PlayerAvatarProps {
  label: string;
  seed?: string;
  theme?: AvatarThemeKey;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PlayerAvatar({ label, seed, theme, size = "md", className }: PlayerAvatarProps) {
  const resolvedTheme = theme ?? themeForSeed(seed ?? label);
  const { from, to } = AVATAR_THEMES[resolvedTheme];

  return (
    <div
      className={cn("player-avatar", `player-avatar--${size}`, className)}
      style={{ "--player-avatar-from": from, "--player-avatar-to": to } as React.CSSProperties}
    >
      <UserRound className="player-avatar__icon" />
    </div>
  );
}
