import React from 'react'
import './dashboard.css'
export function Dashboard() {
    return (
        <div>
            <h1>Dashboard Page</h1>
            <div className="announcements">Announcements
                <div className="announcement-item">New hostel rules have been implemented.</div>
                <div className="announcement-item">The mess menu has been updated.</div>
            </div>
        </div>
    )
}