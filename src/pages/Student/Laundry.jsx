import React, { useState } from 'react'
import '../../styles/studentcss/laundry.css'
import '../../styles/width.css'

export default function Laundry() {
  const [formData, setFormData] = useState({
    name: '',
    roomNo: '',
    rating: '',
    description: ''
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
      date: new Date().toLocaleDateString()
    }

    console.log('Laundry Review Submitted:', newReview)
    // TODO: send to backend / Firebase

    setFormData({
      name: '',
      roomNo: '',
      rating: '',
      description: ''
    })
  }

  return (
    <div className="laundry-review widthbox">
      <h1>Laundry Review</h1>

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

        <label>Rating (1–5)</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="1">1 – Very Bad</option>
          <option value="2">2 – Bad</option>
          <option value="3">3 – Average</option>
          <option value="4">4 – Good</option>
          <option value="5">5 – Excellent</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  )
}
