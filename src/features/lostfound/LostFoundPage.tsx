import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type LostFoundItem = {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'open' | 'matched' | 'resolved' | 'closed';
  reporter: string;
};

const mockItems: LostFoundItem[] = [
  { id: 'LF-001', type: 'lost', title: 'Black Casio Watch', description: 'Lost near the basketball court.', location: 'Basketball Court', date: '14 Jun', status: 'open', reporter: 'Maya Gurung' },
  { id: 'LF-002', type: 'found', title: 'Blue Water Bottle', description: 'Found in study room B-201.', location: 'Study Room B-201', date: '14 Jun', status: 'open', reporter: 'Arjun Rao' },
  { id: 'LF-003', type: 'found', title: 'Casio Calculator', description: 'Found in common room.', location: 'Common Room', date: '13 Jun', status: 'matched', reporter: 'Zoya Khan' },
];

export default function LostFoundPage() {
  const { user } = useAuth();
  const [items, setItems] = usePersistentState('lost-found-items', mockItems);
  const [tab, setTab] = useState<'all' | 'lost' | 'found'>('all');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ type: 'lost' as LostFoundItem['type'], title: '', description: '', location: '' });
  const filtered = tab === 'all' ? items : items.filter(i => i.type === tab);
  function reportItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !form.title.trim() || !form.description.trim() || !form.location.trim()) return;
    setItems((current) => {
      const lastId = Math.max(0, ...current.map((item) => Number(item.id.replace('LF-', '')) || 0));
      return [{ id: `LF-${String(lastId + 1).padStart(3, '0')}`, ...form, date: 'Today', status: 'open', reporter: user.name }, ...current];
    });
    setMessage('Your item has been added to the lost and found board.');
    setForm({ type: 'lost', title: '', description: '', location: '' });
    setShowForm(false);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Lost and Found' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Lost and Found</p>
          <h1>Lost and found</h1>
          <p>Report lost items, log found items, and connect with their owners.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>Report item</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <form className="panel" onSubmit={reportItem} style={{ marginBottom: 16 }}>
        <div className="panel-heading"><h2>Report an item</h2><button className="quiet-button" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <select className="styled-input" aria-label="Report type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as LostFoundItem['type'] })}><option value="lost">I lost an item</option><option value="found">I found an item</option></select>
          <input className="styled-input" required maxLength={120} placeholder="Item name" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input className="styled-input" required maxLength={120} placeholder="Last seen / found location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          <textarea className="styled-input" required maxLength={500} placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <button className="primary-button" type="submit">Publish report</button>
        </div>
      </form>}
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Lost items</span><strong>{items.filter((item) => item.type === 'lost' && item.status === 'open').length}</strong><small>Open cases</small></article>
        <article className="mini-metric"><span>Found items</span><strong>{items.filter((item) => item.type === 'found' && item.status === 'open').length}</strong><small>Awaiting claims</small></article>
        <article className="mini-metric"><span>Resolved</span><strong>{items.filter((item) => ['matched', 'resolved', 'closed'].includes(item.status)).length}</strong><small>Items matched</small></article>
      </section>
      <section className="panel">
        <div className="table-tools">
          <button className={'quiet-button ' + (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>All</button>
          <button className={'quiet-button ' + (tab === 'lost' ? 'active' : '')} onClick={() => setTab('lost')}>Lost items</button>
          <button className={'quiet-button ' + (tab === 'found' ? 'active' : '')} onClick={() => setTab('found')}>Found items</button>
        </div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>ID</span><span>Type</span><span>Item</span><span>Location</span><span>Date</span><span>Status</span><span>Reporter</span><span />
          </div>
          {filtered.map((item) => (
            <div className="data-row" role="row" key={item.id}>
              <strong>{item.id}</strong>
              <StatusBadge>{item.type}</StatusBadge>
              <p><strong>{item.title}</strong><small>{item.description.substring(0, 40)}...</small></p>
              <span>{item.location}</span><span>{item.date}</span>
              <StatusBadge>{item.status}</StatusBadge>
              <span>{item.reporter}</span>
              {item.type === 'found' && item.status === 'open' && <button className="row-action" onClick={() => { setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'matched' } : entry)); setMessage('Claim request sent to the item reporter.'); }}>Claim</button>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
