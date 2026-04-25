import React, { useState, useEffect } from 'react';
import carService from '../services/carService';
import reservationService from '../services/reservationService';

function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [cars, setCars]     = useState([]);
  const [tab, setTab]       = useState('stats');
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar]   = useState(null);
  const [form, setForm] = useState({ brand:'', model:'', license_plate:'',
    type:'standard', price_per_day:'', seats:5, description:'' });

  useEffect(() => {
    reservationService.getAdminDashboard().then(r => setStats(r.data));
    carService.getAll().then(r => setCars(r.data));
  }, []);

  const openAdd = () => { setEditCar(null); setForm({ brand:'', model:'', license_plate:'', type:'standard', price_per_day:'', seats:5, description:'' }); setShowForm(true); };
  const openEdit = (car) => { setEditCar(car); setForm({...car}); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editCar) {
      const res = await carService.update(editCar.id, form);
      setCars(cars.map(c => c.id === editCar.id ? res.data : c));
    } else {
      const res = await carService.create(form);
      setCars([res.data, ...cars]);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return;
    await carService.delete(id);
    setCars(cars.filter(c => c.id !== id));
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">⚙️ Dashboard Admin</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['stats','cars','reservations'].map(t => (
          <li className="nav-item" key={t}>
            <button className={`nav-link ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t==='stats'?'📊 Stats':t==='cars'?'🚗 Voitures':'📋 Réservations'}
            </button>
          </li>
        ))}
      </ul>

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="row g-3">
          {[
            {l:'Voitures totales', v:stats.total_cars, c:'primary', i:'🚗'},
            {l:'Disponibles', v:stats.available_cars, c:'success', i:'✅'},
            {l:'Louées', v:stats.rented_cars, c:'danger', i:'🔑'},
            {l:'Réservations', v:stats.total_reservations, c:'info', i:'📋'},
            {l:'En attente', v:stats.pending_reservations, c:'warning', i:'⏳'},
            {l:'Revenus', v:`${stats.total_revenue} DH`, c:'success', i:'💰'},
            {l:'Utilisateurs', v:stats.total_users, c:'secondary', i:'👥'},
          ].map((s,i) => (
            <div className="col-md-3" key={i}>
              <div className={`card border-${s.c}`}>
                <div className="card-body text-center">
                  <div style={{fontSize:'1.8rem'}}>{s.i}</div>
                  <h3 className={`text-${s.c}`}>{s.v}</h3>
                  <small className="text-muted">{s.l}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voitures CRUD */}
      {tab === 'cars' && (
        <>
          <div className="d-flex justify-content-between mb-3">
            <h5>Gestion des voitures</h5>
            <button className="btn btn-success" onClick={openAdd}>+ Ajouter</button>
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h6>{editCar ? 'Modifier' : 'Ajouter'} voiture</h6>
                <form onSubmit={handleSave}>
                  <div className="row g-2">
                    {[['brand','Marque'],['model','Modèle'],['license_plate','Immatriculation']].map(([k,l]) => (
                      <div className="col-md-3" key={k}>
                        <input className="form-control" placeholder={l}
                          value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required />
                      </div>
                    ))}
                    <div className="col-md-2">
                      <select className="form-select" value={form.type}
                        onChange={e => setForm({...form, type:e.target.value})}>
                        <option value="economy">Économique</option>
                        <option value="standard">Standard</option>
                        <option value="luxury">Luxe</option>
                        <option value="suv">SUV</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input type="number" className="form-control" placeholder="Prix/jour"
                        value={form.price_per_day} onChange={e => setForm({...form, price_per_day:e.target.value})} required />
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary w-100">
                        {editCar ? 'Modifier' : 'Créer'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr><th>Marque</th><th>Modèle</th><th>Immat.</th><th>Type</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td><code>{car.license_plate}</code></td>
                  <td>{car.type}</td>
                  <td><strong>{car.price_per_day} DH</strong></td>
                  <td>
                    <span className={`badge bg-${car.status==='available'?'success':car.status==='rented'?'danger':'warning'}`}>
                      {car.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => openEdit(car)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(car.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;