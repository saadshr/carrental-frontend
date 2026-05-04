import React, { useState, useEffect } from 'react';
import carService from '../services/carService';
import CarCard from '../components/CarCard';

function Home() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    setLoading(true);
    try {
      const res = await carService.getAll();
      setCars(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">🚗 Nos voitures disponibles</h2>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;