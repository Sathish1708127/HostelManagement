import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state-full">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

