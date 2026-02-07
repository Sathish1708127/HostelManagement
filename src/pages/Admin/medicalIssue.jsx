import React from 'react'
import '../../styles/admincss/medicalAdmin.css'

export function MedicalIssues({ medicalIssues, onStatusChange }) {
  return (
    <div className="admin-medical-issues">
      <h2>Medical Issues – Admin Panel</h2>

      {medicalIssues.length === 0 ? (
        <p>No medical issues submitted.</p>
      ) : (
        <table className="admin-medical-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Issue</th>
              <th>Medication</th>
              <th>Medication Details</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {medicalIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.name}</td>
                <td>{issue.issue}</td>
                <td>{issue.medication}</td>
                <td>{issue.medicationDetails}</td>
                <td>{issue.date}</td>
                <td>
                  <span className={`status ${issue.status}`}>
                    {issue.status}
                  </span>
                </td>
                <td>
                  <select
                    value={issue.status}
                    onChange={(e) =>
                      onStatusChange(issue.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
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
