import React from 'react'
import './navbar.css'
import { Sidebar } from './Sidebar'


export function Navbar({ setRole }) {
    return (
        <div className="navbar">
            <button>
              <img src="https://icons.veryicon.com/png/o/miscellaneous/we/sidebar-2.png" alt="sidepanal" />
              </button>
            <h1><a className="nav-logo" href="/">Hostel Management System</a></h1>
            <ul>
                <li>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault()
                      setRole("admin")
                    }}
                  >
                    Admin
                  </a>
                </li>
                <li>
                  <a
                    href="/student"
                    onClick={(e) => {
                      e.preventDefault()
                      setRole("student")
                    }}
                  >
                    Student
                  </a>
                </li>
            </ul>
        </div>
    )
}