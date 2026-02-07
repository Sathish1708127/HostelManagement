import React from 'react'
import '../../styles/admincss/laundryAdmin.css'

export function LaundryAdminTable({ laundryReviews, onStatusChange }) {
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
              <th>Status</th>
              <th>Update Status</th>
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

                {/* STATUS DISPLAY */}
                <td>
                  <span className={`status ${review.status}`}>
                    {review.status}
                  </span>
                </td>

                {/* STATUS CHANGER */}
                <td>
                  <select
                    value={review.status}
                    onChange={(e) =>
                      onStatusChange(review.id, e.target.value)
                    }
                  >
                    <option value="Not Done">Not Done</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}