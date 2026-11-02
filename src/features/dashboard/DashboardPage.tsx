import { useNavigate } from 'react-router-dom';
import MetricCard from '../../components/ui/MetricCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';

const staffMetrics = [
  { label: 'Residents', value: '486', detail: '18 joined this month', tone: 'indigo' as const },
  { label: 'Beds occupied', value: '91%', detail: '42 beds available', tone: 'teal' as const },
  { label: 'Open requests', value: '27', detail: '4 nearing SLA', tone: 'amber' as const },
  { label: 'Hostel Pulse', value: '84', detail: 'Healthy operations', tone: 'violet' as const },
];

const requests: [string, string, string, string, string][] = [
  ['SR-1042', 'Water pressure is low', 'Block B, floor 2', 'Assigned', 'High'],
  ['SR-1038', 'Study room light replacement', 'Library wing', 'In progress', 'Medium'],
  ['SR-1031', 'Wi-Fi unstable after 9 PM', 'Block C', 'Investigating', 'Medium'],
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';
  const metrics = staffMetrics;
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">{isStudent ? 'Resident overview' : today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1>{greeting}, {user?.name.split(' ')[0]}.</h1>
          <p>{isStudent ? 'Here is what matters for your hostel day.' : 'Here is the state of Haven North right now.'}</p>
        </div>
        <button className="primary-button" onClick={() => navigate(isStudent ? '/complaints' : '/residents')}>
          {isStudent ? 'New request' : 'Add resident'}
        </button>
      </section>

      {!isStudent && <section className="metric-grid" aria-label="Hostel summary">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>}

      {isStudent ? <section className="dashboard-grid" aria-label="Student services">
        <article className="panel student-hostel-card">
          <div className="student-hostel-copy">
            <p className="eyebrow">Your place, connected</p>
            <h2>Make the most of hostel life.</h2>
            <p className="muted">Keep your plans, campus moments, and everyday services together.</p>
            <div className="student-hostel-actions">
              <button className="primary-button" onClick={() => navigate('/calendar')}>Open calendar</button>
              <button className="quiet-button" onClick={() => navigate('/gallery')}>Visit gallery</button>
            </div>
          </div>
          <div className="hostel-illustration" aria-hidden="true">
            <div className="hostel-building hostel-building-back"><i /><i /><i /><i /></div>
            <div className="hostel-building hostel-building-front"><i /><i /><i /><i /><i /><i /></div>
            <span className="hostel-tree hostel-tree-one" />
            <span className="hostel-tree hostel-tree-two" />
          </div>
        </article>
        {[
          ['/rooms', 'My room', 'View your room and bed allocation.'],
          ['/complaints', 'Service requests', 'Report an issue and track its progress.'],
          ['/leave', 'Leave and gate pass', 'Apply for leave and check approval status.'],
          ['/mess', 'Meals', 'Check the menu and update tomorrow’s attendance.'],
          ['/laundry', 'Laundry', 'Request pickup and follow your batch.'],
          ['/announcements', 'Announcements', 'Read the latest hostel notices.'],
          ['/visitors', 'Visitor requests', 'Register a visitor and follow approval.'],
          ['/fees', 'Fees and receipts', 'Review your fee account and due dates.'],
        ].map(([path, title, description]) => <article className="panel" key={path}>
          <div className="panel-heading"><h2>{title}</h2></div>
          <p className="muted">{description}</p>
          <button className="quiet-button" onClick={() => navigate(path)}>Open {title.toLowerCase()}</button>
        </article>)}
      </section> : <section className="dashboard-grid">
        <article className="panel pulse-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Explainable health</p>
              <h2>Hostel Pulse</h2>
            </div>
            <strong>84</strong>
          </div>
          <div className="pulse-bar"><span style={{ width: '84%' }} /></div>
          <div className="factor-list">
            <div>
              <span className="factor good" />
              <p><strong>Occupancy balance</strong><small>42 beds remain available</small></p>
              <b>+22</b>
            </div>
            <div>
              <span className="factor good" />
              <p><strong>Service resolution</strong><small>92% within agreed SLA</small></p>
              <b>+31</b>
            </div>
            <div>
              <span className="factor warning" />
              <p><strong>Mess satisfaction</strong><small>Dinner rating fell to 3.7</small></p>
              <b>+18</b>
            </div>
            <div>
              <span className="factor neutral" />
              <p><strong>Safety exceptions</strong><small>13 movements need review</small></p>
              <b>+13</b>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Occupancy by block</h2>
            </div>
            <button className="quiet-button" onClick={() => navigate('/rooms')}>View rooms</button>
          </div>
          <div className="occupancy-list">
            {[['Block A', 96, '144 / 150'], ['Block B', 88, '132 / 150'], ['Block C', 91, '137 / 150'], ['Guest wing', 73, '73 / 100']].map(([name, amount, label]) => (
              <div key={name}>
                <p><strong>{name}</strong><span>{label}</span></p>
                <div><span style={{ width: `${amount}%` }} /></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Service desk</p>
              <h2>Requests needing attention</h2>
            </div>
            <button className="quiet-button" onClick={() => navigate('/complaints')}>Open queue</button>
          </div>
          <div className="request-table">
            {requests.map(([id, title, place, status, priority]) => (
              <div className="request-row" key={id}>
                <span className="request-id">{id}</span>
                <p><strong>{title}</strong><small>{place}</small></p>
                <StatusBadge>{status}</StatusBadge>
                <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>
                <button aria-label={`Open ${id}`}>Open</button>
              </div>
            ))}
          </div>
        </article>
      </section>}
    </main>
  );
}
