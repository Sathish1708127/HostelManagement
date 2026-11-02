import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type LeaveRequest = {
  id: string;
  student: string;
  type: string;
  destination: string;
  from: string;
  to: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedOn: string;
};

const mockLeaves: LeaveRequest[] = [
  { id: 'LV-021', student: 'Maya Gurung', type: 'Weekend', destination: 'Kathmandu', from: '20 Jun', to: '22 Jun', status: 'approved', appliedOn: '15 Jun' },
  { id: 'LV-020', student: 'Arjun Rao', type: 'Medical', destination: 'City Hospital', from: '18 Jun', to: '19 Jun', status: 'pending', appliedOn: '16 Jun' },
  { id: 'LV-019', student: 'Zoya Khan', type: 'Emergency', destination: 'Home', from: '14 Jun', to: '16 Jun', status: 'approved', appliedOn: '13 Jun' },
  { id: 'LV-018', student: 'Nima Sherpa', type: 'Vacation', destination: 'Pokhara', from: '25 Jun', to: '30 Jun', status: 'pending', appliedOn: '16 Jun' },
];

export default function LeavePage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [leaves, setLeaves] = usePersistentState('leave-requests', mockLeaves);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: user?.name ?? '', type: 'Weekend', destination: '', from: '', to: '' });
  const [message, setMessage] = useState('');

  function applyForLeave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.student || !form.destination.trim() || !form.from || !form.to || form.to < form.from || form.from < new Date().toISOString().slice(0, 10)) {
      setMessage('Choose a destination and valid future dates. The return date must be on or after departure.');
      return;
    }
    setLeaves((items) => {
      const lastId = Math.max(21, ...items.map((item) => Number(item.id.replace('LV-', '')) || 0));
      return [{ id: `LV-${String(lastId + 1).padStart(3, '0')}`, ...form, status: 'pending', appliedOn: 'Today' }, ...items];
    });
    setMessage('Leave application submitted for warden approval.');
    setForm({ student: user?.name ?? '', type: 'Weekend', destination: '', from: '', to: '' });
    setShowForm(false);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Leave' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Leave management</p>
          <h1>Leave & gate passes</h1>
          <p>{isStudent ? 'Apply for leave and track your approval or gate pass.' : 'Review leave requests, approvals, and gate passes.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>Apply for leave</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>New leave application</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={applyForLeave} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}><input required className="styled-input" placeholder="Student name or ID" value={form.student} disabled={isStudent} onChange={(event) => setForm({ ...form, student: event.target.value })} /><select className="styled-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Weekend</option><option>Medical</option><option>Emergency</option><option>Vacation</option></select><input required className="styled-input" placeholder="Destination" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} /><input required type="date" className="styled-input" value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })} /><input required type="date" className="styled-input" value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })} /><button className="primary-button" type="submit">Submit application</button></form></section>}

      <section className="metric-grid compact">
        {isStudent ? <><article className="mini-metric"><span>My pending requests</span><strong>{leaves.filter((leave) => leave.student === user?.name && leave.status === 'pending').length}</strong><small>Awaiting warden review</small></article>
        <article className="mini-metric"><span>My approved requests</span><strong>{leaves.filter((leave) => leave.student === user?.name && leave.status === 'approved').length}</strong><small>View your gate pass status</small></article></> : <><article className="mini-metric"><span>On leave today</span><strong>31</strong><small>18 return today</small></article>
        <article className="mini-metric"><span>Pending approval</span><strong>{leaves.filter((leave) => leave.status === 'pending').length}</strong><small>Needs review</small></article>
        <article className="mini-metric"><span>Late returns</span><strong>2</strong><small>Overdue check-in</small></article></>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Leave applications</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>ID</span><span>Student</span><span>Type</span><span>Destination</span><span>Dates</span><span>Status</span><span />
          </div>
          {leaves.filter((leave) => !isStudent || leave.student === user?.name).map((l) => (
            <div className="data-row" role="row" key={l.id}>
              <strong>{l.id}</strong><span>{l.student}</span><span>{l.type}</span>
              <span>{l.destination}</span><span>{l.from} – {l.to}</span>
              <StatusBadge>{l.status}</StatusBadge>
              <button className="row-action">View</button>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
