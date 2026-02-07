import React, { useState } from 'react'
import Foodcards from './Foodcards'
import '../../styles/admincss/AdminMess.css'

export default function MessMenuAdmin() {
  const [menu, setMenu] = useState([])

  const addMenuItem = () => {
    const foodname = window.prompt('Enter Food Name')
    if (!foodname) return
    const description = window.prompt('Enter Description (optional)')

    setMenu((prev) => [
      ...prev,
      { id: Date.now(), name: foodname , description: description || '' },
    ])
  }

  return (
    <>
      <div className="modify">
        {menu.length === 0 ? (
          <Foodcards />
        ) : (
          menu.map((item) => (
            <Foodcards
              key={item.id}
              name={item.name}
              description={item.description}
            />
          ))
        )}
      </div>

      <button onClick={addMenuItem}>Add Dish</button>
      <button>Save</button>
    </>
  )
}

