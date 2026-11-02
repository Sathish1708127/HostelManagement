import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';

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
  const parcels = mockParcels.filter((parcel) => !isStudent || parcel.student === user?.name);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Parcels' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Mail room</p>
          <h1>Parcels & courier</h1>
          <p>{isStudent ? 'Track parcels received for you and their pickup status.' : 'Manage incoming parcels, OTP-based pickup, and unclaimed items.'}</p>
        </div>
        {!isStudent && <button className="primary-button">Register parcel</button>}
      </section>

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
              <span>{isStudent ? (p.status === 'pickup_otp' ? 'Contact the mail desk' : '--') : p.otp}</span>
              {!isStudent && <button className="row-action">Confirm pickup</button>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
