import "./squad-summary-bar.scss";
import { SQUAD_MAX_SIZE } from "@/lib/squad-context";
import type { Position } from "@/lib/types";

const POSITION_ORDER: Position[] = ["GK", "DF", "MF", "FW"];

export function SquadSummaryBar({
  countsByPosition,
  total,
}: {
  countsByPosition: Record<Position, number>;
  total: number;
}) {
  const percent = Math.min(100, (total / SQUAD_MAX_SIZE) * 100);

  return (
    <div className="squad-summary-bar">
      <div className="squad-summary-bar__top">
        <div>
          <p className="squad-summary-bar__label">選出済み</p>
          <p className="squad-summary-bar__total">
            {total}
            <span className="squad-summary-bar__max"> / {SQUAD_MAX_SIZE}人</span>
          </p>
        </div>
        <div className="squad-summary-bar__breakdown">
          {POSITION_ORDER.map((pos) => (
            <div key={pos} className="squad-summary-bar__breakdown-item">
              <p className="squad-summary-bar__breakdown-count">{countsByPosition[pos]}</p>
              <p className="squad-summary-bar__breakdown-label">{pos}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="squad-summary-bar__track">
        <div className="squad-summary-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
