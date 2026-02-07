import React, { useState } from 'react'
import '../../styles/admincss/admindashboard.css'

const DASHBOARD_CARDS = [
    { id: 1, title: 'Students', icon: 'fas fa-graduation-cap', color: 'stud' },
    { id: 2, title: 'Room Availability', icon: 'fas fa-door-open', color: 'roomavailab' },
    { id: 3, title: 'Attendance', icon: 'fas fa-calendar-check', color: 'attendence' },
    { id: 4, title: 'Mess Menu', icon: 'fas fa-utensils', color: 'messmenuu' },
    { id: 5, title: 'Fees', icon: 'fas fa-money-bill', color: 'fees' },
    { id: 6, title: 'Holidays', icon: 'fas fa-calendar-alt', color: 'holidays' },
    { id: 7, title: 'Announcements', icon: 'fas fa-bullhorn', color: 'announce' }
]

export default function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCards, setFilteredCards] = useState(DASHBOARD_CARDS)

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (query.trim() === '') {
            setFilteredCards(DASHBOARD_CARDS)
        } else {
            const filtered = DASHBOARD_CARDS.filter(card =>
                card.title.toLowerCase().includes(query)
            )
            setFilteredCards(filtered)
        }
    }

    const handleCardClick = (cardTitle) => {
        console.log(`Navigating to ${cardTitle}`)
        // Add navigation logic here
    }

    return (
        <div className='admin-dashboard'>
            <div className='admin'>
                {/* Search Section */}
                <div className='search-section'>
                    <label htmlFor="search">Search Modules:</label>
                    <div className='search-container'>
                        <input 
                            type="text" 
                            id='search' 
                            placeholder='Search for students, rooms, fees...'
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <i className="fas fa-search search-icon"></i>
                    </div>
                </div>

                {/* Dashboard Cards Grid */}
                <div className='dashboard-grid'>
                    {filteredCards.length > 0 ? (
                        filteredCards.map(card => (
                            <div 
                                key={card.id} 
                                className={`dashboard-card ${card.color}`}
                                onClick={() => handleCardClick(card.title)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleCardClick(card.title)
                                    }
                                }}
                            >
                                <i className={`${card.icon} card-icon`}></i>
                                <h3>{card.title}</h3>
                            </div>
                        ))
                    ) : (
                        <div className='no-results'>
                            <p>No modules found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// import React, { useState } from 'react'
// import { LaundryAdminTable } from './LaundryAdminTable'

// export function AdminDashboard() {
//   const [laundryReviews, setLaundryReviews] = useState([
//     {
//       id: 1,
//       name: 'Sathish',
//       roomNo: 'A-101',
//       rating: 4,
//       description: 'Clothes were clean but late',
//       date: '07/02/2026',
//       status: 'Not Done'
//     }
//   ])

//   const handleStatusChange = (id, newStatus) => {
//     setLaundryReviews((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, status: newStatus } : item
//       )
//     )
//   }

//   return (
//     <LaundryAdminTable
//       laundryReviews={laundryReviews}
//       onStatusChange={handleStatusChange}
//     />
//   )
// }
