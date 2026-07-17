"use client";

import "./trending-squads.scss";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { getPlayerById } from "@/lib/data/players";
import { Badge } from "@/components/ui/badge";
import type { CommunitySquad } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric" }).format(
    new Date(iso),
  );
}

export function TrendingSquads({ squads }: { squads: CommunitySquad[] }) {
  return (
    <div className="trending-squads">
      {squads.map((squad) => (
        <div key={squad.id} className="trending-squads__card">
          <div className="trending-squads__header">
            <div className="trending-squads__author">
              <PlayerAvatar label={squad.authorName} seed={squad.authorAvatarSeed} size="sm" />
              <div>
                <p className="trending-squads__author-name">{squad.authorName}</p>
                <p className="trending-squads__date">{formatDate(squad.createdAt)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="trending-squads__formation">
              {squad.formationName}
            </Badge>
          </div>

          <p className="trending-squads__title">{squad.title}</p>

          <div className="trending-squads__avatars">
            {squad.topPlayers.map((id) => {
              const player = getPlayerById(id);
              if (!player) return null;
              return (
                <PlayerAvatar
                  key={id}
                  label={player.nameEn}
                  theme={player.avatarTheme}
                  size="sm"
                  className="trending-squads__avatar"
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => toast("いいねしました（デモ）")}
            className="trending-squads__like"
          >
            <Heart className="trending-squads__like-icon" />
            {squad.likes}
          </button>
        </div>
      ))}
    </div>
  );
}
