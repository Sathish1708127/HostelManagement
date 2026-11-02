import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const reportCards = [
  { title: 'Occupancy trends', desc: 'Monthly occupancy rates by block', icon: '📊', color: 'indigo' },
  { title: 'Complaint analytics', desc: 'Resolution times, categories, SLA', icon: '🔧', color: 'amber' },
  { title: 'Fee collection', desc: 'Collection rates, outstanding, trends', icon: '💰', color: 'teal' },
  { title: 'Attendance', desc: 'Roll call compliance, trends', icon: '📋', color: 'violet' },
  { title: 'Mess satisfaction', desc: 'Meal ratings, feedback trends', icon: '🍽️', color: 'amber' },
  { title: 'Leave patterns', desc: 'Peak leave days, approvals', icon: '✈️', color: 'indigo' },
  { title: 'Laundry operations', desc: 'Batch volumes, turnaround time', icon: '👕', color: 'teal' },
  { title: 'Medical cases', desc: 'Common illnesses, wellness trends', icon: '🏥', color: 'violet' },
  { title: 'Hostel Pulse', desc: 'Overall health score breakdown', icon: '❤️', color: 'danger' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Reports' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Reports and analytics</h1>
          <p>View aggregate data across all hostel modules with exportable reports.</p>
        </div>
        <button className="primary-button">Export all</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Reports available</span><strong>9</strong><small>All modules</small></article>
        <article className="mini-metric"><span>Last generated</span><strong>Today</strong><small>Auto-refresh daily</small></article>
        <article className="mini-metric"><span>Export format</span><strong>PDF/CSV</strong><small>All reports</small></article>
      </section>
      <section className="dashboard-grid" style={{ marginTop: 0 }}>
        {reportCards.map((r) => (
          <article
            key={r.title}
            className={'panel metric-card ' + r.color}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedReport(r.title)}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{r.icon}</div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: 4 }}>{r.title}</strong>
            <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>{r.desc}</p>
          </article>
        ))}
      </section>
      {selectedReport && (
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <h2>{selectedReport}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="quiet-button">PDF</button>
              <button className="quiet-button">CSV</button>
              <button className="quiet-button" onClick={() => setSelectedReport(null)}>Close</button>
            </div>
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <p>Report data will be fetched from the backend.</p>
            <p className="muted">Select date range and filters to generate the report.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <input type="date" className="styled-input" style={{ width: 160 }} />
              <input type="date" className="styled-input" style={{ width: 160 }} />
              <button className="primary-button">Generate</button>
            </div>
          </div>
          </div>
        </div>
      )}
    </main>
  );
}
