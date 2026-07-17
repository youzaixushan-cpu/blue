import "./summary-stats.scss";

export function SummaryStats({
  squadCount,
  favoriteFormation,
  favoritePlayerName,
}: {
  squadCount: number;
  favoriteFormation: string;
  favoritePlayerName: string;
}) {
  const stats = [
    { label: "選出済み選手", value: `${squadCount}人` },
    { label: "好きなフォーメーション", value: favoriteFormation },
    { label: "推し選手", value: favoritePlayerName },
    { label: "閲覧した選手ページ", value: "48回" },
  ];

  return (
    <div className="summary-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="summary-stats__tile">
          <p className="summary-stats__value">{stat.value}</p>
          <p className="summary-stats__label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
