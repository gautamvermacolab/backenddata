import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check karein ki localStorage mein token hai ya nahi
  const token = localStorage.getItem('token');

  // Agar token nahi hai, toh user ko register/login par bhej dein
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // Agar token hai, toh jo page woh dekhna chahta hai dikha dein
  return children;
};

export default ProtectedRoute;