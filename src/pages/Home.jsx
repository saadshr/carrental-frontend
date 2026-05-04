import React, { useState, useEffect } from 'react';
import carService from '../services/carService';
import CarCard from '../components/CarCard';

function Home() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const loadCars = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await carService.getAll();
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setError(
        e.response?.data?.message ||
        e.message ||
        'Impossible de charger les voitures. Vérifiez que le backend Laravel est démarré.'
      );
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, []);

  return (
    <main className="sr-page">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Catalogue SaadRent</p>
          <h1 className="sr-section-title mt-2">Nos voitures disponibles</h1>
          <p className="sr-section-subtitle">Choisissez un véhicule, vérifiez sa disponibilité et réservez en quelques clics.</p>
        </div>
        <div className="sr-panel px-4 py-3 text-sm font-semibold text-slate-600">
          {cars.length} véhicules dans le parc
        </div>
      </div>

      {loading ? (
        <div className="sr-panel p-10 text-center text-slate-500">Chargement...</div>
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      ) : cars.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          Aucune voiture disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;
