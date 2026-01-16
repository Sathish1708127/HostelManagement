import React from 'react'
import './leave.css'
export function Laundry(){
    return(
    <div className='leavebox'>
        <div className='leave'>
        <h1>Laundry Service</h1>
        <div className='leave-in'>
        <form action="">
            <label htmlFor="laundry-room-number">Room No:</label>
            <input type="text" id="laundry-room-number" />
            <label htmlFor="laundry-date">Given Date:</label>
            <input type="date" id="laundry-date" />
            <label htmlFor="laundry-return-date">Return Date:</label>
            <input type="date" id="laundry-return-date" />
        </form>
        </div>
            <label className='leavereason' htmlFor="laundry-review">Review:</label>
            <textarea className='text-area' id="laundry-review"></textarea>
            <button className='leavebtn' type="submit">Submit Laundry</button>
        </div>
    </div>
    )
}