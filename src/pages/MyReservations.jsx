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
    <div className="container py-4">
      <h2 className="mb-4">Mes réservations</h2>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="alert alert-info">Vous n'avez aucune réservation pour le moment.</div>
      ) : (
        <div className="row g-4">
          {reservations.map(r => (
            <div className="col-md-6" key={r.id}>
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img src={r.car?.image || `https://via.placeholder.com/300x180?text=${r.car?.brand}+${r.car?.model}`}
                      className="img-fluid rounded-start" alt={r.car?.model} style={{height:'180px', objectFit:'cover'}} />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <h5 className="card-title">{r.car?.brand} {r.car?.model}</h5>
                      <p className="mb-1"><strong>Période :</strong> {formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
                      <p className="mb-1"><strong>Prix total :</strong> {r.total_price} DH</p>
                      <p className="mb-1"><strong>Statut :</strong> {r.status}</p>
                      {r.notes && <p className="text-muted small">Notes: {r.notes}</p>}
                    </div>
                    <div className="card-footer bg-white border-0 pb-3">
                      <div className="d-flex justify-content-end">
                        {['pending','confirmed'].includes(r.status) && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(r.id)}>Annuler</button>
                        )}
                      </div>
                    </div>
                  </div>
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
