import { type FormEvent, useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

type Booking = {
  id: string;
  facility: string;
  student: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
};

const mockBookings: Booking[] = [
  { id: 'BK-001', facility: 'Badminton Court', student: 'Maya Gurung', date: '15 Jun', timeSlot: '4:00-5:00 PM', status: 'confirmed' },
  { id: 'BK-002', facility: 'Music Room', student: 'Arjun Rao', date: '15 Jun', timeSlot: '6:00-7:30 PM', status: 'pending' },
  { id: 'BK-003', facility: 'Study Hall A', student: 'Zoya Khan', date: '16 Jun', timeSlot: '10:00-12:00 AM', status: 'completed' },
  { id: 'BK-004', facility: 'Party Lawn', student: 'Nima Sherpa', date: '20 Jun', timeSlot: 'Full day', status: 'no_show' },
];

const facilities = ['Badminton Court', 'Basketball Court', 'Music Room', 'Study Hall A', 'Study Hall B', 'Seminar Hall', 'Party Lawn', 'Swimming Pool'];

export default function BookingsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [bookings, setBookings] = usePersistentState('facility-bookings', mockBookings);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('All facilities');
  const [form, setForm] = useState({ facility: facilities[0], date: '', timeSlot: '4:00-5:00 PM' });
  const [message, setMessage] = useState('');
  const visibleBookings = bookings.filter((booking) =>
    (!isStudent || booking.student === user?.name) &&
    (selectedFacility === 'All facilities' || booking.facility === selectedFacility),
  );
  function createBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !form.date) {
      setMessage('Choose a booking date.');
      return;
    }
    const conflict = bookings.some((booking) =>
      booking.facility === form.facility &&
      booking.date === form.date &&
      booking.timeSlot === form.timeSlot &&
      !['cancelled', 'completed', 'no_show'].includes(booking.status),
    );
    if (conflict) {
      setMessage('That facility and time are already reserved. Choose another time.');
      return;
    }
    setBookings((items) => {
      const lastId = Math.max(0, ...items.map((item) => Number(item.id.replace('BK-', '')) || 0));
      return [{ id: `BK-${String(lastId + 1).padStart(3, '0')}`, facility: form.facility, student: user.name, date: form.date, timeSlot: form.timeSlot, status: 'pending' }, ...items];
    });
    setMessage('Booking request submitted for approval.');
    setShowBookingForm(false);
  }
  function updateBookingStatus(id: string, status: Booking['status']) {
    setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setMessage(`Booking ${id} ${status.replace('_', ' ')}.`);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Facility Bookings' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Facilities</p>
          <h1>Bookings & reservations</h1>
          <p>{isStudent ? 'Request a facility booking and track its approval.' : 'Review facility bookings and manage schedules.'}</p>
        </div>
        <button className="primary-button" onClick={() => setShowBookingForm(true)}>{isStudent ? 'Request booking' : 'Book a facility'}</button>
      </section>
      {message && <p className="muted" role="status">{message}</p>}

      <section className="metric-grid compact">
        {isStudent ? <><article className="mini-metric"><span>My bookings</span><strong>{bookings.filter((booking) => booking.student === user?.name).length}</strong><small>All statuses</small></article><article className="mini-metric"><span>Pending approval</span><strong>{bookings.filter((booking) => booking.student === user?.name && booking.status === 'pending').length}</strong><small>Awaiting confirmation</small></article></> : <><article className="mini-metric"><span>Today&apos;s bookings</span><strong>{bookings.length}</strong><small>Across facilities</small></article>
        <article className="mini-metric"><span>Pending approval</span><strong>{bookings.filter((booking) => booking.status === 'pending').length}</strong><small>Needs confirmation</small></article>
        <article className="mini-metric"><span>No-shows</span><strong>{bookings.filter((booking) => booking.status === 'no_show').length}</strong><small>Flagged</small></article></>}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Facility calendar</h2></div>
        <div className="table-tools">
          {['All facilities', ...facilities].map((f) => (
            <button key={f} className={`quiet-button ${selectedFacility === f ? 'active' : ''}`} onClick={() => setSelectedFacility(f)} style={{ fontSize: '0.75rem', padding: '6px 10px' }}>{f}</button>
          ))}
        </div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Booking</span><span>Facility</span>{!isStudent && <span>Student</span>}<span>Date</span><span>Time</span><span>Status</span><span />
          </div>
          {visibleBookings.map((b) => (
            <div className="data-row" role="row" key={b.id}>
              <strong>{b.id}</strong><span>{b.facility}</span>{!isStudent && <span>{b.student}</span>}
              <span>{b.date}</span><span>{b.timeSlot}</span>
              <StatusBadge>{b.status.replace('_', ' ')}</StatusBadge>
              {isStudent && ['pending', 'confirmed'].includes(b.status) ? (
                <button className="row-action" onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</button>
              ) : !isStudent && b.status === 'pending' ? (
                <button className="row-action" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Approve</button>
              ) : !isStudent && b.status === 'confirmed' ? (
                <button className="row-action" onClick={() => updateBookingStatus(b.id, 'completed')}>Complete</button>
              ) : <span className="muted">{b.status.replace('_', ' ')}</span>}
            </div>
          ))}
        </div>
      </section>

      {showBookingForm && (
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <h2>New booking</h2>
            <button className="quiet-button" onClick={() => setShowBookingForm(false)}>Cancel</button>
          </div>
          <form onSubmit={createBooking} style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <select className="styled-input" aria-label="Facility" value={form.facility} onChange={(event) => setForm({ ...form, facility: event.target.value })}>
              {facilities.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <input type="date" required min={new Date().toISOString().slice(0, 10)} className="styled-input" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            <select className="styled-input" aria-label="Time slot" value={form.timeSlot} onChange={(event) => setForm({ ...form, timeSlot: event.target.value })}>
              <option>8:00-9:00 AM</option><option>9:00-10:00 AM</option><option>10:00-11:00 AM</option>
              <option>11:00-12:00 PM</option><option>12:00-1:00 PM</option><option>2:00-3:00 PM</option>
              <option>3:00-4:00 PM</option><option>4:00-5:00 PM</option><option>5:00-6:00 PM</option>
              <option>6:00-7:00 PM</option><option>7:00-8:00 PM</option>
            </select>
            <button className="primary-button" type="submit" style={{ alignSelf: 'end' }}>Check availability and request</button>
          </form>
        </div>
      )}
    </main>
  );
}
