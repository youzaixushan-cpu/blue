import "./circular-progress.scss";
import { cn } from "@/lib/utils";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  caption?: string;
  className?: string;
}

export function CircularProgress({
  percent,
  size = 128,
  strokeWidth = 10,
  caption,
  className,
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className={cn("circular-progress", className)} style={{ width: size, height: size }}>
      <svg
        className="circular-progress__svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        <circle className="circular-progress__track" cx="50" cy="50" r={RADIUS} strokeWidth={strokeWidth} />
        <circle
          className="circular-progress__arc"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="circular-progress__value">
        <span>
          {Math.round(clamped)}
          <span className="circular-progress__unit">%</span>
        </span>
        {caption && <span className="circular-progress__caption">{caption}</span>}
      </div>
    </div>
  );
}
