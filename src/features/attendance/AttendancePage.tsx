import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type AttendanceRecord = {
  id: string;
  name: string;
  room: string;
  time: string;
  status: 'present' | 'absent' | 'late' | 'leave';
};

const mockRecords: AttendanceRecord[] = [
  { id: 'ST-2401', name: 'Maya Gurung', room: 'B-204', time: '07:12 AM', status: 'present' },
  { id: 'ST-2398', name: 'Arjun Rao', room: 'A-112', time: '--', status: 'leave' },
  { id: 'ST-2384', name: 'Zoya Khan', room: 'C-305', time: '07:05 AM', status: 'present' },
  { id: 'ST-2371', name: 'Nima Sherpa', room: 'B-118', time: '07:30 AM', status: 'present' },
  { id: 'ST-2360', name: 'Rohan Mehta', room: 'A-204', time: '07:45 AM', status: 'late' },
  { id: 'ST-2355', name: 'Priya Sharma', room: 'C-102', time: '--', status: 'absent' },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [records, setRecords] = usePersistentState('attendance-records', mockRecords);
  const [sessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [rollCallActive, setRollCallActive] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const ownRecord = records.find((record) => record.name === user?.name);
  const visibleRecords = isStudent ? records.filter((record) => record.name === user?.name) : records;
  const [message, setMessage] = useState('');
  function generateQrToken() {
    const token = `HP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    localStorage.setItem('hostel-pulse:attendance-token', JSON.stringify({ token, expiresAt: Date.now() + 5 * 60 * 1000 }));
    setQrToken(token);
  }
  function checkIn() {
    const rawToken = localStorage.getItem('hostel-pulse:attendance-token');
    const activeToken = rawToken ? JSON.parse(rawToken) as { token: string; expiresAt: number } : null;
    if (!activeToken || activeToken.expiresAt <= Date.now() || activeToken.token !== scanCode.trim().toUpperCase()) {
      setMessage('That check-in token is invalid or expired. Ask the gate to display the current QR code.');
      return;
    }
    if (!ownRecord || ownRecord.status === 'leave') {
      setMessage('No eligible attendance record is available for your account.');
      return;
    }
    setRecords((items) => items.map((item) => item.id === ownRecord.id ? { ...item, status: 'present', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : item));
    localStorage.removeItem('hostel-pulse:attendance-token');
    setScanCode('');
    setMessage('You have been checked in successfully.');
  }

  const present = visibleRecords.filter((r) => r.status === 'present').length;
  const absent = visibleRecords.filter((r) => r.status === 'absent').length;
  const onLeave = visibleRecords.filter((r) => r.status === 'leave').length;
  const late = visibleRecords.filter((r) => r.status === 'late').length;

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Attendance' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Daily roll call</p>
          <h1>Attendance & roll call</h1>
          <p>{isStudent ? `View and check in for your attendance on ${sessionDate}.` : `Night roll call and daily attendance for ${sessionDate}.`}</p>
        </div>
        {!isStudent && <div className="heading-actions">
          <button className="quiet-button" onClick={generateQrToken}>Generate QR</button>
          <button className="primary-button" onClick={() => setRollCallActive((active) => !active)}>{rollCallActive ? 'Finish roll call' : 'Start roll call'}</button>
        </div>}
      </section>
      {message && <p className="muted" role="status">{message}</p>}

      <section className="metric-grid compact">
        <article className="mini-metric">
          <span>Present</span><strong>{present}</strong><small>Checked in</small>
        </article>
        <article className="mini-metric">
          <span>Late</span><strong>{late}</strong><small>After cutoff</small>
        </article>
        <article className="mini-metric">
          <span>On leave</span><strong>{onLeave}</strong><small>Approved</small>
        </article>
        <article className="mini-metric">
          <span>Absent</span><strong>{absent}</strong><small>Unaccounted</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>{isStudent ? 'My attendance' : 'Today\'s attendance'}</h2>
          {!isStudent && <button className="quiet-button">Export</button>}
        </div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Student</span><span>Room</span><span>Time</span><span>Status</span><span />
          </div>
          {visibleRecords.map((r) => (
            <div className="data-row" role="row" key={r.id}>
              <div className="resident-cell">
                <span className="avatar">{r.name.split(' ').map(n => n[0]).join('')}</span>
                <p><strong>{r.name}</strong><small>{r.id}</small></p>
              </div>
              <strong>{r.room}</strong>
              <span>{r.time}</span>
              <StatusBadge>{r.status}</StatusBadge>
              {!isStudent && <button className="row-action" disabled={!rollCallActive || r.status === 'leave'} onClick={() => setRecords((items) => items.map((item) => item.id === r.id ? { ...item, status: 'present', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : item))}>Mark present</button>}
            </div>
          ))}
        </div>
      </section>

      {isStudent ? <section className="panel" style={{ marginTop: 16 }}><div className="panel-heading"><h2>QR check-in</h2></div><p className="muted">Enter the active gate token. Tokens expire after five minutes and can be used once.</p><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><input className="styled-input" placeholder="Enter QR token" value={scanCode} onChange={(event) => setScanCode(event.target.value)} /><button className="primary-button" onClick={checkIn} disabled={!scanCode.trim() || !ownRecord || ownRecord.status === 'leave'}>Check in</button></div></section> : <section className="dashboard-grid" style={{ marginTop: 16 }}>
        <article className="panel">
          <div className="panel-heading"><h2>QR check-in</h2></div>
          <p className="muted">Students scan the rotating QR code at the gate to self-check-in.</p>
          <div className="qr-placeholder">
            <div className="qr-code-mock">
              <div className="qr-grid">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className={`qr-row-${i % 3 === 0 ? 'solid' : 'dashed'}`} />
                ))}
              </div>
            </div>
            <p className="muted">{qrToken ? `Active token: ${qrToken}` : 'Generate a time-limited QR token before opening check-in.'}</p>
            <button className="primary-button" onClick={generateQrToken}>Regenerate QR</button>
          </div>
        </article>
        <article className="panel">
          <div className="panel-heading"><h2>Emergency roll call</h2></div>
          <p className="muted">Activate in case of emergency to account for all residents.</p>
          <div className="emergency-stats">
            <div><strong>486</strong><span>Total residents</span></div>
            <div><strong>442</strong><span>Checked in</span></div>
            <div><strong>31</strong><span>On approved leave</span></div>
            <div className="danger"><strong>13</strong><span>Unknown</span></div>
          </div>
          <button className="primary-button" onClick={() => setEmergencyActive((active) => !active)} style={{ background: 'var(--danger)', width: '100%', marginTop: 16 }}>
            {emergencyActive ? 'Emergency roll call active' : 'Activate emergency roll call'}
          </button>
        </article>
      </section>}
    </main>
  );
}
