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
      setReservations(reservations.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      alert('Impossible d\'annuler la réservation');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Mes réservations</h2>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="text-slate-600 bg-slate-50 p-4 rounded">Vous n'avez aucune réservation pour le moment.</div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => (
            <div key={r.id} className="flex gap-4 items-start bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <img src={r.car?.image || `https://via.placeholder.com/300x180?text=${r.car?.brand}+${r.car?.model}`}
                alt={r.car?.model} className="w-40 h-28 object-cover" />

              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{r.car?.brand} {r.car?.model}</h3>
                  <div className="text-sm text-slate-600">{r.status}</div>
                </div>
                <p className="text-sm text-slate-500 mt-1"><strong>Période :</strong> {formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
                <p className="text-sm text-slate-500"><strong>Prix total :</strong> {r.total_price} DH</p>
                {r.notes && <p className="text-sm text-slate-400 mt-2">Notes: {r.notes}</p>}
                <div className="mt-4 flex justify-end">
                  {['pending','confirmed'].includes(r.status) && (
                    <button className="px-3 py-1 text-sm rounded-md bg-rose-500 text-white" onClick={() => handleCancel(r.id)}>Annuler</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
