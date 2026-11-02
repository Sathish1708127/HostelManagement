type SkeletonProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
};

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="data-loading" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="skeleton-row">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="skeleton-cell"
              style={{ width: `${30 + c * 15}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="18px" width="60%" />
      <Skeleton height="32px" width="40%" />
      <Skeleton height="14px" width="80%" />
    </div>
  );
}

