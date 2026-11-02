import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Parcel = {
  id: string;
  student: string;
  courier: string;
  trackingNumber: string;
  receivedAt: string;
  status: 'received' | 'pickup_otp' | 'collected' | 'unclaimed';
  otp: string;
};

const mockParcels: Parcel[] = [
  { id: 'PC-001', student: 'Maya Gurung', courier: 'Delhivery', trackingNumber: 'DL-2048-IND', receivedAt: '14 Jun', status: 'collected', otp: '--' },
  { id: 'PC-002', student: 'Arjun Rao', courier: 'Amazon', trackingNumber: 'AMZ-9912', receivedAt: '14 Jun', status: 'pickup_otp', otp: '4821' },
  { id: 'PC-003', student: 'Zoya Khan', courier: 'Blue Dart', trackingNumber: 'BD-7763', receivedAt: '13 Jun', status: 'received', otp: '--' },
  { id: 'PC-004', student: 'Nima Sherpa', courier: 'DTDC', trackingNumber: 'DT-5542', receivedAt: '10 Jun', status: 'unclaimed', otp: '--' },
];

export default function ParcelsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [allParcels, setParcels] = usePersistentState('parcels', mockParcels);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: '', courier: '', trackingNumber: '' });
  const [pickupInputs, setPickupInputs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const parcels = allParcels.filter((parcel) => !isStudent || parcel.student === user?.name);

  function registerParcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.student.trim() || !form.courier.trim() || !form.trackingNumber.trim()) return;
    setParcels((items) => {
      const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('PC-', '')) || 0));
      return [{
        id: `PC-${String(lastId + 1).padStart(3, '0')}`,
        ...form,
        receivedAt: new Date().toLocaleDateString(),
        status: 'received',
        otp: '--',
      }, ...items];
    });
    setMessage('Parcel registered. Issue a pickup code when it is ready for collection.');
    setForm({ student: '', courier: '', trackingNumber: '' });
    setShowForm(false);
  }

  function issuePickupCode(id: string) {
    const otp = String(crypto.getRandomValues(new Uint32Array(1))[0] % 10_000).padStart(4, '0');
    setParcels((items) => items.map((item) => item.id === id ? { ...item, status: 'pickup_otp', otp } : item));
    setMessage(`Pickup code issued for ${id}. Share it with the student.`);
  }

  function collectParcel(id: string, code: string) {
    const parcel = allParcels.find((item) => item.id === id);
    if (!parcel || parcel.status !== 'pickup_otp' || parcel.otp !== code.trim()) {
      setMessage('That pickup code is invalid. Check the code with the mail desk.');
      return;
    }
    setParcels((items) => items.map((item) => item.id === id ? { ...item, status: 'collected', otp: '--' } : item));
    setPickupInputs((inputs) => ({ ...inputs, [id]: '' }));
    setMessage(`Parcel ${id} marked as collected.`);
  }

  function confirmPickup(id: string) {
    setParcels((items) => items.map((item) => item.id === id ? { ...item, status: 'collected', otp: '--' } : item));
    setMessage(`Parcel ${id} marked as collected.`);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Parcels' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Mail room</p>
          <h1>Parcels & courier</h1>
          <p>{isStudent ? 'Track parcels received for you and their pickup status.' : 'Manage incoming parcels, OTP-based pickup, and unclaimed items.'}</p>
        </div>
        {!isStudent && <button className="primary-button" onClick={() => setShowForm(true)}>Register parcel</button>}
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <form className="panel" onSubmit={registerParcel} style={{ marginBottom: 16 }}>
        <div className="panel-heading"><h2>Register incoming parcel</h2><button className="quiet-button" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <input className="styled-input" required placeholder="Student name" value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} />
          <input className="styled-input" required placeholder="Courier" value={form.courier} onChange={(event) => setForm({ ...form, courier: event.target.value })} />
          <input className="styled-input" required placeholder="Tracking number" value={form.trackingNumber} onChange={(event) => setForm({ ...form, trackingNumber: event.target.value })} />
          <button className="primary-button" type="submit">Save parcel</button>
        </div>
      </form>}

      <section className="metric-grid compact">
        {isStudent ? <><article className="mini-metric"><span>Awaiting pickup</span><strong>{parcels.filter((parcel) => ['received', 'pickup_otp', 'unclaimed'].includes(parcel.status)).length}</strong><small>Your parcels</small></article><article className="mini-metric"><span>Collected</span><strong>{parcels.filter((parcel) => parcel.status === 'collected').length}</strong><small>Your pickup history</small></article></> : <><article className="mini-metric"><span>Awaiting pickup</span><strong>{mockParcels.filter((parcel) => ['received', 'pickup_otp', 'unclaimed'].includes(parcel.status)).length}</strong><small>With OTP sent</small></article>
        <article className="mini-metric"><span>Collected today</span><strong>{mockParcels.filter((parcel) => parcel.status === 'collected').length}</strong><small>Cleared</small></article>
        <article className="mini-metric"><span>Unclaimed over 7 days</span><strong>{mockParcels.filter((parcel) => parcel.status === 'unclaimed').length}</strong><small>Alert sent</small></article></>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Parcel log</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>ID</span><span>Student</span><span>Courier</span><span>Tracking</span><span>Received</span><span>Status</span><span>OTP</span><span />
          </div>
          {parcels.map((p) => (
            <div className="data-row" role="row" key={p.id}>
              <strong>{p.id}</strong><span>{p.student}</span><span>{p.courier}</span>
              <span>{p.trackingNumber}</span><span>{p.receivedAt}</span>
              <StatusBadge>{p.status.replace('_', ' ')}</StatusBadge>
              <span>{isStudent ? '--' : p.otp}</span>
              {isStudent && p.status === 'pickup_otp' ? (
                <span className="heading-actions">
                  <input
                    className="styled-input"
                    aria-label={`Pickup code for ${p.id}`}
                    inputMode="numeric"
                    maxLength={4}
                    value={pickupInputs[p.id] ?? ''}
                    onChange={(event) => setPickupInputs((inputs) => ({ ...inputs, [p.id]: event.target.value.replace(/\D/g, '') }))}
                  />
                  <button className="row-action" disabled={(pickupInputs[p.id] ?? '').length !== 4} onClick={() => collectParcel(p.id, pickupInputs[p.id] ?? '')}>Verify</button>
                </span>
              ) : !isStudent && ['received', 'unclaimed'].includes(p.status) ? (
                <button className="row-action" onClick={() => issuePickupCode(p.id)}>Issue pickup code</button>
              ) : !isStudent && p.status === 'pickup_otp' ? (
                <button className="row-action" onClick={() => confirmPickup(p.id)}>Confirm pickup</button>
              ) : <span className="muted">{p.status === 'collected' ? 'Completed' : 'Waiting for mail desk'}</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
