import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check for authentication token
 
  return token ? children :  navigate("/login");;
};

export default ProtectedRoute;