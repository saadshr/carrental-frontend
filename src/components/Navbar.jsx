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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="sr-logo-mark">SR</span>
          <span>
            <span className="block text-lg font-black text-slate-950">SaadRent</span>
            <span className="block text-xs font-medium text-slate-500">Premium car rental</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <Link to="/" className="sr-btn-secondary">Voitures</Link>
          {isLogged ? (
            <>
              <Link to="/dashboard" className="sr-btn-secondary">Dashboard</Link>
              <Link to="/reservations" className="sr-btn-secondary">Réservations</Link>
              {isAdmin && <Link to="/admin" className="sr-btn-secondary border-amber-200 text-amber-700 hover:bg-amber-50">Admin BI</Link>}
              <span className="hidden md:inline text-sm font-semibold text-slate-600 ml-2">{user?.name}</span>
              <button onClick={handleLogout} className="sr-btn-secondary">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="sr-btn-secondary">Connexion</Link>
              <Link to="/register" className="sr-btn-primary">S'inscrire</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
