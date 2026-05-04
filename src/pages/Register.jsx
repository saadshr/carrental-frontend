import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name:'', email:'', password:'', phone:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authService.register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="sr-page flex min-h-[70vh] items-center justify-center">
      <div className="sr-panel w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="sr-logo-mark mx-auto mb-3">SR</span>
          <h1 className="text-2xl font-black text-slate-950">Créer un compte</h1>
          <p className="mt-1 text-sm text-slate-500">Rejoignez SaadRent et réservez plus vite.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nom complet</label>
          <input className={`sr-input mb-4 ${errors.name ? 'ring-rose-300 ring-1':''}`}
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />

          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input type="email" className={`sr-input mb-4 ${errors.email ? 'ring-rose-300 ring-1':''}`}
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

          <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
          <input type="password" className={`sr-input mb-4 ${errors.password ? 'ring-rose-300 ring-1':''}`}
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

          <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
          <input type="tel" className={`sr-input mb-5 ${errors.phone ? 'ring-rose-300 ring-1':''}`}
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />

          <button type="submit" className="sr-btn-primary w-full" disabled={loading}>
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Déjà un compte ? <Link to="/login" className="text-emerald-600">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
