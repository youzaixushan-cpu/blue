"use client";

import "./player-filter-bar.scss";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Position } from "@/lib/types";

interface PlayerFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  position: Position | "ALL";
  onPositionChange: (value: Position | "ALL") => void;
  resultCount: number;
}

const POSITION_TABS: { value: Position | "ALL"; label: string }[] = [
  { value: "ALL", label: "全て" },
  { value: "GK", label: "GK" },
  { value: "DF", label: "DF" },
  { value: "MF", label: "MF" },
  { value: "FW", label: "FW" },
];

export function PlayerFilterBar({
  search,
  onSearchChange,
  position,
  onPositionChange,
  resultCount,
}: PlayerFilterBarProps) {
  return (
    <div className="player-filter-bar">
      <div className="player-filter-bar__search">
        <Search className="player-filter-bar__search-icon" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="選手名・クラブで検索"
          className="player-filter-bar__search-input"
        />
      </div>

      <div className="player-filter-bar__row">
        <Tabs value={position} onValueChange={(v) => onPositionChange(v as Position | "ALL")}>
          <TabsList className="player-filter-bar__tabs">
            {POSITION_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="player-filter-bar__tab">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="player-filter-bar__count">{resultCount}人が該当</p>
      </div>
    </div>
  );
}
