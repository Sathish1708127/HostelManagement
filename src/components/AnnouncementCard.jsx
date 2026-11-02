import React from 'react'

export function AnnouncementCard({ title, content }) {
  return (
    <div className="announcement-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}