import "./confidence-bar.scss";
import { cn } from "@/lib/utils";

function modifierForConfidence(confidence: number) {
  if (confidence >= 90) return "confidence-bar__fill--high";
  if (confidence >= 80) return "confidence-bar__fill--good";
  if (confidence >= 70) return "confidence-bar__fill--fair";
  return "confidence-bar__fill--low";
}

export function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="confidence-bar">
      <div className="confidence-bar__track">
        <div
          className={cn("confidence-bar__fill", modifierForConfidence(confidence))}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="confidence-bar__value">{confidence}%</span>
    </div>
  );
}
