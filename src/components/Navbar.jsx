import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Navbar() {
  const navigate = useNavigate();
  const isLogged = authService.isLoggedIn();
  const isAdmin  = authService.isAdmin();
  const user     = authService.getUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🚗 CarRental</Link>
        <div className="navbar-nav ms-auto d-flex flex-row gap-2 align-items-center">
          <Link className="nav-link text-white" to="/">Voitures</Link>
          {isLogged ? (
            <>
              <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
              <Link className="nav-link text-white" to="/reservations">Mes réservations</Link>
              {isAdmin && <Link className="nav-link text-warning" to="/admin">Admin</Link>}
              <span className="text-secondary small">{user?.name}</span>
              <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-outline-light" to="/login">Connexion</Link>
              <Link className="btn btn-sm btn-primary" to="/register">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
