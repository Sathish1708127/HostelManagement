import React, { useState } from 'react'
import './studentdashboard.css'

export default function StudentEntry() {
    const [formData, setFormData] = useState({
        // Student Information
        studentName: '',
        semester: '',
        roomNo: '',
        studentPhone: '',
        email: '',
        address: '',
        // Father Information
        fatherName: '',
        fatherPhone: '',
        // Mother Information
        motherName: '',
        motherPhone: ''
    })

    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const validateForm = () => {
        const requiredFields = ['studentName', 'semester', 'roomNo', 'studentPhone', 'email', 'address', 'fatherName', 'fatherPhone', 'motherName', 'motherPhone']
        for (let field of requiredFields) {
            if (!formData[field].trim()) {
                setError(`Please fill in all required fields`)
                return false
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return false
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(formData.studentPhone.replace(/\D/g, ''))) {
            setError('Please enter a valid 10-digit phone number')
            return false
        }

        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) return

        console.log('Student Entry submitted:', formData)
        // Add your API call here
        // Reset form on success
        // setFormData({ ... })
    }

    const handleReset = () => {
        setFormData({
            studentName: '',
            semester: '',
            roomNo: '',
            studentPhone: '',
            email: '',
            address: '',
            fatherName: '',
            fatherPhone: '',
            motherName: '',
            motherPhone: ''
        })
        setError('')
    }

    return (
        <div className='dash'>
            <h1>Student Entry</h1>
            <h3>Student Information</h3>
            
            {error && <div className='error-message' style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <div className='form'>
                <form onSubmit={handleSubmit}>
                    {/* Student Information Section */}
                    <fieldset>
                        <legend>Student Details</legend>
                        <label htmlFor="studentName">Student Name:</label>
                        <input 
                            type="text" 
                            id="studentName" 
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="semester">Semester:</label>
                        <input 
                            type="text" 
                            id="semester" 
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="roomNo">Room No:</label>
                        <input 
                            type="text" 
                            id="roomNo" 
                            name="roomNo"
                            value={formData.roomNo}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="studentPhone">Student Phone No:</label>
                        <input 
                            type="tel" 
                            id="studentPhone" 
                            name="studentPhone"
                            value={formData.studentPhone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            required
                        />
                        
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="address">Address:</label>
                        <input 
                            type="text" 
                            id="address" 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </fieldset>

                    {/* Father Information Section */}
                    <fieldset>
                        <legend>Father's Information</legend>
                        <label htmlFor="fatherName">Father Name:</label>
                        <input 
                            type="text" 
                            id="fatherName" 
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="fatherPhone">Phone No:</label>
                        <input 
                            type="tel" 
                            id="fatherPhone" 
                            name="fatherPhone"
                            value={formData.fatherPhone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            required
                        />
                    </fieldset>

                    {/* Mother Information Section */}
                    <fieldset>
                        <legend>Mother's Information</legend>
                        <label htmlFor="motherName">Mother Name:</label>
                        <input 
                            type="text" 
                            id="motherName" 
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <label htmlFor="motherPhone">Phone No:</label>
                        <input 
                            type="tel" 
                            id="motherPhone" 
                            name="motherPhone"
                            value={formData.motherPhone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            required
                        />
                    </fieldset>

                    <div className='save'>
                        <button className='savebtn' type="submit">Save</button>
                        <button className='resetbtn' type="reset" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>
        </div>
    )
}