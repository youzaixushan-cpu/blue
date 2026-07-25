import "./pitch-player-marker.scss";
import { cn } from "@/lib/utils";

interface PitchPlayerMarkerProps {
  size?: "sm" | "md";
  haloClassName?: string;
  className?: string;
}

// ユニフォームの柄・ロゴは年ごとに変わりうるため描かず、頭部＋肩から下の胴体だけの
// シンプルな人型ピクトグラムで統一する（実在するJFA/Adidasのデザインは再現しない）。
// 選手ごとの色分けはせず、全員同じ色にして統一感を出す。
export function PitchPlayerMarker({ size = "md", haloClassName, className }: PitchPlayerMarkerProps) {
  return (
    <div className={cn("pitch-player-marker", `pitch-player-marker--${size}`, className)}>
      {haloClassName && <span className={cn("pitch-player-marker__halo", haloClassName)} aria-hidden />}
      <svg aria-hidden className="pitch-player-marker__figure" viewBox="0 0 24 30">
        <circle cx="12" cy="7" r="6" fill="currentColor" />
        <path d="M4 29 L4 20 Q4 13 12 13 Q20 13 20 20 L20 29 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
