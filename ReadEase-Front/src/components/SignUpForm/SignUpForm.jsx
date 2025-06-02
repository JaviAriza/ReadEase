// src/components/SignUpForm/SignUpForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api'; // Ajusta la ruta según tu cliente HTTP (Axios, fetch, etc.)

export default function SignUpForm({ onLogin }) {
  const [name,            setName]           = useState('');
  const [email,           setEmail]          = useState('');
  const [password,        setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword]= useState('');
  const [error,           setError]          = useState(null);
  const [loading,         setLoading]        = useState(false);
  const navigate = useNavigate();

  // Validación básica de email
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones previas
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1) Creamos el usuario
      await API.post('/users', { name, email, password });

      // 2) Iniciamos sesión automáticamente
      const { data } = await API.post('/auth/login', { email, password });
      const { token, name: loggedName } = data;

      // Guardamos token y username en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', loggedName);

      // Avisamos a Root/App para actualizar estado global
      onLogin(token, loggedName);

      // Redirigimos a Home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn-primary">
          {loading ? 'Registering…' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600">
          Sign In
        </Link>
      </p>
    </div>
  );
}
