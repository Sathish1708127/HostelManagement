import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../app/providers';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { usePersistentState } from '../../hooks/usePersistentState';

type HostelEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'hostel' | 'personal' | 'holiday';
  reminderMinutes: number;
};

const reminderOptions = [
  { minutes: 0, label: 'At event time' },
  { minutes: 10, label: '10 minutes before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 1440, label: '1 day before' },
];

const holidayNames: Record<string, string> = {
  '01-26': 'Republic Day',
  '08-15': 'Independence Day',
  '10-02': 'Gandhi Jayanti',
};

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getHolidays(year: number): HostelEvent[] {
  return Object.entries(holidayNames).map(([monthDay, title]) => ({
    id: `holiday-${year}-${monthDay}`,
    title,
    date: `${year}-${monthDay}`,
    time: '',
    category: 'holiday',
    reminderMinutes: 1440,
  }));
}

function monthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function CalendarPage() {
  const { user } = useAuth();
  const today = new Date();
  const todayKey = localDateKey(today);
  const currentYear = today.getFullYear();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(localDateKey(today));
  const [events, setEvents] = usePersistentState<HostelEvent[]>(`calendar-events-${user?.id ?? 'guest'}`, [], true);
  const [remindedEventIds, setRemindedEventIds] = usePersistentState<string[]>(`calendar-reminders-${user?.id ?? 'guest'}`, [], true);
  const [showForm, setShowForm] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    () => typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
  );
  const [reminderMessage, setReminderMessage] = useState('');
  const [form, setForm] = useState({ title: '', date: localDateKey(today), time: '09:00', category: 'personal' as HostelEvent['category'], reminderMinutes: 10 });

  const holidays = useMemo(() => getHolidays(month.getFullYear()), [month]);
  const monthEvents = useMemo(
    () => [...events, ...holidays].filter((event) => event.date.startsWith(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`)),
    [events, holidays, month],
  );
  const selectedEvents = useMemo(
    () => [...events, ...getHolidays(parseLocalDate(selectedDate).getFullYear())]
      .filter((event) => event.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [events, selectedDate],
  );
  const upcomingEvents = useMemo(
    () => [...events, ...getHolidays(currentYear), ...getHolidays(currentYear + 1)]
      .filter((event) => event.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 5),
    [currentYear, events, todayKey],
  );

  const firstDayOffset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  useEffect(() => {
    function checkReminders() {
      const now = Date.now();
      const allEvents = [...events, ...getHolidays(new Date().getFullYear()), ...getHolidays(new Date().getFullYear() + 1)];
      const due = allEvents.filter((event) => {
        const eventTime = new Date(`${event.date}T${event.time || '09:00'}:00`).getTime();
        const reminderTime = eventTime - event.reminderMinutes * 60_000;
        return reminderTime <= now && now <= eventTime + 60_000 && !remindedEventIds.includes(event.id);
      });
      if (due.length === 0) return;
      setRemindedEventIds((ids) => [...new Set([...ids, ...due.map((event) => event.id)])]);
      due.forEach((event) => {
        const text = `${event.title} starts ${event.time ? `at ${event.time}` : 'today'}.`;
        setReminderMessage(text);
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Hostel Pulse reminder', { body: text });
        }
      });
    }

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 30_000);
    return () => window.clearInterval(intervalId);
  }, [events, remindedEventIds, setRemindedEventIds]);

  function changeMonth(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  function openCreateForm(date = selectedDate) {
    setSelectedDate(date);
    setForm({ title: '', date, time: '09:00', category: 'personal', reminderMinutes: 10 });
    setShowForm(true);
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.date) return;
    setEvents((current) => [...current, {
      id: crypto.randomUUID(),
      ...form,
      title: form.title.trim(),
      category: form.category === 'holiday' ? 'hostel' : form.category,
    }]);
    setSelectedDate(form.date);
    setMonth(new Date(parseLocalDate(form.date).getFullYear(), parseLocalDate(form.date).getMonth(), 1));
    setShowForm(false);
    setReminderMessage('Event added. Its reminder will appear here and as a browser notification if enabled.');
  }

  async function enableNotifications() {
    if (typeof Notification === 'undefined') {
      setReminderMessage('Browser notifications are not supported here. In-app reminders still work while the calendar is open.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setReminderMessage(permission === 'granted'
        ? 'Browser reminders are enabled.'
        : 'Notifications were not enabled. In-app reminders still work while the calendar is open.');
    } catch (caught) {
      setReminderMessage(caught instanceof Error ? caught.message : 'Unable to enable browser notifications.');
    }
  }

  function removeEvent(eventId: string) {
    setEvents((current) => current.filter((event) => event.id !== eventId));
    setRemindedEventIds((current) => current.filter((id) => id !== eventId));
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Calendar' }]} />
      <section className="page-heading calendar-heading">
        <div>
          <p className="eyebrow">Plan your hostel life</p>
          <h1>Calendar & reminders</h1>
          <p>Keep hostel events, personal plans, and Indian national holidays together. Reminders run while the calendar is open.</p>
        </div>
        <button className="primary-button" onClick={() => openCreateForm()}>+ Add event</button>
      </section>
      {reminderMessage && <p className="calendar-reminder" role="status">{reminderMessage}</p>}

      <section className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-toolbar">
            <div className="calendar-month-title"><h2>{monthLabel(month)}</h2><button className="quiet-button" onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(localDateKey(today)); }}>Today</button></div>
            <div className="calendar-month-actions"><button className="quiet-button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button><button className="quiet-button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button></div>
          </div>
          <div className="calendar-grid calendar-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid calendar-days">
            {calendarDays.map((day, index) => {
              if (day === null) return <div className="calendar-day empty" key={`empty-${index}`} aria-hidden="true" />;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const dateKey = localDateKey(date);
              const dayEvents = monthEvents.filter((event) => event.date === dateKey);
              return <button className={`calendar-day ${dateKey === selectedDate ? 'selected' : ''} ${dateKey === localDateKey(today) ? 'today' : ''}`} key={dateKey} onClick={() => setSelectedDate(dateKey)} aria-label={`${date.toLocaleDateString(undefined, { dateStyle: 'full' })}${dayEvents.length ? `, ${dayEvents.length} events` : ''}`}>
                <span>{day}</span>
                <div className="calendar-day-events">{dayEvents.slice(0, 2).map((event) => <span className={`calendar-event-dot ${event.category}`} key={event.id}>{event.title}</span>)}{dayEvents.length > 2 && <small>+{dayEvents.length - 2} more</small>}</div>
              </button>;
            })}
          </div>
          <div className="calendar-legend"><span><i className="personal" />Personal</span><span><i className="hostel" />Hostel event</span><span><i className="holiday" />Public holiday</span></div>
        </div>

        <aside className="calendar-side">
          <section className="panel">
            <div className="panel-heading"><h2>{parseLocalDate(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h2><button className="row-action" onClick={() => openCreateForm(selectedDate)}>+ Add</button></div>
            {selectedEvents.length ? <div className="calendar-event-list">{selectedEvents.map((event) => <article className={`calendar-event-card ${event.category}`} key={event.id}>
              <span>{event.time || (event.category === 'holiday' ? 'Public holiday' : 'All day')}</span><strong>{event.title}</strong>
              {event.category !== 'holiday' && <><small>{reminderOptions.find((option) => option.minutes === event.reminderMinutes)?.label ?? 'Reminder set'}</small><button className="row-action" onClick={() => removeEvent(event.id)}>Remove</button></>}
            </article>)}</div> : <div className="calendar-empty-day"><p>No events planned</p><button className="quiet-button" onClick={() => openCreateForm(selectedDate)}>Add an event</button></div>}
          </section>

          <section className="panel upcoming-panel">
            <div className="panel-heading"><h2>Coming up</h2></div>
            <div className="calendar-upcoming-list">{upcomingEvents.map((event) => <button key={event.id} onClick={() => { setSelectedDate(event.date); const date = parseLocalDate(event.date); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }}>
              <span className={`upcoming-date ${event.category}`}><strong>{parseLocalDate(event.date).getDate()}</strong><small>{parseLocalDate(event.date).toLocaleDateString(undefined, { month: 'short' })}</small></span><span><strong>{event.title}</strong><small>{event.time || (event.category === 'holiday' ? 'Public holiday' : 'All day')}</small></span>
            </button>)}</div>
            <button className="quiet-button reminder-permission" onClick={() => void enableNotifications()} disabled={notificationPermission === 'granted'}>{notificationPermission === 'granted' ? 'Browser reminders enabled' : 'Enable browser reminders'}</button>
          </section>
        </aside>
      </section>

      {showForm && <div className="calendar-dialog-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <form className="panel calendar-event-form" onSubmit={createEvent} aria-label="Add calendar event">
          <div className="panel-heading"><div><p className="eyebrow">New event</p><h2>Add to your calendar</h2></div><button className="quiet-button" type="button" onClick={() => setShowForm(false)}>Close</button></div>
          <label>Event title<input className="styled-input" required maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What are you planning?" /></label>
          <div className="calendar-form-row"><label>Date<input className="styled-input" required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>Time<input className="styled-input" required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></label></div>
          <div className="calendar-form-row"><label>Type<select className="styled-input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as HostelEvent['category'] })}><option value="personal">Personal</option><option value="hostel">Hostel event</option></select></label><label>Reminder<select className="styled-input" value={form.reminderMinutes} onChange={(event) => setForm({ ...form, reminderMinutes: Number(event.target.value) })}>{reminderOptions.map((option) => <option key={option.minutes} value={option.minutes}>{option.label}</option>)}</select></label></div>
          <button className="primary-button" type="submit">Save event</button>
        </form>
      </div>}
    </main>
  );
}
