import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type LaundryBatch = {
  id: string;
  tagNumber: string;
  student: string;
  itemCount: number;
  status: 'submitted' | 'collected' | 'washing' | 'ready' | 'returned' | 'disputed';
  submittedAt: string;
};

const mockBatches: LaundryBatch[] = [
  { id: 'LA-001', tagNumber: 'T-2041', student: 'Maya Gurung', itemCount: 5, status: 'ready', submittedAt: '12 Jun' },
  { id: 'LA-002', tagNumber: 'T-2042', student: 'Arjun Rao', itemCount: 3, status: 'washing', submittedAt: '13 Jun' },
  { id: 'LA-003', tagNumber: 'T-2043', student: 'Zoya Khan', itemCount: 7, status: 'submitted', submittedAt: '14 Jun' },
  { id: 'LA-004', tagNumber: 'T-2044', student: 'Nima Sherpa', itemCount: 4, status: 'returned', submittedAt: '10 Jun' },
];

export default function LaundryPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [batches, setBatches] = usePersistentState('laundry-batches', mockBatches);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: user?.name ?? '', itemCount: '1' });
  const [message, setMessage] = useState('');
  function createBatch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const itemCount = Number(form.itemCount); if ((!isStudent && !form.student.trim()) || !Number.isInteger(itemCount) || itemCount < 1 || !user) return; setBatches((items) => { const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('LA-', '')) || 0)); return [{ id: `LA-${String(lastId + 1).padStart(3, '0')}`, tagNumber: `T-${2040 + lastId + 1}`, student: isStudent ? user.name : form.student, itemCount, status: 'submitted', submittedAt: 'Today' }, ...items]; }); setMessage(isStudent ? 'Laundry pickup request created.' : 'Laundry batch created and ready for collection.'); setForm({ student: user?.name ?? '', itemCount: '1' }); setShowForm(false); }
  function advanceBatch(id: string, nextStatus: LaundryBatch['status']) {
    setBatches((items) => items.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
    setMessage(`Laundry batch ${id} marked ${nextStatus.replace('_', ' ')}.`);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Laundry' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Laundry operations</p>
          <h1>Laundry & dry cleaning</h1>
          <p>{isStudent ? 'Request a pickup and track your laundry status.' : 'Track laundry batches, handovers, and service quality.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>{isStudent ? 'Request pickup' : 'New laundry batch'}</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>{isStudent ? 'Laundry pickup request' : 'New laundry batch'}</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={createBatch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><input className="styled-input" required placeholder="Student name or ID" value={form.student} disabled={isStudent} onChange={(event) => setForm({ ...form, student: event.target.value })} /><input className="styled-input" required type="number" min="1" aria-label="Number of items" value={form.itemCount} onChange={(event) => setForm({ ...form, itemCount: event.target.value })} /><button className="primary-button" type="submit">{isStudent ? 'Request pickup' : 'Create batch'}</button></form></section>}

      <section className="metric-grid compact">
        <article className="mini-metric"><span>{isStudent ? 'My in progress' : 'In progress'}</span><strong>{batches.filter((batch) => (!isStudent || batch.student === user?.name) && ['submitted', 'collected', 'washing'].includes(batch.status)).length}</strong><small>Washing or collected</small></article>
        <article className="mini-metric"><span>Ready for pickup</span><strong>{batches.filter((batch) => (!isStudent || batch.student === user?.name) && batch.status === 'ready').length}</strong><small>Awaiting collection</small></article>
        {!isStudent && <article className="mini-metric"><span>Overdue</span><strong>1</strong><small>Past expected return</small></article>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Laundry batches</h2><button className="quiet-button">QR tag lookup</button></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Batch</span><span>Tag</span><span>Student</span><span>Items</span><span>Status</span><span>Submitted</span><span />
          </div>
          {batches.filter((batch) => !isStudent || batch.student === user?.name).map((b) => (
            <div className="data-row" role="row" key={b.id}>
              <strong>{b.id}</strong><span>{b.tagNumber}</span>
              <span>{b.student}</span><span>{b.itemCount}</span>
              <StatusBadge>{b.status}</StatusBadge><span>{b.submittedAt}</span>
              {isStudent && b.status === 'ready' ? (
                <button className="row-action" onClick={() => advanceBatch(b.id, 'returned')}>Confirm pickup</button>
              ) : !isStudent && ['submitted', 'collected', 'washing', 'ready'].includes(b.status) ? (
                <button
                  className="row-action"
                  onClick={() => advanceBatch(b.id, ({ submitted: 'collected', collected: 'washing', washing: 'ready', ready: 'returned' } as const)[b.status as 'submitted' | 'collected' | 'washing' | 'ready'])}
                >
                  {b.status === 'submitted' ? 'Collect' : b.status === 'collected' ? 'Start wash' : b.status === 'washing' ? 'Mark ready' : 'Return'}
                </button>
              ) : <span className="muted">{b.status === 'returned' ? 'Completed' : 'No action'}</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
