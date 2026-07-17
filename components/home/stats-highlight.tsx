import "./stats-highlight.scss";

const STATS = [
  { label: "FIFAランキング", value: "16", suffix: "位" },
  { label: "2026年通算成績", value: "4勝2分1敗", suffix: "" },
  { label: "W杯登録選手数", value: "26", suffix: "人" },
];

export function StatsHighlight() {
  return (
    <section className="stats-highlight">
      <div className="stats-highlight__panel">
        <div className="stats-highlight__stats">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="stats-highlight__value">
                {stat.value}
                <span className="stats-highlight__suffix">{stat.suffix}</span>
              </p>
              <p className="stats-highlight__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
