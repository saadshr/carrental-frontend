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

  if (!stats) return <div className="sr-page"><div className="sr-panel p-10 text-center text-slate-500">Chargement...</div></div>;

  const total = Math.max(stats.total_reservations, 1);
  const confirmedRate = Math.round((stats.confirmed_reservations / total) * 100);
  const pendingRate = Math.round((stats.pending_reservations / total) * 100);

  const cards = [
    { label: 'Réservations', value: stats.total_reservations, hint: 'Total historique' },
    { label: 'En attente', value: stats.pending_reservations, hint: `${pendingRate}% du portefeuille` },
    { label: 'Confirmées', value: stats.confirmed_reservations, hint: `${confirmedRate}% validées` },
    { label: 'Dépenses', value: `${stats.total_spent} DH`, hint: 'Réservations confirmées' },
  ];

  return (
    <main className="sr-page">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Espace client</p>
          <h1 className="sr-section-title mt-2">Bonjour, {user?.name}</h1>
          <p className="sr-section-subtitle">Vue synthétique de vos réservations SaadRent.</p>
        </div>
        <Link to="/reservations" className="sr-btn-primary">Voir mes réservations</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div key={card.label} className="sr-kpi" style={{ animationDelay: `${index * 70}ms` }}>
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <div className="mt-3 text-3xl font-black text-slate-950">{card.value}</div>
            <p className="mt-2 text-xs font-medium text-slate-400">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="sr-panel p-5 lg:col-span-5">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Performance réservation</h2>
            <p className="text-sm text-slate-500">Répartition simple de votre activité.</p>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
                <span>Confirmées</span><span>{confirmedRate}%</span>
              </div>
              <div className="sr-progress-track"><div className="sr-progress-fill" style={{ width: `${confirmedRate}%` }} /></div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
                <span>En attente</span><span>{pendingRate}%</span>
              </div>
              <div className="sr-progress-track"><div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${pendingRate}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="sr-panel p-5 lg:col-span-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Réservations récentes</h2>
              <p className="text-sm text-slate-500">Les dernières opérations de votre compte.</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.recent_reservations.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">Aucune réservation récente.</div>
            ) : stats.recent_reservations.map(r => (
              <div key={r.id} className="rounded-lg border border-slate-100 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{r.car?.brand} {r.car?.model}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700">{r.total_price} DH</p>
                    <span className="sr-badge-neutral">{r.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserDashboard;
