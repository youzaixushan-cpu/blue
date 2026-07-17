import "./formation-ranking.scss";
import { Trophy } from "lucide-react";
import { getFormationById } from "@/lib/data/formations";
import type { FormationRanking } from "@/lib/types";
import { cn } from "@/lib/utils";

const MEDAL_MODIFIER = [
  "formation-ranking__medal--gold",
  "formation-ranking__medal--silver",
  "formation-ranking__medal--bronze",
];

export function FormationRankingList({ rankings }: { rankings: FormationRanking[] }) {
  return (
    <div className="formation-ranking">
      {rankings.map((ranking) => {
        const formation = getFormationById(ranking.formationId);
        if (!formation) return null;
        return (
          <div key={ranking.formationId} className="formation-ranking__card">
            <div className="formation-ranking__top">
              <span className={cn("formation-ranking__medal", MEDAL_MODIFIER[ranking.rank - 1])}>
                {ranking.rank === 1 ? <Trophy className="formation-ranking__medal-icon" /> : ranking.rank}
              </span>
              <span className="formation-ranking__share">{ranking.share}%</span>
            </div>
            <p className="formation-ranking__name">{formation.name}</p>
            <p className="formation-ranking__description">{formation.description}</p>
          </div>
        );
      })}
    </div>
  );
}
