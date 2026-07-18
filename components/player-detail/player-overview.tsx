import "./player-overview.scss";
import type { Player } from "@/lib/types";

const INFO_ROWS = (player: Player) => [
  { label: "所属クラブ", value: player.club },
  { label: "年齢", value: `${player.age}歳` },
];

export function PlayerOverview({ player }: { player: Player }) {
  const maxRating = 10;

  return (
    <div className="player-overview">
      <section className="player-overview__section">
        <p className="player-overview__bio">{player.bio}</p>
        <dl className="player-overview__info-grid">
          {INFO_ROWS(player).map((row) => (
            <div key={row.label} className="player-overview__info-row">
              <dt className="player-overview__info-label">{row.label}</dt>
              <dd className="player-overview__info-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="player-overview__section">
        <h2 className="player-overview__heading">直近5試合の采配レーティング</h2>
        <div className="player-overview__ratings">
          {player.recentRatings.map((rating, index) => (
            <div key={index} className="player-overview__rating-row">
              <span className="player-overview__rating-match">第{index + 1}戦</span>
              <div className="player-overview__rating-track">
                <div
                  className="player-overview__rating-fill"
                  style={{ width: `${(rating / maxRating) * 100}%` }}
                />
              </div>
              <span className="player-overview__rating-value">
                {rating > 0 ? rating.toFixed(1) : "-"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="player-overview__section">
        <h2 className="player-overview__heading">経歴</h2>
        <ol className="player-overview__timeline">
          {player.career.map((entry, index) => (
            <li key={index} className="player-overview__timeline-item">
              <span className="player-overview__timeline-dot" />
              <p className="player-overview__timeline-year">{entry.year}</p>
              <p className="player-overview__timeline-club">{entry.club}</p>
            </li>
          ))}
        </ol>
      </section>

      {player.lastSyncedAt && (
        <p className="player-overview__sync-note">
          年齢・所属クラブはWikidataと自動同期しています（最終更新:{" "}
          {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(
            new Date(player.lastSyncedAt),
          )}
          ）
        </p>
      )}
    </div>
  );
}
