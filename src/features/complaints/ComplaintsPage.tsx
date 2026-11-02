import { type FormEvent, useMemo, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Complaint = {
  id: string;
  title: string;
  category: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  status: 'submitted' | 'acknowledged' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  student: string;
  createdAt: string;
  sla: string;
};

const mockComplaints: Complaint[] = [
  { id: 'SR-1042', title: 'Water pressure is low', category: 'Plumbing', location: 'Block B, Floor 2', priority: 'high', status: 'assigned', student: 'Maya Gurung', createdAt: '12 Jun', sla: '14 Jun' },
  { id: 'SR-1038', title: 'Study room light replacement', category: 'Electrical', location: 'Library wing', priority: 'medium', status: 'in_progress', student: 'Arjun Rao', createdAt: '11 Jun', sla: '16 Jun' },
  { id: 'SR-1031', title: 'Wi-Fi unstable after 9 PM', category: 'Internet', location: 'Block C', priority: 'medium', status: 'acknowledged', student: 'Zoya Khan', createdAt: '10 Jun', sla: '15 Jun' },
  { id: 'SR-1025', title: 'Noise complaint', category: 'Noise', location: 'B-205', priority: 'low', status: 'resolved', student: 'Nima Sherpa', createdAt: '09 Jun', sla: '14 Jun' },
];

export default function ComplaintsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [complaints, setComplaints] = usePersistentState('complaints', mockComplaints);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Maintenance', location: '', priority: 'medium' as Complaint['priority'] });
  const [message, setMessage] = useState('');

  const visibleComplaints = useMemo(() => isStudent ? complaints.filter((item) => item.student === user?.name) : complaints, [complaints, isStudent, user?.name]);
  const filtered = visibleComplaints.filter((complaint) =>
    (filter === 'all' || complaint.status === filter) &&
    (categoryFilter === 'all' || complaint.category === categoryFilter),
  );
  const openCount = visibleComplaints.filter((item) => !['resolved', 'closed'].includes(item.status)).length;
  const overdueCount = isStudent ? 0 : visibleComplaints.filter((item) => item.status === 'submitted').length;
  function submitComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !user) return;
    setComplaints((items) => {
      const lastId = Math.max(1042, ...items.map((item) => Number(item.id.replace('SR-', '')) || 0));
      return [{ id: `SR-${lastId + 1}`, ...form, status: 'submitted', student: user.name, createdAt: 'Today', sla: 'Pending triage' }, ...items];
    });
    setMessage('Your request has been submitted to the service desk.');
    setForm({ title: '', category: 'Maintenance', location: '', priority: 'medium' });
    setShowForm(false);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Complaints' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Service desk</p>
          <h1>Complaints & maintenance</h1>
          <p>{isStudent ? 'Submit and track your own service requests.' : 'Track, assign, and resolve maintenance requests and complaints.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>{isStudent ? 'Submit request' : 'Submit complaint'}</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>New service request</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={submitComplaint} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}><input className="styled-input" required placeholder="Describe the issue" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><select className="styled-input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Maintenance</option><option>Plumbing</option><option>Electrical</option><option>Internet</option><option>Cleaning</option><option>Noise</option></select><input className="styled-input" required placeholder="Room or location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /><select className="styled-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Complaint['priority'] })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><button className="primary-button" type="submit">Submit request</button></form></section>}

      <section className="metric-grid compact">
        <article className="mini-metric"><span>{isStudent ? 'My open requests' : 'Open'}</span><strong>{openCount}</strong><small>Awaiting resolution</small></article>
        {!isStudent && <><article className="mini-metric"><span>SLA breaching</span><strong>{overdueCount}</strong><small>Awaiting triage</small></article>
        <article className="mini-metric"><span>Avg resolution</span><strong>2.4 days</strong><small>This month</small></article></>}
      </section>

      <section className="panel">
        <div className="table-tools">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status">
            <option value="all">All status</option>
            <option value="submitted">Submitted</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select aria-label="Filter category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            <option>Maintenance</option><option>Electrical</option><option>Plumbing</option><option>Internet</option>
            <option>Noise</option><option>Cleaning</option><option>Other</option>
          </select>
          {isStudent && <span className="muted">Only your requests are shown.</span>}
        </div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>ID</span><span>Issue</span><span>Category</span><span>Location</span><span>Priority</span><span>Status</span><span>SLA</span><span />
          </div>
          {filtered.map((c) => (
            <div className="data-row" role="row" key={c.id}>
              <span className="request-id">{c.id}</span>
              <p><strong>{c.title}</strong><small>{c.student}</small></p>
              <span>{c.category}</span><span>{c.location}</span>
              <span className={`priority ${c.priority}`}>{c.priority}</span>
              <StatusBadge>{c.status.replace('_', ' ')}</StatusBadge>
              <span>{c.sla}</span>
              <button className="row-action">Open</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
