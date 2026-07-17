import "./profile-card.scss";
import { PlayerAvatar } from "@/components/shared/player-avatar";
import { Badge } from "@/components/ui/badge";
import type { DummyUser } from "@/lib/types";

export function ProfileCard({ user }: { user: DummyUser }) {
  return (
    <div className="profile-card">
      <PlayerAvatar label={user.name} seed={user.avatarSeed} size="xl" />
      <div className="profile-card__info">
        <Badge className="profile-card__level">{user.fanLevel}</Badge>
        <h1 className="profile-card__name">{user.name}</h1>
        <p className="profile-card__handle">{user.handle}</p>
        <p className="profile-card__since">{user.memberSince}から利用中</p>
      </div>
    </div>
  );
}
