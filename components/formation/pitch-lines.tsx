import "./pitch-lines.scss";

export function PitchLines() {
  return (
    <svg
      aria-hidden
      className="pitch__lines"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect x="3" y="3" width="94" height="94" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <line x1="3" y1="50" x2="97" y2="50" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <rect x="24" y="3" width="52" height="16" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <rect x="24" y="81" width="52" height="16" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <rect x="37" y="3" width="26" height="6" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
      <rect x="37" y="91" width="26" height="6" fill="none" stroke="var(--pitch-line)" strokeWidth="0.5" />
    </svg>
  );
}
