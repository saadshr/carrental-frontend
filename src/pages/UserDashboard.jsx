import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservationService from '../services/reservationService';
import authService from '../services/authService';

function UserDashboard() {
  const [stats, setStats] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    reservationService.getDashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  const cards = [
    { label:'Total réservations', value: stats.total_reservations, color:'primary', icon:'📋' },
    { label:'En attente',         value: stats.pending_reservations, color:'warning', icon:'⏳' },
    { label:'Confirmées',         value: stats.confirmed_reservations, color:'success', icon:'✅' },
    { label:'Total dépensé',      value: `${stats.total_spent} DH`, color:'info', icon:'💰' },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">👋 Bonjour, {user?.name}</h2>
      <div className="row g-3 mb-4">
        {cards.map((c, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card border-${c.color} h-100`}>
              <div className="card-body text-center">
                <div style={{fontSize:'2rem'}}>{c.icon}</div>
                <h3 className={`text-${c.color}`}>{c.value}</h3>
                <p className="text-muted mb-0">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h5>Réservations récentes</h5>
      {stats.recent_reservations.map(r => (
        <div className="card mb-2" key={r.id}>
          <div className="card-body py-2 d-flex justify-content-between">
            <span>🚗 {r.car?.brand} {r.car?.model}</span>
            <span>{r.start_date} → {r.end_date}</span>
            <strong>{r.total_price} DH</strong>
          </div>
        </div>
      ))}
      <Link to="/reservations" className="btn btn-outline-primary mt-3">
        Voir toutes mes réservations →
      </Link>
    </div>
  );
}

export default UserDashboard;