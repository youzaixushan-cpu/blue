import "./pitch-frame.scss";
import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export function PitchFrame({
  children,
  className,
  ref,
}: {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div className={cn("pitch-frame", className)} ref={ref}>
      <div className="pitch-frame__glow" aria-hidden />
      <div className="pitch-frame__field">{children}</div>
    </div>
  );
}
