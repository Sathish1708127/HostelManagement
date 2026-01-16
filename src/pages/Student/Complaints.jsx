import React from 'react'
import './complaints.css'
export function Complaints(){
    return(
    <div className='complain'>
        <h1>File a Complaint</h1>
        <div className='complainbox'>
        <form action="">
            <label className='label' htmlFor="complaint-description">Describe your complaint:</label>
            <textarea className='text' id="complaint-description"></textarea>
            <button className='complainbtn' type="submit">Submit Complaint</button>
        </form>
        </div>
    </div>
    )
}