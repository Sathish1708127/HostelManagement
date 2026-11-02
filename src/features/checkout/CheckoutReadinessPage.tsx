import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';

type CheckoutItem = {
  id: string;
  student: string;
  room: string;
  category: string;
  item: string;
  status: 'pending' | 'cleared' | 'waived' | 'chargeable';
};

const mockItems: CheckoutItem[] = [
  { id: 'CO-001', student: 'Maya Gurung', room: 'B-204', category: 'Room inspection', item: 'Damage check pending', status: 'pending' },
  { id: 'CO-002', student: 'Maya Gurung', room: 'B-204', category: 'Fee clearance', item: 'Outstanding Rs 2,400', status: 'chargeable' },
];

export default function CheckoutReadinessPage() {
  const [items] = useState(mockItems);
  const pending = items.filter(i => i.status === 'pending').length;
  const chargeable = items.filter(i => i.status === 'chargeable').length;
  const cleared = items.filter(i => i.status === 'cleared' || i.status === 'waived').length;

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Checkout' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Departure readiness</p>
          <h1>Checkout readiness</h1>
          <p>Track pending items before a resident can be cleared for checkout.</p>
        </div>
        <button className="primary-button">Clear student</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Pending items</span><strong>{pending}</strong><small>Needs resolution</small></article>
        <article className="mini-metric"><span>Chargeable</span><strong>{chargeable}</strong><small>Fees to collect</small></article>
        <article className="mini-metric"><span>Cleared</span><strong>{cleared}</strong><small>Completed</small></article>
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Checklist by student</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Student</span><span>Room</span><span>Category</span><span>Item</span><span>Status</span><span />
          </div>
          {items.map((ci) => (
            <div className="data-row" role="row" key={ci.id}>
              <span>{ci.student}</span><strong>{ci.room}</strong><span>{ci.category}</span>
              <span>{ci.item}</span>
              <StatusBadge>{ci.status}</StatusBadge>
              <button className="row-action">Resolve</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
