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
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    carService.getOne(id).then(res => {
      setCar(res.data);
      setImgSrc(res.data.image || `https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80`);
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
    // Client-side validation to provide clearer messages
    const todayStr = new Date().toISOString().split('T')[0];
    if (!form.start_date || !form.end_date) {
      setError('Veuillez sélectionner une date de début et une date de fin.');
      setSubmitting(false);
      return;
    }
    if (form.start_date < todayStr) {
      setError('La date de début doit être aujourd\'hui ou plus tard.');
      setSubmitting(false);
      return;
    }
    if (form.end_date <= form.start_date) {
      setError('La date de fin doit être après la date de début.');
      setSubmitting(false);
      return;
    }
    if (price.days <= 0) {
      setError('La période sélectionnée doit être d\'au moins un jour.');
      setSubmitting(false);
      return;
    }
    try {
      await reservationService.create({ car_id: id, ...form });
      setMessage('✅ Réservation créée avec succès !');
      setCar({...car, status: 'rented'});
      // redirect to My Reservations after short delay
      setTimeout(() => navigate('/reservations'), 900);
    } catch (err) {
      // handle validation errors and backend messages
      const data = err.response?.data;
      if (data?.errors) {
        // join validation messages
        const msgs = Object.values(data.errors).flat().join(' - ');
        setError(msgs);
      } else if (data?.error) {
        setError(data.error);
      } else if (err.response) {
        setError(`Erreur ${err.response.status}: ${JSON.stringify(err.response.data)}`);
      } else {
        setError(err.message || 'Erreur lors de la réservation');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="sr-page"><div className="sr-panel p-10 text-center text-slate-500">Chargement...</div></div>;
  if (!car) return <div className="sr-page"><div className="sr-panel p-10 text-center text-slate-500">Voiture introuvable</div></div>;

  return (
    <main className="sr-page grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <img src={imgSrc}
          onError={() => setImgSrc(`https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80`)}
          className="mb-5 h-80 w-full rounded-lg object-cover shadow-lg" alt={car.model} />
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">{car.type}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{car.brand} {car.model}</h1>
        <p className="mt-1 text-sm text-slate-500">{car.license_plate}</p>
        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          <div className="sr-badge-neutral">{car.seats} places</div>
          <div className={car.status==='available'?'sr-badge-success':'sr-badge-danger'}>
            {car.status === 'available' ? 'Disponible' : 'Indisponible'}
          </div>
        </div>
        <p className="max-w-2xl text-slate-600">{car.description}</p>
        <div className="mt-6 inline-flex items-end gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          <span className="text-3xl font-black text-emerald-700">{car.price_per_day} DH</span>
          <span className="pb-1 text-sm font-semibold text-emerald-700">/ jour</span>
        </div>
      </section>

      <section className="lg:col-span-5">
        {car.status === 'available' ? (
          <div className="sr-panel p-5">
            <h2 className="text-xl font-bold text-slate-950 mb-1">Réserver cette voiture</h2>
            <p className="mb-5 text-sm text-slate-500">Choisissez vos dates pour calculer le prix automatiquement.</p>
            {message && <div className="text-green-700 bg-green-50 p-2 rounded mb-2">{message}</div>}
            {error   && <div className="text-rose-700 bg-rose-50 p-2 rounded mb-2">{error}</div>}
            <form onSubmit={handleReserve} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date début</label>
                <input type="date" className="sr-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.start_date}
                  onChange={e => setForm({...form, start_date: e.target.value})}
                  required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date fin</label>
                <input type="date" className="sr-input"
                  min={form.start_date || new Date().toISOString().split('T')[0]}
                  value={form.end_date}
                  onChange={e => setForm({...form, end_date: e.target.value})}
                  required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (optionnel)</label>
                <textarea className="sr-input" rows={3}
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})} />
              </div>

              {price.days > 0 && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                  <strong>{price.days} jours × {car.price_per_day} DH = </strong>
                  <strong className="text-emerald-600">{price.total} DH</strong>
                </div>
              )}

              <button type="submit" className="sr-btn-primary w-full" disabled={submitting}>
                {submitting ? 'Réservation...' : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-yellow-700 bg-yellow-50 p-3 rounded">Cette voiture n'est pas disponible.</div>
        )}
      </section>
    </main>
  );
}

export default CarDetail;
