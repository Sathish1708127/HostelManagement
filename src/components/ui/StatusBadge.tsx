export default function StatusBadge({ children }: { children: string }) {
  const tone = children.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
