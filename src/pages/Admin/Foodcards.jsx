import React, { useState } from 'react'
import '../../styles/admincss/AdminMess.css'

export default function Foodcards({ name = '', description = '' }) {
  const [title, setTitle] = useState(name)
  const [desc, setDesc] = useState(description)
  return (
    <div className="container">
      <h4>hi</h4>
      <div className="card">
        <div className="card-body1">
          <div className="card-body">
            <h5 className="card-title">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </h5>
            <p className="card-text">
              <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </p>
          </div>

          <div className="announcebtn">
              <button className="bttn btn11" type="button">Remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}
