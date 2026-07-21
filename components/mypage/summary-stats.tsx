import "./summary-stats.scss";

export function SummaryStats({
  squadCount,
  assignedCount,
  formationName,
  targetLabel,
}: {
  squadCount: number;
  assignedCount: number;
  formationName: string;
  targetLabel: string;
}) {
  const stats = [
    { label: "選出済み選手", value: `${squadCount}人` },
    { label: "フォーメーション配置済み", value: `${assignedCount}人` },
    { label: "現在のフォーメーション", value: formationName },
  ];

  return (
    <div className="summary-stats">
      <p className="summary-stats__target">対象: {targetLabel}の「あなたの26人」</p>
      <div className="summary-stats__tiles">
        {stats.map((stat) => (
          <div key={stat.label} className="summary-stats__tile">
            <p className="summary-stats__value">{stat.value}</p>
            <p className="summary-stats__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
