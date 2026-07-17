import "./profile-header.scss";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { PositionBadge } from "@/components/players/position-badge";
import type { Player } from "@/lib/types";

export function ProfileHeader({ player }: { player: Player }) {
  return (
    <section className="profile-header">
      <div className="profile-header__inner">
        <Link href="/players" className="profile-header__back">
          <ChevronLeft className="profile-header__back-icon" />
          選手一覧に戻る
        </Link>

        <div className="profile-header__content">
          <PlayerAvatar
            label={player.nameEn}
            theme={player.avatarTheme}
            size="xl"
          />
          <div className="profile-header__main">
            <div className="profile-header__badges">
              <PositionBadge position={player.position} />
            </div>
            <h1 className="profile-header__name">{player.name}</h1>
            <p className="profile-header__meta">
              {player.nameEn} ・ {player.club}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
