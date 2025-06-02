// src/components/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api'; // Ajusta la ruta según tu cliente HTTP (Axios, fetch, etc.)

export default function LoginForm({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada al endpoint de login: esperamos { token, name }
      const { data } = await API.post('/auth/login', { email, password });
      const { token, name } = data;

      // Guardamos token y username en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);

      // Avisamos a Root/App para actualizar estado global
      onLogin(token, name);

      // Redirigimos a Home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-form-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Not registered?{' '}
        <Link to="/signup" className="text-indigo-600">
          Register here
        </Link>
      </p>
    </div>
  );
}
