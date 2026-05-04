import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sr-page flex min-h-[70vh] items-center justify-center">
      <div className="sr-panel w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="sr-logo-mark mx-auto mb-3">SR</span>
          <h1 className="text-2xl font-black text-slate-950">Connexion SaadRent</h1>
          <p className="mt-1 text-sm text-slate-500">Accédez à vos réservations et à votre espace personnel.</p>
        </div>
        {error && <div className="text-red-600 bg-red-50 p-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input type="email" className="sr-input mb-4"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required />

          <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
          <input type="password" className="sr-input mb-5"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            required />

          <button type="submit" className="sr-btn-primary w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Pas de compte ? <Link to="/register" className="text-emerald-600">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
