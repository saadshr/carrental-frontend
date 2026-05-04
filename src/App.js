import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Bootstrap removed — using Tailwind for styling
import authService from './services/authService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarDetail from './pages/CarDetail';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

// Guard pour routes privées
const PrivateRoute = ({ children }) => {
  return authService.isLoggedIn() ? children : <Navigate to="/login" />;
};

// Guard pour routes admin
const AdminRoute = ({ children }) => {
  return authService.isAdmin() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/reservations" element={<PrivateRoute><MyReservations /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
