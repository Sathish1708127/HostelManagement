import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Post = {
  id: string;
  author: string;
  type: 'skill_offer' | 'skill_request' | 'general';
  title: string;
  description: string;
  likes: number;
  comments: number;
  createdAt: string;
};

const mockPosts: Post[] = [
  { id: 'CP-001', author: 'Maya Gurung', type: 'skill_offer', title: 'Free guitar lessons', description: 'Teaching basic guitar for beginners on weekends.', likes: 12, comments: 5, createdAt: '14 Jun' },
  { id: 'CP-002', author: 'Arjun Rao', type: 'skill_request', title: 'Need help with Python', description: 'Looking for a Python mentor for my semester project.', likes: 8, comments: 3, createdAt: '13 Jun' },
  { id: 'CP-003', author: 'Zoya Khan', type: 'general', title: 'Study group for exams', description: 'Anyone interested in forming a study group for finals?', likes: 24, comments: 10, createdAt: '12 Jun' },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = usePersistentState('community-posts', mockPosts);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ type: 'general' as Post['type'], title: '', description: '' });

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.type === filter);
  function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !form.title.trim() || !form.description.trim()) return;
    setPosts((items) => {
      const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('CP-', '')) || 0));
      return [{ id: `CP-${String(lastId + 1).padStart(3, '0')}`, author: user.name, ...form, likes: 0, comments: 0, createdAt: 'Today' }, ...items];
    });
    setMessage('Your post has been shared with the hostel community.');
    setForm({ type: 'general', title: '', description: '' });
    setShowForm(false);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Community' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Skill exchange & community</h1>
          <p>Offer skills, find help, and connect with fellow residents.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>Create post</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <form className="panel" onSubmit={createPost} style={{ marginBottom: 16 }}>
        <div className="panel-heading"><h2>New community post</h2><button className="quiet-button" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
        <div style={{ display: 'grid', gap: 12 }}>
          <select className="styled-input" aria-label="Post type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as Post['type'] })}><option value="general">General</option><option value="skill_offer">Offer a skill</option><option value="skill_request">Request a skill</option></select>
          <input className="styled-input" required maxLength={120} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <textarea className="styled-input" required maxLength={1000} placeholder="Tell the community more" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <button className="primary-button" type="submit">Share post</button>
        </div>
      </form>}

      <section className="dashboard-grid" style={{ marginTop: 0 }}>
        <article className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="table-tools">
            <button className={`quiet-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`quiet-button ${filter === 'skill_offer' ? 'active' : ''}`} onClick={() => setFilter('skill_offer')}>Skill offers</button>
            <button className={`quiet-button ${filter === 'skill_request' ? 'active' : ''}`} onClick={() => setFilter('skill_request')}>Requests</button>
            <button className={`quiet-button ${filter === 'general' ? 'active' : ''}`} onClick={() => setFilter('general')}>General</button>
          </div>
          {filtered.map((post) => (
            <div className="panel" key={post.id} style={{ marginTop: 8, boxShadow: 'none', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="avatar">{post.author.split(' ').map(n => n[0]).join('')}</span>
                <p style={{ margin: 0 }}><strong>{post.author}</strong><small style={{ color: 'var(--muted)', marginLeft: 8 }}>{post.createdAt}</small></p>
                <StatusBadge>{post.type.replace('_', ' ')}</StatusBadge>
              </div>
              <h3 style={{ margin: '4px 0' }}>{post.title}</h3>
              <p className="muted" style={{ margin: '4px 0 8px' }}>{post.description}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--muted)' }}>
                <button className="row-action" onClick={() => setPosts((items) => items.map((item) => item.id === post.id ? { ...item, likes: item.likes + 1 } : item))}>Like ({post.likes})</button>
                <span>Comment ({post.comments})</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state">No posts to show.</div>}
        </article>
      </section>
    </main>
  );
}
