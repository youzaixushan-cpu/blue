"use client";

import "./page.scss";
import { useMemo, useState } from "react";
import { players } from "@/lib/data/players";
import { PlayerCard } from "@/components/players/player-card";
import { PlayerFilterBar } from "@/components/players/player-filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Position } from "@/lib/types";

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<Position | "ALL">("ALL");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter((p) => p.officialSquad).filter((p) => {
      const matchesPosition = position === "ALL" || p.position === position;
      const matchesQuery =
        query.length === 0 ||
        p.name.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.club.toLowerCase().includes(query);
      return matchesPosition && matchesQuery;
    });
  }, [search, position]);

  return (
    <div className="players-page">
      <SectionHeading
        eyebrow="Players"
        title="選手一覧"
        description="直近の招集メンバー26名のプロフィールを検索・閲覧できます。"
        className="players-page__heading"
      />

      <PlayerFilterBar
        search={search}
        onSearchChange={setSearch}
        position={position}
        onPositionChange={setPosition}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="players-page__empty">
          <p className="players-page__empty-title">該当する選手が見つかりません</p>
          <p className="players-page__empty-hint">検索条件を変えてお試しください。</p>
        </div>
      ) : (
        <div className="players-page__grid">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
