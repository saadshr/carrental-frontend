import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carService from '../services/carService';
import reservationService from '../services/reservationService';
import authService from '../services/authService';

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ start_date:'', end_date:'', notes:'' });
  const [price, setPrice]     = useState({ days:0, total:0 });
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carService.getOne(id).then(res => {
      setCar(res.data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (form.start_date && form.end_date && car) {
      const calc = reservationService.calculatePrice(form.start_date, form.end_date, car.price_per_day);
      setPrice(calc);
    }
  }, [form.start_date, form.end_date, car]);

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!authService.isLoggedIn()) { navigate('/login'); return; }
    setSubmitting(true);
    setError('');
    try {
      await reservationService.create({ car_id: id, ...form });
      setMessage('✅ Réservation créée avec succès !');
      setCar({...car, status: 'rented'});
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  if (!car) return <div className="container py-5"><p>Voiture introuvable</p></div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-7">
          <img src={car.image || `https://via.placeholder.com/600x350?text=${car.brand}`}
            className="img-fluid rounded shadow mb-3" alt={car.model} />
          <h2>{car.brand} {car.model}</h2>
          <p className="text-muted">{car.license_plate}</p>
          <div className="mb-3">
            <span className="badge bg-info me-2">{car.type}</span>
            <span className="badge bg-secondary me-2">{car.seats} places</span>
            <span className={`badge bg-${car.status==='available'?'success':'danger'}`}>
              {car.status === 'available' ? 'Disponible' : 'Indisponible'}
            </span>
          </div>
          <p>{car.description}</p>
          <h4 className="text-primary">{car.price_per_day} DH / jour</h4>
        </div>

        <div className="col-md-5">
          {car.status === 'available' ? (
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">📅 Réserver cette voiture</h5>
                {message && <div className="alert alert-success">{message}</div>}
                {error   && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleReserve}>
                  <div className="mb-3">
                    <label className="form-label">Date début</label>
                    <input type="date" className="form-control"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.start_date}
                      onChange={e => setForm({...form, start_date: e.target.value})}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date fin</label>
                    <input type="date" className="form-control"
                      min={form.start_date || new Date().toISOString().split('T')[0]}
                      value={form.end_date}
                      onChange={e => setForm({...form, end_date: e.target.value})}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes (optionnel)</label>
                    <textarea className="form-control" rows="2"
                      value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}>
                    </textarea>
                  </div>
                  {price.days > 0 && (
                    <div className="alert alert-info">
                      <strong>{price.days} jours × {car.price_per_day} DH = </strong>
                      <strong className="text-success fs-5">{price.total} DH</strong>
                    </div>
                  )}
                  <button type="submit" className="btn btn-success w-100" disabled={submitting}>
                    {submitting ? 'Réservation...' : 'Confirmer la réservation'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">Cette voiture n'est pas disponible.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarDetail;
