type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: 'indigo' | 'teal' | 'amber' | 'violet';
};

export default function MetricCard({ label, value, detail, tone }: MetricCardProps) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
