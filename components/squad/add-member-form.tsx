"use client";

import "./add-member-form.scss";
import { useMemo, useState } from "react";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { useSquad } from "@/lib/squad-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PositionBadge } from "@/components/players/position-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Position } from "@/lib/types";

const POSITION_ORDER: Position[] = ["GK", "DF", "MF", "FW"];
const POSITION_GROUP_LABEL: Record<Position, string> = {
  GK: "ゴールキーパー",
  DF: "ディフェンダー",
  MF: "ミッドフィルダー",
  FW: "フォワード",
};

export function AddMemberForm({
  onAdd,
}: {
  onAdd: (name: string, position: Position) => void;
}) {
  const { players } = useSquad();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState<Position>("MF");

  // 候補として出すのは直近の招集メンバー（officialSquad）のみ
  const candidates = useMemo(() => players.filter((p) => p.officialSquad), [players]);

  const matchedPlayer = useMemo(
    () => candidates.find((p) => p.name === name.trim()),
    [candidates, name],
  );

  function selectPlayer(playerName: string) {
    setName(playerName);
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, position);
    setName("");
    setOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className="add-member-form">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="add-member-form__trigger">
            <span
              className={cn(
                "add-member-form__trigger-text",
                !name && "add-member-form__trigger-text--placeholder",
              )}
            >
              {name || "選手名を検索、または自由入力"}
            </span>
            <ChevronsUpDown className="add-member-form__trigger-icon" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="add-member-form__popover" align="start">
          <Command>
            <CommandInput
              value={name}
              onValueChange={setName}
              placeholder="選手名で検索、または自由入力..."
            />
            <CommandList>
              <CommandEmpty>
                <span className="add-member-form__empty">
                  一致する登録選手はいません。「追加」を押すとこの名前で新規登録できます。
                </span>
              </CommandEmpty>
              {POSITION_ORDER.map((pos) => {
                const list = candidates.filter((p) => p.position === pos);
                if (list.length === 0) return null;
                return (
                  <CommandGroup key={pos} heading={POSITION_GROUP_LABEL[pos]}>
                    {list.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.name}
                        onSelect={() => selectPlayer(p.name)}
                      >
                        {p.name}
                        <span className="add-member-form__item-club">{p.club}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {matchedPlayer ? (
        <div className="add-member-form__matched">
          <PositionBadge position={matchedPlayer.position} />
        </div>
      ) : (
        <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
          <SelectTrigger className="add-member-form__position">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POSITION_ORDER.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button type="submit" className="add-member-form__submit">
        <UserPlus className="add-member-form__submit-icon" />
        追加
      </Button>
    </form>
  );
}
