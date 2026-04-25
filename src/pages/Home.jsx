import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService';

function Home() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', max_price: '', search: '' });

  const loadCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.max_price)      params.max_price = filters.max_price;
      if (filters.search)         params.search = filters.search;
      const res = await carService.getAll(params);
      setCars(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

 // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { loadCars(); }, []);

  const statusBadge = (status) => ({
    available:   'success',
    rented:      'danger',
    maintenance: 'warning',
  }[status] || 'secondary');

  const typeLabel = { economy:'Économique', standard:'Standard', luxury:'Luxe', suv:'SUV' };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🚗 Nos voitures disponibles</h2>

      {/* Filtres */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Recherche..."
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}>
                <option value="all">Tous les types</option>
                <option value="economy">Économique</option>
                <option value="standard">Standard</option>
                <option value="luxury">Luxe</option>
                <option value="suv">SUV</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" placeholder="Prix max/jour"
                value={filters.max_price}
                onChange={e => setFilters({...filters, max_price: e.target.value})} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={loadCars}>
                🔍 Filtrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste voitures */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row g-4">
          {cars.map(car => (
            <div className="col-md-4" key={car.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={car.image || `https://via.placeholder.com/400x200?text=${car.brand}+${car.model}`}
                  className="card-img-top" alt={car.model}
                  style={{height:'200px', objectFit:'cover'}} />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{car.brand} {car.model}</h5>
                    <span className={`badge bg-${statusBadge(car.status)}`}>
                      {car.status === 'available' ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="text-muted small mb-1">{car.license_plate}</p>
                  <span className="badge bg-info me-2">{typeLabel[car.type]}</span>
                  <span className="badge bg-secondary">{car.seats} places</span>
                  <p className="text-muted small mt-2">{car.description}</p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <strong className="text-primary fs-5">{car.price_per_day} DH/jour</strong>
                  <Link to={`/cars/${car.id}`} className="btn btn-outline-primary btn-sm">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;