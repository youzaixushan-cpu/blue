import "./profile-card.scss";
import { PlayerAvatar } from "@/components/shared/player-avatar";

export function ProfileCard({
  name,
  email,
  memberSince,
}: {
  name: string;
  email: string;
  memberSince: string;
}) {
  return (
    <div className="profile-card">
      <PlayerAvatar label={name} seed={email} size="xl" />
      <div className="profile-card__info">
        <h1 className="profile-card__name">{name}</h1>
        <p className="profile-card__handle">{email}</p>
        <p className="profile-card__since">{memberSince}から利用中</p>
      </div>
    </div>
  );
}
