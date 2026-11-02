import { FormEvent, useEffect, useMemo, useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { apiClient, type ApiEnvelope } from '../../lib/apiClient';

type Resident = { uuid: string; university_id: string; legal_name: string; nationality: string; course: string; semester: string; status: string; room_number: string | null };
const initialForm = { legal_name: '', university_id: '', nationality: 'Nepali', course: '', semester: '', email: '', phone: '' };

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [query, setQuery] = useState('');
  const [nationality, setNationality] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const loadResidents = async () => {
    try {
      const response = await apiClient.get<ApiEnvelope<Resident[]>>('/residents');
      setResidents(response.data);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load residents.'); }
  };
  useEffect(() => { void loadResidents(); }, []);
  const filtered = useMemo(() => residents.filter((resident) =>
    (nationality === 'All' || resident.nationality === nationality) &&
    `${resident.legal_name} ${resident.university_id} ${resident.room_number ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  ), [nationality, query, residents]);

  async function addResident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiClient.post('/residents', { ...form, hostel_uuid: 'demo-hostel', admission_date: new Date().toISOString().slice(0, 10) });
      setForm(initialForm); setShowForm(false); setMessage('Resident added. Assign a bed from Rooms and beds.'); await loadResidents();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to add resident.'); }
  }

  return <main className="page-content">
    <section className="page-heading"><div><p className="eyebrow">Resident directory</p><h1>People and hostel journeys</h1><p>Add residents, confirm onboarding details, and allocate beds.</p></div><button className="primary-button" onClick={() => setShowForm(true)}>Add resident</button></section>
    {message && <p className="muted" role="status">{message}</p>}
    <section className="metric-grid compact"><Metric label="Residents" value={String(residents.length)} detail="Loaded from the resident API" /><Metric label="Needs bed" value={String(residents.filter((item) => !item.room_number).length)} detail="Ready for allocation" /><Metric label="Assigned" value={String(residents.filter((item) => item.room_number).length)} detail="Currently allocated" /></section>
    {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>Add resident</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={addResident} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
      {(['legal_name', 'university_id', 'email', 'phone', 'course', 'semester'] as const).map((field) => <input key={field} required={field === 'legal_name' || field === 'university_id'} className="styled-input" placeholder={field.replace('_', ' ')} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
      <select className="styled-input" aria-label="Nationality" value={form.nationality} onChange={(event) => setForm({ ...form, nationality: event.target.value })}><option>Nepali</option><option>Indian</option><option>Other</option></select><button className="primary-button" type="submit">Save resident</button>
    </form></section>}
    <section className="panel directory-panel"><div className="table-tools"><input placeholder="Search name, ID or room" value={query} onChange={(event) => setQuery(event.target.value)} /><select value={nationality} onChange={(event) => setNationality(event.target.value)} aria-label="Filter nationality"><option>All</option><option>Nepali</option><option>Indian</option><option>Other</option></select></div><div className="data-table" role="table"><div className="data-row data-header" role="row"><span>Resident</span><span>Room</span><span>Course</span><span>Nationality</span><span>Status</span><span /></div>{filtered.map((resident) => <div className="data-row" role="row" key={resident.uuid}><div className="resident-cell"><span className="avatar">{resident.legal_name.split(' ').map((part) => part[0]).join('')}</span><p><strong>{resident.legal_name}</strong><small>{resident.university_id}</small></p></div><strong>{resident.room_number ?? 'Unassigned'}</strong><span>{resident.course || '—'}{resident.semester ? `, semester ${resident.semester}` : ''}</span><span>{resident.nationality}</span><StatusBadge>{resident.status}</StatusBadge><span /></div>)}{filtered.length === 0 && <div className="empty-state">No residents match these filters.</div>}</div></section>
  </main>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="mini-metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
