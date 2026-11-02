import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type MedicalReport = {
  id: string;
  student: string;
  type: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'in_review' | 'actioned' | 'resolved' | 'follow_up';
  createdAt: string;
};

const mockReports: MedicalReport[] = [
  { id: 'MD-001', student: 'Maya Gurung', type: 'Fever', description: 'High fever since last night, 102°F', urgency: 'high', status: 'actioned', createdAt: '14 Jun' },
  { id: 'MD-002', student: 'Arjun Rao', type: 'Injury', description: 'Sprained ankle during sports', urgency: 'medium', status: 'in_review', createdAt: '14 Jun' },
  { id: 'MD-003', student: 'Zoya Khan', type: 'Allergy', description: 'Skin rash after meal', urgency: 'low', status: 'resolved', createdAt: '12 Jun' },
  { id: 'MD-004', student: 'Nima Sherpa', type: 'Wellness', description: 'Anxiety and stress counseling needed', urgency: 'medium', status: 'follow_up', createdAt: '10 Jun' },
];

export default function MedicalPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [reports, setReports] = usePersistentState('medical-reports', mockReports);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: user?.name ?? '', type: 'Wellness', description: '', urgency: 'medium' as MedicalReport['urgency'] });
  const [message, setMessage] = useState('');
  const visibleReports = reports.filter((report) => !isStudent || report.student === user?.name);
  function reportIssue(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!form.description.trim() || (!isStudent && !form.student.trim()) || !user) return; setReports((items) => { const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('MD-', '')) || 0)); return [{ id: `MD-${String(lastId + 1).padStart(3, '0')}`, ...form, student: isStudent ? user.name : form.student, status: 'submitted', createdAt: 'Today' }, ...items]; }); setMessage(form.urgency === 'emergency' ? 'Emergency health issue logged. Contact emergency services if immediate help is needed.' : 'Health issue reported to the medical centre.'); setForm({ student: user?.name ?? '', type: 'Wellness', description: '', urgency: 'medium' }); setShowForm(false); }
  function updateReportStatus(id: string, status: MedicalReport['status']) {
    setReports((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setMessage(`Health report ${id} marked ${status.replace('_', ' ')}.`);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Medical' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Health & wellness</p>
          <h1>Medical centre</h1>
          <p>{isStudent ? 'Submit a confidential health report and follow its status.' : 'Review health reports and manage medical records.'}</p>
        </div>
        <div className="heading-actions">
          {isStudent && <button className="quiet-button" onClick={() => setMessage('Wellness check-in recorded for today.')}>Wellness check-in</button>}
          <button className="primary-button" onClick={() => setShowForm(true)}>Report health issue</button>
        </div>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>Report health issue</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={reportIssue} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>{!isStudent && <input className="styled-input" required placeholder="Student name or ID" value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} />}<input className="styled-input" required placeholder="Issue type (e.g. fever)" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /><select className="styled-input" value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value as MedicalReport['urgency'] })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="emergency">Emergency</option></select><textarea className="styled-input" required placeholder="Describe symptoms or support needed" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><button className="primary-button" type="submit">Submit report</button></form></section>}

      <section className="metric-grid compact">
        <article className="mini-metric"><span>{isStudent ? 'My open reports' : 'Open cases'}</span><strong>{visibleReports.filter((report) => !['resolved'].includes(report.status)).length}</strong><small>{isStudent ? 'Under review' : 'Needs attention'}</small></article>
        {!isStudent && <><article className="mini-metric"><span>Resolved this week</span><strong>{visibleReports.filter((report) => report.status === 'resolved').length}</strong><small>Recovered</small></article>
        <article className="mini-metric"><span>Wellness check-ins</span><strong>24</strong><small>This month</small></article></>}
      </section>

      <section className="dashboard-grid" style={{ marginTop: 0 }}>
        <article className="panel">
          <div className="panel-heading"><h2>Medical records</h2></div>
          <div className="data-table" role="table">
            <div className="data-row data-header" role="row">
              <span>ID</span>{!isStudent && <span>Student</span>}<span>Type</span><span>Description</span><span>Urgency</span><span>Status</span><span>Date</span><span />
            </div>
            {visibleReports.map((r) => (
              <div className="data-row" role="row" key={r.id}>
                <strong>{r.id}</strong>{!isStudent && <span>{r.student}</span>}<span>{r.type}</span>
                <span>{r.description}</span>
                <span className={`priority ${r.urgency}`}>{r.urgency}</span>
                <span>{r.status.replace('_', ' ')}</span>
                <span>{r.createdAt}</span>
                {isStudent && r.status === 'resolved' ? (
                  <button className="row-action" onClick={() => updateReportStatus(r.id, 'follow_up')}>Request follow-up</button>
                ) : !isStudent && r.status !== 'resolved' ? (
                  <button
                    className="row-action"
                    onClick={() => updateReportStatus(r.id, r.status === 'submitted' ? 'in_review' : r.status === 'in_review' ? 'actioned' : r.status === 'follow_up' ? 'actioned' : 'resolved')}
                  >
                    {r.status === 'submitted' ? 'Review' : r.status === 'in_review' ? 'Record action' : r.status === 'follow_up' ? 'Continue follow-up' : 'Resolve'}
                  </button>
                ) : <span className="muted">{r.status === 'follow_up' ? 'Follow-up requested' : isStudent ? 'Confidential' : 'Resolved'}</span>}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
