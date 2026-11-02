import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  urgency: 'low' | 'medium' | 'high';
  author: string;
  createdAt: string;
  readCount: number;
  totalCount: number;
};

const mockAnnouncements: Announcement[] = [
  { id: 'AN-001', title: 'Hostel closure for summer break', body: 'Hostel will be closed from 30 June for summer maintenance.', audience: 'All residents', urgency: 'high', author: 'Warden Aarav', createdAt: '15 Jun', readCount: 342, totalCount: 486 },
  { id: 'AN-002', title: 'Mess menu change for weekends', body: 'Sunday breakfast will be served until 10 AM instead of 9 AM.', audience: 'All residents', urgency: 'low', author: 'Mess Manager', createdAt: '14 Jun', readCount: 210, totalCount: 486 },
  { id: 'AN-003', title: 'Electric maintenance on Floor 3', body: 'Block C, Floor 3 power cut 2-4 PM on 18 June.', audience: 'Block C residents', urgency: 'medium', author: 'Maintenance', createdAt: '13 Jun', readCount: 89, totalCount: 120 },
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const isResident = isStudent || user?.role === 'parent_guardian';
  const canPublish = user?.role !== 'student' && user?.role !== 'parent_guardian';
  const [announcements, setAnnouncements] = usePersistentState('announcements', mockAnnouncements);
  const [readAnnouncementIds, setReadAnnouncementIds] = usePersistentState<string[]>(`read-announcements:${user?.id ?? 'guest'}`, []);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', audience: 'All residents', urgency: 'low' as Announcement['urgency'] });
  const [message, setMessage] = useState('');
  function publishAnnouncement(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!form.title.trim() || !form.body.trim()) return; setAnnouncements((items) => { const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('AN-', '')) || 0)); return [{ id: `AN-${String(lastId + 1).padStart(3, '0')}`, ...form, author: user?.name ?? 'Hostel staff', createdAt: 'Today', readCount: 0, totalCount: 486 }, ...items]; }); setMessage('Announcement published.'); setForm({ title: '', body: '', audience: 'All residents', urgency: 'low' }); setShowCreate(false); }
  const visibleAnnouncements = announcements.filter((announcement) =>
    !isResident || announcement.audience === 'All residents',
  );
  function markRead(announcement: Announcement) {
    setReadAnnouncementIds((ids) => ids.includes(announcement.id) ? ids : [...ids, announcement.id]);
    setMessage('Announcement marked as read.');
    setSelectedAnnouncement(null);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Announcements' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Communication</p>
          <h1>Announcements</h1>
          <p>{canPublish ? 'Create and manage announcements for residents and staff.' : 'Read hostel updates and important notices.'}</p>
        </div>
        {canPublish && <button className="primary-button" onClick={() => setShowCreate(true)}>New announcement</button>}
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      <section className="metric-grid compact">
        <article className="mini-metric"><span>{isResident ? 'Unread' : 'Active'}</span><strong>{isResident ? visibleAnnouncements.filter((item) => !readAnnouncementIds.includes(item.id)).length : visibleAnnouncements.length}</strong><small>{isResident ? 'Hostel notices' : 'This week'}</small></article>
        {!isResident && <><article className="mini-metric"><span>Avg read rate</span><strong>72%</strong><small>Across all</small></article>
        <article className="mini-metric"><span>Urgent</span><strong>{visibleAnnouncements.filter((item) => item.urgency === 'high').length}</strong><small>Needs attention</small></article></>}
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>All announcements</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Title</span><span>Audience</span><span>Urgency</span><span>Author</span>{!isResident && <span>Read</span>}<span>Date</span><span />
          </div>
          {visibleAnnouncements.map((a) => (
            <div className="data-row" role="row" key={a.id}>
              <p><strong>{a.title}</strong><small>{a.body.substring(0, 60)}{a.body.length > 60 ? '…' : ''}</small></p>
              <span>{a.audience}</span>
              <StatusBadge>{a.urgency}</StatusBadge>
              <span>{a.author}</span>
              {!isResident && <span>{a.readCount}/{a.totalCount}</span>}
              <span>{a.createdAt}</span>
              <button className="row-action" onClick={() => setSelectedAnnouncement(a)}>{isResident && readAnnouncementIds.includes(a.id) ? 'Read' : 'View'}</button>
            </div>
          ))}
        </div>
      </section>
      {selectedAnnouncement && <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-heading"><h2>{selectedAnnouncement.title}</h2><button className="quiet-button" onClick={() => setSelectedAnnouncement(null)}>Close</button></div>
        <p>{selectedAnnouncement.body}</p>
        {isResident && <button className="primary-button" disabled={readAnnouncementIds.includes(selectedAnnouncement.id)} onClick={() => markRead(selectedAnnouncement)}>{readAnnouncementIds.includes(selectedAnnouncement.id) ? 'Already read' : 'Mark as read'}</button>}
      </section>}
      {canPublish && showCreate && (
        <form className="panel" onSubmit={publishAnnouncement} style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <h2>Create announcement</h2>
            <button className="quiet-button" type="button" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <input required placeholder="Title" className="styled-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <textarea required placeholder="Announcement body..." rows={4} className="styled-input" style={{ resize: 'vertical' }} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
            <select className="styled-input" aria-label="Audience" value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })}>
              <option>All residents</option><option>Block A</option><option>Block B</option><option>Block C</option><option>Staff only</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="styled-input" aria-label="Urgency" value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value as Announcement['urgency'] })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
              <button className="primary-button" type="submit">Publish</button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
