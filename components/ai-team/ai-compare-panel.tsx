"use client";

import "./ai-compare-panel.scss";
import { useMemo } from "react";
import type { Player } from "@/lib/types";
import type { SquadTarget } from "@/lib/squad-target";
import { useSquad } from "@/lib/squad-context";
import { compareSquad, type MatchStatus } from "@/lib/squad-comparison";
import { CircularProgress } from "@/components/squad/circular-progress";
import { MatchStatusBadge } from "@/components/squad/match-status-badge";
import { PlayerAvatar } from "@/components/shared/player-avatar";

const AI_COMPARE_LABELS: Partial<Record<MatchStatus, string>> = {
  hit: "AIと一致",
  "predicted-miss": "あなたのみ選出",
  surprise: "AIのみ選出",
};

export function AiComparePanel({
  target,
  aiPlayerIds,
  players,
}: {
  target: SquadTarget;
  aiPlayerIds: string[];
  players: Player[];
}) {
  const { membersByTarget } = useSquad();
  const members = membersByTarget[target];

  const result = useMemo(
    () => compareSquad(members, aiPlayerIds, players),
    [members, aiPlayerIds, players],
  );

  return (
    <div className="ai-compare-panel">
      <div className="ai-compare-panel__header">
        <div>
          <p className="ai-compare-panel__label">AI代表との一致率</p>
          <p className="ai-compare-panel__hint">
            あなたの26人とAIのベストイレブンを比較しています
          </p>
        </div>
        <CircularProgress percent={result.matchRate} caption="一致率" />
      </div>

      {result.comparedMembers.length === 0 ? (
        <p className="ai-compare-panel__empty">
          まだ「あなたの26人」に誰も追加されていません。あなたの26人のページでメンバーを追加すると、AIの予想との一致率が表示されます。
        </p>
      ) : (
        <ul className="ai-compare-panel__list">
          {result.comparedMembers.map(({ member, status }) => (
            <li key={member.id} className="ai-compare-panel__row">
              <PlayerAvatar label={member.nameEn} theme={member.avatarTheme} size="sm" />
              <span className="ai-compare-panel__name">{member.name}</span>
              <MatchStatusBadge status={status} labels={AI_COMPARE_LABELS} />
            </li>
          ))}
        </ul>
      )}

      {result.surpriseSelections.length > 0 && (
        <div className="ai-compare-panel__surprises">
          <p className="ai-compare-panel__label">AIのみ選出した選手</p>
          <ul className="ai-compare-panel__list">
            {result.surpriseSelections.map((p) => (
              <li key={p.playerId} className="ai-compare-panel__row">
                <PlayerAvatar label={p.nameEn} theme={p.avatarTheme} size="sm" />
                <span className="ai-compare-panel__name">{p.name}</span>
                <MatchStatusBadge status="surprise" labels={AI_COMPARE_LABELS} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
