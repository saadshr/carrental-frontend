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

  const field = (label, name, type='text') => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input type={type} className={`form-control ${errors[name] ? 'is-invalid':''}`}
        value={form[name]}
        onChange={e => setForm({...form, [name]: e.target.value})} />
      {errors[name] && <div className="invalid-feedback">{errors[name][0]}</div>}
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">📝 Créer un compte</h3>
              <form onSubmit={handleSubmit}>
                {field('Nom complet', 'name')}
                {field('Email', 'email', 'email')}
                {field('Mot de passe', 'password', 'password')}
                {field('Téléphone', 'phone', 'tel')}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Création...' : "S'inscrire"}
                </button>
              </form>
              <p className="text-center mt-3">
                Déjà un compte ? <Link to="/login">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
