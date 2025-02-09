import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../Utils';
import { useNavigate,Link } from 'react-router-dom';

 export const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
      email: "",
      password: "",
    });
  
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setLoginInfo({ ...loginInfo, [name]: value });
    };
  
    // Handle User Login
    const handleLogin = async (e) => {
      e.preventDefault();
      const { email, password } = loginInfo;
  
      if (!email || !password) {
        return handleError("Email and password are required.");
      }
  
      try {
        const url = "http://localhost:8000/auth/login";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role: "User" }), // Sending User login data
        });
  
        if (!response.ok) {
          const result = await response.json();
          return handleError(result.message || "An error occurred.");
        }
  
        const result = await response.json();
        console.log(result);
  
        const { success, message, jwtToken, name } = result;
  
        if (success) {
          localStorage.setItem("token", jwtToken); // Save JWT token
          localStorage.setItem("loggedInUser", name); // Save username
          handleSucess(message);
  
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      } catch (error) {
        handleError(error.message || "An error occurred during login.");
      }
    };
  
    // Handle Guest Login
    const handleGuestLogin = async () => {
      try {
        const url = "http://localhost:8000/auth/login";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: "Guest" }), // Sending Guest login data
        });
  
        if (!response.ok) {
          const result = await response.json();
          return handleError(result.message || "An error occurred.");
        }
  
        const result = await response.json();
        console.log(result);
  
        const { success, message, jwttoken, guestuser } = result; // Extract guestuser
        const expiresAt = guestuser.expiresAt; // Extract expiration time from guestuser
        
        if (success) {
          localStorage.setItem("token", jwttoken); // Save JWT token
          localStorage.setItem("expiresAt", expiresAt); // Save expiration time from backend
          handleSucess(message);
  
          // Set a timeout to clear storage and redirect to login after expiration
          const expirationDuration =
            new Date(expiresAt).getTime() - new Date().getTime(); // Calculate time left
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresAt");
            navigate("/login");
            alert("Your guest session has expired. Please log in again.");
          }, expirationDuration);
  
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      } catch (error) {
        handleError(error.message || "An error occurred during guest login.");
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg p-6 rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoFocus
                placeholder="Enter your email"
                value={loginInfo.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              Login
            </button>
          </form>
  
          <div className="mt-4">
            <button
              onClick={handleGuestLogin}
              className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Login as Guest
            </button>
          </div>
  
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </p>
          <ToastContainer />
        </div>
      </div>
    );
  };
  
 
