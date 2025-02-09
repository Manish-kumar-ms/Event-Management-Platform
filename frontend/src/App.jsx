import React, { useState } from 'react'
import Signup from './Components/Signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './Components/Login'
import Home from './Components/Home'
import CreateEvent from './Components/CreateEvent'


function App() {
  

  return (
    <div>
      
    <Routes>
    <Route path="/" element={<Navigate to="/signup"/>} />
      <Route path="/login" element={<Login  />} />
      <Route path="/signup" element={<Signup/>} />
      <Route
          path="/home"
          element={<Home  />}
        />
       <Route path="/create-event" element={<CreateEvent/>} />
    </Routes>
    </div>
  )
}

export default App
