import React from 'react'
import './leave.css'
export function LeaveApplication(){
    return(
        <div className='leavebox'>
            <div className='leave'>
                <h1>Leave Application</h1>
                <div className='leave-in'>
                <form action="">
                    <label htmlFor="leave-name">Name:</label>
                    <input type="text" id="leave-name" />
                    <label htmlFor="leave-room-number">Room No:</label>
                    <input type="text" id="leave-room-number" />
                    <label htmlFor="leave-start-date">Start Date:</label>
                    <input type="date" id="leave-start-date" />
                    <label htmlFor="leave-end-date">End Date:</label>
                    <input type="date" id="leave-end-date" />
                </form>
                </div>
                    <label className='leavereason' htmlFor="leave-reason">Reason for Leave:</label>
                    <textarea className='text-area' id="leave-reason"></textarea>
                    <button className='leavebtn' type="submit">Submit Application</button>
            </div>
        </div>
    )
}