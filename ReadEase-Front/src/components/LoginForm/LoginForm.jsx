import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './LoginForm.css';

export default function LoginForm({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();

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
      const { data } = await API.post('/auth/login', { email, password });
      const token = data.token;
      if (!token) {
        throw new Error('No token returned from server');
      }

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

      const payload = decodeJwt(token);
      const userId =
        (payload && (payload.id || payload.userId || payload.sub)) || null;

      localStorage.setItem('token', token);
      if (name) {
        localStorage.setItem('username', name);
      }
      if (userId) {
        localStorage.setItem('userId', userId);
      }

      onLogin(token, name);

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
