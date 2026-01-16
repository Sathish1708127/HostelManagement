import React, { useState } from 'react'
import './mess.css'
import './complaints.css'

const MIN_RATING = 1
const MAX_RATING = 10

export default function CleaningReview() {
    const [formData, setFormData] = useState({
        name: '',
        roomNo: '',
        sweeping: false,
        mopping: false,
        rating: 5
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const updateRating = (increment) => {
        setFormData(prev => ({
            ...prev,
            rating: Math.max(MIN_RATING, Math.min(MAX_RATING, prev.rating + increment))
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.roomNo.trim()) {
            alert('Please fill in all required fields')
            return
        }
        console.log('Review submitted:', formData)
        // Add your API call or data handling here
    }

    return (
        <div className='complain'>
          <div className='header'>
            <h1>Cleaning Review</h1>
          </div>
            <div className='complainbox'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">NAME:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label htmlFor="roomNo">ROOM NO.:</label>
                    <input 
                        type="text" 
                        id="roomNo" 
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label htmlFor="sweeping">
                        <input 
                            type="checkbox" 
                            id="sweeping" 
                            name="sweeping"
                            checked={formData.sweeping}
                            onChange={handleInputChange}
                        />
                        SWEEPING
                    </label>
                    
                    <label htmlFor="mopping">
                        <input 
                            type="checkbox" 
                            id="mopping" 
                            name="mopping"
                            checked={formData.mopping}
                            onChange={handleInputChange}
                        />
                        MOPPING
                    </label>
                    
                    <div className="rating">
                        <button 
                            className='ratebtn' 
                            type="button"
                            onClick={() => updateRating(-1)}
                            disabled={formData.rating <= MIN_RATING}
                        >
                            -
                        </button>
                        <p>YOUR RATING: {formData.rating} / {MAX_RATING}</p>
                        <button 
                            className='ratebtn' 
                            type="button"
                            onClick={() => updateRating(1)}
                            disabled={formData.rating >= MAX_RATING}
                        >
                            +
                        </button>
                    </div>
                    
                    <button className='complainbtn' type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    )
}