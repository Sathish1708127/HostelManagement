import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Task = {
  id: string;
  area: string;
  room: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reopened';
  dueDate: string;
  student?: string;
};

const mockTasks: Task[] = [
  { id: 'CL-001', area: 'Room cleaning', room: 'B-201', assignedTo: 'Sunita Devi', status: 'completed', dueDate: '14 Jun' },
  { id: 'CL-002', area: 'Common area', room: 'Floor 2 Lounge', assignedTo: 'Ram Kumar', status: 'in_progress', dueDate: '14 Jun' },
  { id: 'CL-003', area: 'Bathroom', room: 'B-202', assignedTo: 'Sunita Devi', status: 'pending', dueDate: '15 Jun' },
  { id: 'CL-004', area: 'Corridor', room: 'Block C, Floor 1', assignedTo: 'Anil Singh', status: 'reopened', dueDate: '14 Jun' },
];

export default function CleaningPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [tasks, setTasks] = usePersistentState('cleaning-tasks', mockTasks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ area: 'Room cleaning', room: '', assignedTo: '' });
  const [message, setMessage] = useState('');
  function assignTask(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!form.room.trim() || (!isStudent && !form.assignedTo.trim()) || !user) return; setTasks((items) => { const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('CL-', '')) || 0)); return [{ id: `CL-${String(lastId + 1).padStart(3, '0')}`, ...form, assignedTo: isStudent ? 'Housekeeping queue' : form.assignedTo, student: isStudent ? user.name : undefined, status: 'pending', dueDate: 'Today' }, ...items]; }); setMessage(isStudent ? 'Cleaning request submitted.' : 'Cleaning task assigned.'); setForm({ area: 'Room cleaning', room: '', assignedTo: '' }); setShowForm(false); }
  function updateTaskStatus(id: string, status: Task['status']) {
    setTasks((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setMessage(`Cleaning task ${id} marked ${status.replace('_', ' ')}.`);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Cleaning' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Housekeeping</p>
          <h1>Cleaning & housekeeping</h1>
          <p>{isStudent ? 'Request cleaning for your room or a shared area.' : 'Room cleaning schedules, common area upkeep, and feedback tracking.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>{isStudent ? 'Request cleaning' : 'Assign task'}</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}
      {showForm && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>{isStudent ? 'Request cleaning' : 'Assign cleaning task'}</h2><button className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div><form onSubmit={assignTask} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}><select className="styled-input" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}><option>Room cleaning</option><option>Bathroom</option><option>Common area</option><option>Corridor</option></select><input className="styled-input" required placeholder="Room or location" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} />{!isStudent && <input className="styled-input" required placeholder="Assign to staff member" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} />}<button className="primary-button" type="submit">{isStudent ? 'Submit request' : 'Assign task'}</button></form></section>}

      <section className="metric-grid compact">
        {isStudent ? <><article className="mini-metric"><span>My requests</span><strong>{tasks.filter((task) => task.student === user?.name).length}</strong><small>Cleaning requests</small></article><article className="mini-metric"><span>Open</span><strong>{tasks.filter((task) => task.student === user?.name && ['pending', 'in_progress'].includes(task.status)).length}</strong><small>Awaiting completion</small></article></> : <><article className="mini-metric"><span>Completed today</span><strong>12</strong><small>86% completion rate</small></article>
        <article className="mini-metric"><span>In progress</span><strong>5</strong><small>Active tasks</small></article>
        <article className="mini-metric"><span>Reopened</span><strong>2</strong><small>Needs rework</small></article></>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Cleaning tasks</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Task</span><span>Area</span><span>Room</span><span>Assigned to</span><span>Status</span><span>Due</span><span />
          </div>
          {tasks.filter((task) => !isStudent || task.student === user?.name).map((t) => (
            <div className="data-row" role="row" key={t.id}>
              <strong>{t.id}</strong><span>{t.area}</span><strong>{t.room}</strong>
              <span>{t.assignedTo}</span>
              <StatusBadge>{t.status.replace('_', ' ')}</StatusBadge>
              <span>{t.dueDate}</span>
              {isStudent && t.status === 'completed' ? (
                <button className="row-action" onClick={() => updateTaskStatus(t.id, 'reopened')}>Request rework</button>
              ) : !isStudent && ['pending', 'in_progress', 'reopened'].includes(t.status) ? (
                <button
                  className="row-action"
                  onClick={() => updateTaskStatus(t.id, t.status === 'pending' ? 'in_progress' : 'completed')}
                >
                  {t.status === 'pending' ? 'Start task' : 'Complete'}
                </button>
              ) : <span className="muted">{t.status.replace('_', ' ')}</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
