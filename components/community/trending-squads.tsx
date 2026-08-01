import "./trending-squads.scss";
import Link from "next/link";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/community/like-button";
import type { CommunitySquad, Player } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric" }).format(
    new Date(iso),
  );
}

export function TrendingSquads({
  squads,
  players,
}: {
  squads: CommunitySquad[];
  players: Record<string, Player>;
}) {
  return (
    <div className="trending-squads">
      {squads.map((squad) => (
        <Link
          key={squad.id}
          href={`/community/${squad.id}`}
          className="trending-squads__card"
        >
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
              const player = players[id];
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

          <LikeButton
            submissionId={squad.id}
            initialLikes={squad.likes}
            className="trending-squads__like"
            iconClassName="trending-squads__like-icon"
          />
        </Link>
      ))}
    </div>
  );
}
