import "./squad-comparison-panel.scss";
import { useMemo } from "react";
import type { Player, RosterMember } from "@/lib/types";
import { compareSquad } from "@/lib/squad-comparison";
import { OFFICIAL_SQUAD_NEXT_PLAYER_IDS } from "@/lib/data/official-squad-next";
import { CircularProgress } from "@/components/squad/circular-progress";
import { MatchStatusBadge } from "@/components/squad/match-status-badge";
import { PlayerAvatar } from "@/components/shared/player-avatar";

export function SquadComparisonPanel({
  members,
  players,
}: {
  members: RosterMember[];
  players: Player[];
}) {
  const result = useMemo(
    () => compareSquad(members, OFFICIAL_SQUAD_NEXT_PLAYER_IDS, players),
    [members, players],
  );

  return (
    <div className="squad-comparison-panel">
      <div className="squad-comparison-panel__header">
        <div>
          <p className="squad-comparison-panel__label">公式発表メンバーとの一致率</p>
          <p className="squad-comparison-panel__hint">
            あなたの26人と実際に発表されたメンバーを比較しています
          </p>
        </div>
        <CircularProgress percent={result.matchRate} caption="一致率" />
      </div>

      {result.comparedMembers.length === 0 ? (
        <p className="squad-comparison-panel__empty">
          まだ誰も追加されていません。メンバーを追加すると公式発表との一致率が表示されます。
        </p>
      ) : (
        <ul className="squad-comparison-panel__list">
          {result.comparedMembers.map(({ member, status }) => (
            <li key={member.id} className="squad-comparison-panel__row">
              <PlayerAvatar label={member.nameEn} theme={member.avatarTheme} size="sm" />
              <span className="squad-comparison-panel__name">{member.name}</span>
              <MatchStatusBadge status={status} />
            </li>
          ))}
        </ul>
      )}

      {result.surpriseSelections.length > 0 && (
        <div className="squad-comparison-panel__surprises">
          <p className="squad-comparison-panel__label">サプライズ選出</p>
          <ul className="squad-comparison-panel__list">
            {result.surpriseSelections.map((p) => (
              <li key={p.playerId} className="squad-comparison-panel__row">
                <PlayerAvatar label={p.nameEn} theme={p.avatarTheme} size="sm" />
                <span className="squad-comparison-panel__name">{p.name}</span>
                <MatchStatusBadge status="surprise" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
