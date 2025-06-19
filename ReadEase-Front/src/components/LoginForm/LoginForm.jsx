// ReadEase-Front/src/components/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './LoginForm.css';

export default function LoginForm({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();

  // Decodifica un JWT (Base64URL) y devuelve el payload como objeto
  const decodeJwt = (token) => {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Hacemos POST /auth/login con email/password
      //    El backend debe devolver al menos: { token: '...', user: { id, username, ... } }
      const { data } = await API.post('/auth/login', { email, password });
      const token = data.token;
      if (!token) {
        throw new Error('No token returned from server');
      }

      // 2) Sacamos el nombre de usuario de donde lo devuelva el backend:
      //    Primero comprobamos data.user.username, data.user.name, data.name, data.username, etc.
      let name = '';
      if (data.name) {
        name = data.name;
      } else if (data.username) {
        name = data.username;
      } else if (data.user && (data.user.username || data.user.name)) {
        name = data.user.username || data.user.name;
      } else {
        name = '';
      }

      // 3) Decodificamos el JWT para extraer el userId (payload.id, payload.userId o payload.sub)
      const payload = decodeJwt(token);
      const userId =
        (payload && (payload.id || payload.userId || payload.sub)) || null;

      // 4) Guardamos en localStorage: token, username y userId
      localStorage.setItem('token', token);
      if (name) {
        localStorage.setItem('username', name);
      }
      if (userId) {
        localStorage.setItem('userId', userId);
      }

      // 5) Avisamos a App.jsx para que actualice su estado global
      onLogin(token, name);

      // 6) Redirigimos a Home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
  <div className="login-form">
    <h2>ReadEase - Login</h2>
    {error && <p className="error">{error}</p>}
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
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
    <p className="switch-link">
      Not registered?{' '}
      <Link to="/signup">Register here</Link>
    </p>
  </div>
);

}
