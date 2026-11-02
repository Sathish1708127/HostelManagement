// import React from 'react'
// import './App.css'
// import { Routes, Route } from 'react-router-dom'
// import Dashboard from './pages/Common/Dashboard'
// import Login from './pages/Auth/Login'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   )
// }

// export default App

import React from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import studRouter from './pages/Student/routss.jsx'


function App() {
  return (
    <RouterProvider router={studRouter} />
  );
}
export default App
