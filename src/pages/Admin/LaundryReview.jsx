import React from 'react'
import '../../styles/admincss/laundryAdmin.css'

export function LaundryReview({ laundryReviews }) {
  return (
    <div className="laundry-admin">
      <h2>Laundry Reviews – Admin Panel</h2>

      {laundryReviews.length === 0 ? (
        <p>No laundry reviews submitted.</p>
      ) : (
        <table className="laundry-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room No</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {laundryReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>{review.roomNo}</td>
                <td>{review.rating} ⭐</td>
                <td>{review.description}</td>
                <td>{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
