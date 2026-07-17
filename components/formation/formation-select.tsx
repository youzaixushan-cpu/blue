"use client";

import "./formation-select.scss";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formationTemplates } from "@/lib/data/formations";

export function FormationSelect({
  value,
  onChange,
  placeholder = "フォーメーションを選択",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="formation-select">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {formationTemplates.map((formation) => (
          <SelectItem key={formation.id} value={formation.id}>
            {formation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
