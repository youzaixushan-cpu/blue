import "./stat-tiles.scss";
import type { Player } from "@/lib/types";

export function StatTiles({ player }: { player: Player }) {
  const tiles = [
    { label: "代表キャップ数", value: player.caps, suffix: "試合" },
    { label: "代表通算得点", value: player.goals, suffix: "得点" },
    { label: "身長", value: player.height, suffix: "cm" },
    { label: "体重", value: player.weight, suffix: "kg" },
  ];

  return (
    <div className="stat-tiles">
      {tiles.map((tile) => (
        <div key={tile.label} className="stat-tiles__tile">
          <p className="stat-tiles__value">
            {tile.value}
            <span className="stat-tiles__suffix">{tile.suffix}</span>
          </p>
          <p className="stat-tiles__label">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}
