import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Visitor = {
  id: string;
  name: string;
  contact: string;
  student: string;
  purpose: string;
  checkIn: string;
  status: 'checked_in' | 'checked_out' | 'pending';
};

const mockVisitors: Visitor[] = [
  { id: 'VS-001', name: 'Rajesh Gurung', contact: '9841xxxxxx', student: 'Maya Gurung', purpose: 'Family visit', checkIn: '10:30 AM', status: 'checked_in' },
  { id: 'VS-002', name: 'Anita Sharma', contact: '9852xxxxxx', student: 'Priya Sharma', purpose: 'Guardian meeting', checkIn: '02:15 PM', status: 'checked_out' },
  { id: 'VS-003', name: 'Suresh Rao', contact: '9863xxxxxx', student: 'Arjun Rao', purpose: 'Weekend outing', checkIn: '--', status: 'pending' },
];

export default function VisitorsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [visitors, setVisitors] = usePersistentState('visitors', mockVisitors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', student: '', purpose: '' });
  const [message, setMessage] = useState('');

  function preRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || (!isStudent && !form.student.trim()) || !user) return;
    setVisitors((items) => {
      const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('VS-', '')) || 0));
      return [{ id: `VS-${String(lastId + 1).padStart(3, '0')}`, ...form, student: isStudent ? user.name : form.student, checkIn: '--', status: 'pending' }, ...items];
    });
    setMessage('Visitor pre-registered. The guard can check them in when they arrive.');
    setForm({ name: '', contact: '', student: '', purpose: '' });
    setShowForm(false);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Visitors' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Gate management</p>
          <h1>Visitors & gate passes</h1>
          <p>{isStudent ? 'Request a visitor pass for your guests and track its status.' : 'Pre-register visitors, manage check-in/out, and monitor overstays.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>{isStudent ? 'Request visitor pass' : 'Pre-register visitor'}</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>Pre-register visitor</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={preRegister} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <input className="styled-input" required placeholder="Visitor full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input className="styled-input" required type="tel" placeholder="Phone number" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} />{!isStudent && <input className="styled-input" required placeholder="Resident name or ID" value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} />}<input className="styled-input" placeholder="Purpose of visit" value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} /><button className="primary-button" type="submit">{isStudent ? 'Submit visitor request' : 'Create visitor pass'}</button>
      </form></section>}

      <section className="metric-grid compact">
        {isStudent ? <><article className="mini-metric"><span>My visitor requests</span><strong>{visitors.filter((visitor) => visitor.student === user?.name).length}</strong><small>All statuses</small></article><article className="mini-metric"><span>Awaiting approval</span><strong>{visitors.filter((visitor) => visitor.student === user?.name && visitor.status === 'pending').length}</strong><small>Pending requests</small></article></> : <><article className="mini-metric"><span>Checked in</span><strong>{visitors.filter((visitor) => visitor.status === 'checked_in').length}</strong><small>Currently on campus</small></article>
        <article className="mini-metric"><span>Today&apos;s visitors</span><strong>{visitors.length}</strong><small>{visitors.filter((visitor) => visitor.status === 'pending').length} pending</small></article>
        <article className="mini-metric"><span>Overstay alerts</span><strong>0</strong><small>All clear</small></article></>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Visitor log</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Visitor</span><span>Contact</span><span>Student</span><span>Purpose</span><span>Check-in</span><span>Status</span><span />
          </div>
          {visitors.filter((visitor) => !isStudent || visitor.student === user?.name).map((v) => (
            <div className="data-row" role="row" key={v.id}>
              <div className="resident-cell"><p><strong>{v.name}</strong><small>{v.id}</small></p></div>
              <span>{v.contact}</span><span>{v.student}</span><span>{v.purpose}</span><span>{v.checkIn}</span>
              <StatusBadge>{v.status.replace('_', ' ')}</StatusBadge>
              {!isStudent && <button className="row-action" onClick={() => setVisitors((items) => items.map((item) => item.id === v.id && item.status === 'pending' ? { ...item, status: 'checked_in', checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : item))}>{v.status === 'pending' ? 'Check in' : 'View'}</button>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
