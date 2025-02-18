import React, { useState } from 'react'
import Signup from './Components/Signup'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Login } from './Components/Login'
import Home from './Components/Home'
import CreateEvent from './Components/CreateEvent'
import  ProtectedRoute  from './Components/ProtectedRoute'
import { handleLogout } from './Components/HandleLogout'
import { jwtDecode } from 'jwt-decode'


function App() {

  
  // Check if user is logged in and token is valid
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        handleLogout();
        return false;
      }

      return true;
    }

    return false;
  };
  

  return (
    <div>
      
    <Routes>
    <Route path="/" element={<Navigate to="/signup"/>} />
      <Route path="/login" element={<Login  />} />
      <Route path="/signup" element={<Signup/>} />
      <Route
          path="/home"
          element={
            isLoggedIn() ? <Home /> : <Navigate to="/login" />
          }
        />
       <Route path="/create-event" element={ 
          isLoggedIn() ? <CreateEvent /> : <Navigate to="/login" />}
       />
    </Routes>
    
    </div>
  )
}

export default App
