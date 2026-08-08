"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSquad } from "@/lib/squad-context";
import type { SquadTarget } from "@/lib/squad-target";
import "./squad-detail-cta.scss";

export function SquadDetailCta({ target }: { target: SquadTarget }) {
  const { membersByTarget, isHydrated } = useSquad();
  const hasOwnSquad = isHydrated && membersByTarget[target].length > 0;

  return (
    <div className="squad-detail-cta">
      <p className="squad-detail-cta__text">この布陣、あなたならどう組む？</p>
      <Button asChild className="squad-detail-cta__button">
        <Link href="/my-squad">{hasOwnSquad ? "自分の編成と比べる" : "自分の26人を作ってみる"}</Link>
      </Button>
    </div>
  );
}
