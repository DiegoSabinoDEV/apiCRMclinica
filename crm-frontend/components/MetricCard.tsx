export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="card metric">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <span>{hint}</span>
    </div>
  );
}
