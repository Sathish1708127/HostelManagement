import { useState, type FormEvent } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';
import { usePersistentState } from '../../hooks/usePersistentState';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const mockMenu: Record<string, Record<string, string>> = {
  Monday: { Breakfast: 'Poha, Chai, Fruit', Lunch: 'Dal, Rice, Roti, Paneer', Snacks: 'Samosa, Coffee', Dinner: 'Chapati, Chole, Salad' },
  Tuesday: { Breakfast: 'Upma, Coffee', Lunch: 'Egg Curry, Rice, Naan', Snacks: 'Vada, Chai', Dinner: 'Dal Khichdi, Pickle' },
  Wednesday: { Breakfast: 'Paratha, Curd', Lunch: 'Fish Curry, Rice', Snacks: 'Biscuits, Tea', Dinner: 'Pulao, Raita' },
  Thursday: { Breakfast: 'Idli, Sambhar', Lunch: 'Dal Tadka, Rice, Roti', Snacks: 'Pakora, Chai', Dinner: 'Naan, Shahi Paneer' },
  Friday: { Breakfast: 'Bread Omelette, Tea', Lunch: 'Chicken Curry, Rice', Snacks: 'French Fries', Dinner: 'Veg Biryani, Raita' },
  Saturday: { Breakfast: 'Chilla, Chutney', Lunch: 'Soya Chaap, Naan', Snacks: 'Pasta, Coffee', Dinner: 'Roti, Mix Veg' },
  Sunday: { Breakfast: 'Pancake, Syrup', Lunch: 'Special Thali', Snacks: 'Cake, Ice Cream', Dinner: 'Pizza, Juice' },
};

export default function MessPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const canEditMenu = user?.role === 'mess_manager' || user?.role === 'super_admin';
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [optedIn, setOptedIn] = usePersistentState('mess-opted-in', true);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = usePersistentState('mess-reviews', [
    ['Maya G.', 'Dinner', 'Excellent taste and portion! ⭐⭐⭐⭐⭐', 'Today'],
    ['Arjun R.', 'Lunch', 'A bit oily today, could improve.', 'Yesterday'],
    ['Zoya K.', 'Breakfast', 'Poha was perfect! ⭐⭐⭐⭐', 'Yesterday'],
  ]);
  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMeal || !review.trim()) return;
    setReviews((items) => [[user?.name ?? 'Resident', selectedMeal, `${review.trim()} (${rating}/5)`, 'Today'], ...items]);
    setMessage('Your meal review has been saved.');
    setReview('');
    setSelectedMeal(null);
  }

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Mess' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">{isStudent ? 'Student dining' : 'Mess operations'}</p>
          <h1>Menu & meal management</h1>
          <p>{isStudent ? 'View the weekly menu, manage tomorrow’s meal attendance, and leave a review.' : 'View and manage the weekly dining menu.'}</p>
        </div>
        <div className="heading-actions">
          {canEditMenu && <button className="quiet-button">Edit menu</button>}
          {isStudent && <button className="primary-button" onClick={() => setOptedIn(!optedIn)}>
            {optedIn ? 'Opt out for tomorrow' : 'Opt in for tomorrow'}
          </button>}
        </div>
      </section>
      {message && <p className="muted" role="status">{message}</p>}

      <section className="metric-grid compact">
        <article className="mini-metric"><span>Today&apos;s diners</span><strong>342</strong><small>72% opted in</small></article>
        <article className="mini-metric"><span>Avg rating</span><strong>4.2</strong><small>This week</small></article>
        <article className="mini-metric"><span>Cutoff</span><strong>7 PM</strong><small>For tomorrow</small></article>
      </section>

      <section className="panel">
        <div className="menu-selector">
          {days.map((day) => (
            <button
              key={day}
              className={`day-tab ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {meals.map((meal) => (
            <div key={meal} className="menu-card">
              <span className="eyebrow">{meal}</span>
              <p className="menu-dish">{mockMenu[selectedDay][meal]}</p>
              <div className="menu-tags">
                <StatusBadge>Vegetarian</StatusBadge>
              </div>
              {isStudent && <button className="quiet-button" style={{ marginTop: 8 }} onClick={() => setSelectedMeal(`${selectedDay} ${meal}`)}>Rate this meal</button>}
            </div>
          ))}
        </div>
      </section>
      {selectedMeal && <form className="panel" onSubmit={submitReview} style={{ marginTop: 16 }}>
        <div className="panel-heading"><h2>Review {selectedMeal}</h2><button className="quiet-button" type="button" onClick={() => setSelectedMeal(null)}>Cancel</button></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>Rating <select className="styled-input" value={rating} onChange={(event) => setRating(event.target.value)}>{[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} / 5</option>)}</select></label>
          <input className="styled-input" required maxLength={500} placeholder="Share your feedback" value={review} onChange={(event) => setReview(event.target.value)} />
          <button className="primary-button" type="submit">Submit review</button>
        </div>
      </form>}
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-heading"><h2>Recent reviews</h2></div>
        <div className="request-table">
          {reviews.map(([name, meal, review, date]) => (
            <div className="request-row" key={name + date}>
              <span className="request-id">{date}</span>
              <p><strong>{name}</strong><small>{meal}</small></p>
              <span style={{ gridColumn: '2 / 4' }}>{review}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
