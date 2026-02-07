import { useEffect, useState } from "react";

function MessReviewTable() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Replace this with database fetch later
    setReviews([
      {
        id: 1,
        studentName: "Sathish",
        rollNo: "21CS045",
        meal: "Lunch",
        rating: 4,
        comment: "Good taste",
        date: "2026-02-06"
      },
      {
        id: 2,
        studentName: "Anu",
        rollNo: "21CS032",
        meal: "Dinner",
        rating: 2,
        comment: "Too oily",
        date: "2026-02-05"
      }
    ]);
  }, []);

  return (
    <div>
      <h2>Mess Reviews</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Meal</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.studentName}</td>
              <td>{r.rollNo}</td>
              <td>{r.meal}</td>
              <td>{r.rating} ⭐</td>
              <td>{r.comment}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MessReviewTable;
