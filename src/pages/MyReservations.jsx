import React, { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reservationService.getMyReservations();
      setReservations(res.data);
    } catch (err) {
      setError('Impossible de charger vos réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    try {
      await reservationService.cancel(id);
      await load();
    } catch (err) {
      alert('Impossible d\'annuler la réservation');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();

  return (
    <main className="sr-page">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Historique client</p>
        <h1 className="sr-section-title mt-2">Mes réservations</h1>
        <p className="sr-section-subtitle">Suivi de vos demandes, confirmations et annulations.</p>
      </div>

      {loading ? (
        <div className="sr-panel p-10 text-center text-slate-500">Chargement...</div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="text-slate-600 bg-slate-50 p-4 rounded">Vous n'avez aucune réservation pour le moment.</div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => (
            <div key={r.id} className="sr-card flex flex-col gap-4 overflow-hidden md:flex-row md:items-start">
              <img
                src={r.car?.image || `https://via.placeholder.com/300x180?text=${encodeURIComponent(`${r.car?.brand} ${r.car?.model}`)}`}
                alt={r.car?.model}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                className="h-48 w-full object-cover md:h-36 md:w-56"
              />

              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-950">{r.car?.brand} {r.car?.model}</h3>
                  <div>
                    {r.status === 'pending' && <span className="sr-badge-warning">En attente</span>}
                    {r.status === 'confirmed' && <span className="sr-badge-success">Confirmée</span>}
                    {r.status === 'cancelled' && <span className="sr-badge-neutral">Annulée</span>}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1"><strong>Période :</strong> {formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
                <p className="mt-2 text-lg font-black text-emerald-700">{r.total_price} DH</p>
                {r.notes && <p className="text-sm text-slate-400 mt-2">Notes: {r.notes}</p>}
                <div className="mt-4 flex justify-end">
                  {['pending','confirmed'].includes(r.status) && (
                    <button className="sr-btn-danger" onClick={() => handleCancel(r.id)}>Annuler</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyReservations;
