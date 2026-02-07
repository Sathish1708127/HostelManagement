import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'


export default function Sidebar2() {
  return (
    <div className='sidebar' >
      <h2>Menu</h2>
      <div className='side'>
      <Link to='/'>Dashboard</Link>
      <Link to='/student-details'>Student Details</Link>
      <Link to='/mess-review'>Mess Review</Link>
      <Link to='/medical'>Medical Issues</Link>
      <Link to='/leave-application'>Leave Application</Link>
      <Link to='/laundry'>Laundry</Link>
      <Link to='/complaints'>complaints</Link>
      <Link to='/cleaning-review'>Cleaning Review</Link>
      <Link to='/fees'>Fees</Link>
      </div>
    </div>
  );
}
