import React from 'react'
import './sidebar.css'


export function Sidebar({role}) {
    if (!role) {
        return <div className="sidebar-placeholder">Select Admin or Student from the navbar</div>
    }
    return (
        <div className="sidebar">
        {role==="admin"? (
            <div className="admin">
                <h1>Sidebar1</h1>
                <ul>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/students">Student list</a></li>
                    <li><a href="/payments">Fees</a></li>
                    <li><a href="/mess">Mess</a></li>
                    <li><a href="/settings">Complaints</a></li>
                </ul>
            </div>
        ):(
            <div className='student'>
                <h1>Sidebar2</h1>
                <ul>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/students">Student list</a></li>
                    <li><a href="/payments">Fees</a></li>
                    <li><a href="/mess">Mess Review</a></li>
                    <li><a href="/complaints">Complaints</a></li>
                    <li><a href="/leave">Leave</a></li>
                    <li><a href="/cleaning-review">Cleaning Review</a></li>
                    <li><a href="/medical-issues">Medical Issues</a></li>
                </ul>
            </div>
        )}
        </div>
    )
}