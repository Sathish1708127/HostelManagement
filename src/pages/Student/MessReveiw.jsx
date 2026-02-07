import React, { useState } from 'react'
import '../../styles/studentcss/mess.css'
import '../../styles/width.css'

function MessReviewForm() {
  const [review, setReview] = useState({
    studentName: "",
    rollNo: "",
    meal: "Lunch",
    rating: 5,
    comment: ""
  });

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later replace this with API / Firebase call
    console.log("Submitted Review:", review);

    alert("Review submitted successfully!");
    setReview({
      studentName: "",
      rollNo: "",
      meal: "Lunch",
      rating: 5,
      comment: ""
    });
  };

  return (
  <div className='mess-review widthbox'>
      <h2>Mess Review</h2>
    <form onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name:</label>
      <input
        name="studentName"
        placeholder="Student Name"
        value={review.studentName}
        onChange={handleChange}
        required
        />
        <label htmlFor="rollNo">Roll Number:</label>
      <input
        name="rollNo"
        placeholder="Roll Number"
        value={review.rollNo}
        onChange={handleChange}
        required
        />
        <label htmlFor="meal">Meal:</label>
      <select name="meal" value={review.meal} onChange={handleChange}>
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
      </select>
        <label htmlFor="rating">Rating:</label>
      <select name="rating" value={review.rating} onChange={handleChange}>
        {[1,2,3,4,5].map(r => (
            <option key={r} value={r}>{r}</option>
        ))}
      </select>
        <label htmlFor="comment">Comment:</label>
      <textarea
        name="comment"
        placeholder="Write your feedback"
        value={review.comment}
        onChange={handleChange}
        />

      <button type="submit">Submit Review</button>
    </form>
    </div>
  );
}

export default MessReviewForm;
