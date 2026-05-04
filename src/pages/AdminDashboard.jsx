import React, { useState, useEffect } from 'react';
import carService from '../services/carService';
import reservationService from '../services/reservationService';

const statusClass = {
  available: 'sr-badge-success',
  rented: 'sr-badge-warning',
  maintenance: 'sr-badge-danger',
  pending: 'sr-badge-warning',
  confirmed: 'sr-badge-success',
  cancelled: 'sr-badge-neutral',
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tab, setTab] = useState('stats');
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState({
    brand: '', model: '', license_plate: '', type: 'standard',
    price_per_day: '', seats: 5, description: '', image: '', status: 'available',
  });

  const load = async () => {
    const [statsRes, carsRes, reservationsRes] = await Promise.all([
      reservationService.getAdminDashboard(),
      carService.getAll(),
      reservationService.getAllReservations(),
    ]);
    setStats(statsRes.data);
    setCars(carsRes.data);
    setReservations(reservationsRes.data);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditCar(null);
    setForm({ brand: '', model: '', license_plate: '', type: 'standard', price_per_day: '', seats: 5, description: '', image: '', status: 'available' });
    setShowForm(true);
  };

  const openEdit = (car) => {
    setEditCar(car);
    setForm({ ...car });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, seats: Number(form.seats), price_per_day: Number(form.price_per_day) };
    if (editCar) {
      const res = await carService.update(editCar.id, payload);
      setCars(cars.map(c => c.id === editCar.id ? res.data : c));
    } else {
      const res = await carService.create(payload);
      setCars([res.data, ...cars]);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return;
    await carService.delete(id);
    setCars(cars.filter(c => c.id !== id));
  };

  const handleConfirm = async (id) => {
    await reservationService.confirm(id);
    await load();
  };

  const availabilityRate = stats ? Math.round((stats.available_cars / Math.max(stats.total_cars, 1)) * 100) : 0;
  const rentedRate = stats ? Math.round((stats.rented_cars / Math.max(stats.total_cars, 1)) * 100) : 0;

  return (
    <main className="sr-page">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">SaadRent BI</p>
          <h1 className="sr-section-title mt-2">Dashboard Admin</h1>
          <p className="sr-section-subtitle">Pilotage du parc automobile, des revenus et des réservations.</p>
        </div>
        <button onClick={openAdd} className="sr-btn-primary">Ajouter une voiture</button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ['stats', 'Vue BI'],
          ['cars', 'Voitures'],
          ['reservations', 'Réservations'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={tab === key ? 'sr-btn-primary' : 'sr-btn-secondary'}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Voitures totales', stats.total_cars, 'Parc actif'],
              ['Disponibles', stats.available_cars, `${availabilityRate}% du parc`],
              ['Réservations', stats.total_reservations, `${stats.pending_reservations} en attente`],
              ['Revenus', `${stats.total_revenue} DH`, `${stats.total_users} clients`],
            ].map(([label, value, hint], index) => (
              <div key={label} className="sr-kpi" style={{ animationDelay: `${index * 70}ms` }}>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <div className="mt-3 text-3xl font-black text-slate-950">{value}</div>
                <p className="mt-2 text-xs font-medium text-slate-400">{hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="sr-panel p-5 lg:col-span-5">
              <h2 className="text-lg font-bold text-slate-900">Occupation du parc</h2>
              <p className="mb-6 text-sm text-slate-500">Disponibilité et voitures louées.</p>
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
                    <span>Disponibles</span><span>{availabilityRate}%</span>
                  </div>
                  <div className="sr-progress-track"><div className="sr-progress-fill" style={{ width: `${availabilityRate}%` }} /></div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
                    <span>Louées</span><span>{rentedRate}%</span>
                  </div>
                  <div className="sr-progress-track"><div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${rentedRate}%` }} /></div>
                </div>
              </div>
            </section>

            <section className="sr-panel overflow-hidden lg:col-span-7">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900">Dernières réservations</h2>
                <p className="text-sm text-slate-500">Suivi opérationnel récent.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="sr-table">
                  <thead>
                    <tr><th>Client</th><th>Voiture</th><th>Statut</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {stats.recent_reservations.map(r => (
                      <tr key={r.id}>
                        <td>{r.user?.name || '-'}</td>
                        <td className="font-semibold">{r.car?.brand} {r.car?.model}</td>
                        <td><span className={statusClass[r.status] || 'sr-badge-neutral'}>{r.status}</span></td>
                        <td className="font-bold text-emerald-700">{r.total_price} DH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}

      {tab === 'cars' && (
        <section className="sr-panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gestion des voitures</h2>
              <p className="text-sm text-slate-500">{cars.length} véhicules enregistrés.</p>
            </div>
            <button onClick={openAdd} className="sr-btn-primary">Ajouter</button>
          </div>

          {showForm && (
            <div className="border-b border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 font-bold text-slate-900">{editCar ? 'Modifier la voiture' : 'Ajouter une voiture'}</h3>
              <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <input className="sr-input" placeholder="Marque" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
                <input className="sr-input" placeholder="Modèle" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
                <input className="sr-input" placeholder="Immatriculation" value={form.license_plate} onChange={e => setForm({ ...form, license_plate: e.target.value })} required />
                <select className="sr-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="economy">Économique</option>
                  <option value="standard">Standard</option>
                  <option value="luxury">Luxe</option>
                  <option value="suv">SUV</option>
                </select>
                <input type="number" className="sr-input" placeholder="Prix/jour" value={form.price_per_day} onChange={e => setForm({ ...form, price_per_day: e.target.value })} required />
                <input type="number" className="sr-input" placeholder="Places" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} />
                <select className="sr-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="available">Disponible</option>
                  <option value="rented">Louée</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <input className="sr-input" placeholder="Image URL" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} />
                <textarea className="sr-input md:col-span-3" placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                <button type="submit" className="sr-btn-primary">{editCar ? 'Modifier' : 'Créer'}</button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="sr-table">
              <thead>
                <tr><th>Voiture</th><th>Immat.</th><th>Type</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id}>
                    <td><span className="font-bold text-slate-900">{car.brand} {car.model}</span></td>
                    <td><code>{car.license_plate}</code></td>
                    <td>{car.type}</td>
                    <td className="font-bold text-emerald-700">{car.price_per_day} DH</td>
                    <td><span className={statusClass[car.status] || 'sr-badge-neutral'}>{car.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="sr-btn-secondary px-3 py-1" onClick={() => openEdit(car)}>Modifier</button>
                        <button className="sr-btn-danger px-3 py-1" onClick={() => handleDelete(car.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'reservations' && (
        <section className="sr-panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Réservations</h2>
            <p className="text-sm text-slate-500">{reservations.length} opérations enregistrées.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="sr-table">
              <thead>
                <tr><th>Client</th><th>Voiture</th><th>Période</th><th>Prix</th><th>Statut</th><th>Action</th></tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td>{r.user?.name || '-'}</td>
                    <td className="font-semibold">{r.car?.brand} {r.car?.model}</td>
                    <td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                    <td className="font-bold text-emerald-700">{r.total_price} DH</td>
                    <td><span className={statusClass[r.status] || 'sr-badge-neutral'}>{r.status}</span></td>
                    <td>
                      {r.status === 'pending' ? (
                        <button className="sr-btn-primary px-3 py-1" onClick={() => handleConfirm(r.id)}>Confirmer</button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">Aucune</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default AdminDashboard;
