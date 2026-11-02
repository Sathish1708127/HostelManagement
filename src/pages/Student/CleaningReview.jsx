import React, { useState } from 'react'
import '../../styles/studentcss/cleaning.css'
import '../../styles/width.css'

export default function CleaningReview() {
  const [formData, setFormData] = useState({
    name: '',
    roomNo: '',
    cleanliness: '',
    improvements: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newReview = {
      ...formData,
      status: 'Not Cleaned',
      date: new Date().toLocaleDateString()
    }

    console.log('Cleaning Review Submitted:', newReview)
    // TODO: send to backend / Firebase

    setFormData({
      name: '',
      roomNo: '',
      cleanliness: '',
      improvements: ''
    })
  }

  return (
    <div className="cleaning-review widthbox">
      <h1>Cleaning Review</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Room No</label>
        <input
          name="roomNo"
          value={formData.roomNo}
          onChange={handleChange}
          required
        />

        <label>Was the room cleaned?</label>
        <select
          name="cleanliness"
          value={formData.cleanliness}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Good">Good</option>
          <option value="Bad">Bad</option>
        </select>

        <label>Improvements Needed</label>
        <textarea
          name="improvements"
          value={formData.improvements}
          onChange={handleChange}
          placeholder="Mention areas to improve"
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  )
}
