import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'


export default function Sidebar() {
  return (
    <div className='sidebar' >
      <h2>Menu</h2>
      <div className='side'>
      <Link to='/admin'>Dashboard</Link>
      <Link to='/admin/announcements'>Announcements</Link>
      <Link to='/admin/student-details'>Students</Link>
      <Link to='/admin/complaints'>Complaints</Link>
      <Link to='/dashboard'>Attendance</Link>
      <Link to='/admin/mess-menu'>Mess Menu</Link>
      <Link to='/admin/room-management'>Room Availability</Link>
      <Link to='/dashboard'>Fees</Link>
      <Link to='/dashboard'>Holidays</Link>
      </div>
    </div>
  );
}
