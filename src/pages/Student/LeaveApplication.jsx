import React, { useState } from 'react'
import '../../styles/studentcss/leave.css'
import '../../styles/width.css'

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    name: '',
    roomNo: '',
    startDate: '',
    returnDate: '',
    reason: '',
    semester: '',
    phone: ''
  })

  const [myLeaves, setMyLeaves] = useState([])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('Leave Application Submitted:', formData)
    // add to local list (replace with backend call / Firebase as needed)
    const newLeave = {
      id: Date.now(),
      ...formData,
      status: 'Pending'
    }

    setMyLeaves((prev) => [newLeave, ...prev])

    // TODO: send to backend / Firebase

    setFormData({
      name: '',
      roomNo: '',
      startDate: '',
      returnDate: '',
      reason: '',
      semester: '',
      phone: ''
    })
  }

  return (
    <div className="leave-application widthbox">
      <h1>Leave Application</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Room No</label>
        <input name="roomNo" value={formData.roomNo} onChange={handleChange} required />

        <label>Semester</label>
        <input name="semester" value={formData.semester} onChange={handleChange} required />

        <label>Phone Number</label>
        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <label>Return Date</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          required
        />

        <label>Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Leave</button>
      </form>

      <table>
  <thead>
    <tr>
      <th>Start</th>
      <th>Return</th>
      <th>Reason</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {myLeaves.map((leave) => (
      <tr key={leave.id}>
        <td>{leave.startDate}</td>
        <td>{leave.returnDate}</td>
        <td>{leave.reason}</td>
        <td>
          <span className={`status ${leave.status}`}>
            {leave.status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  )
}
