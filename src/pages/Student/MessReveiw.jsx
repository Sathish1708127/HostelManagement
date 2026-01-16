import React, { useState } from 'react'
import './mess.css'

const MIN_RATING = 1
const MAX_RATING = 10

export default function MessReview() {
    const [formData, setFormData] = useState({
        foodQuality: '',
        service: '',
        hygiene: '',
        rating: 5
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        if (!formData.foodQuality.trim() || !formData.service.trim() || !formData.hygiene.trim()) {
            alert('Please fill in all fields')
            return
        }
        console.log('Review submitted:', formData)
        // Add your API call or data handling here
    }

    return (
        <div>
            <div className='mess-s'>
                <div className='header'>
                <h1>Mess Review</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="foodQuality">How Is The Food Quality:</label>
                    <input 
                        type="text" 
                        id="foodQuality" 
                        name="foodQuality"
                        value={formData.foodQuality}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label htmlFor="service">Service:</label>
                    <input 
                        type="text" 
                        id="service" 
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <label htmlFor="hygiene">Is It Hygiene:</label>
                    <input 
                        type="text" 
                        id="hygiene" 
                        name="hygiene"
                        value={formData.hygiene}
                        onChange={handleInputChange}
                        required
                    />
                    
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
                    
                    <button className='submit' type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    )
}