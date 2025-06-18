import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './SignUpForm.css';

export default function SignUpForm({ onLogin }) {
  const [name,            setName]           = useState('');
  const [email,           setEmail]          = useState('');
  const [password,        setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword]= useState('');
  const [error,           setError]          = useState('');
  const [loading,         setLoading]        = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    setError('');
    setLoading(true);
    try {
      await API.post('/users', { name, email, password });
      const { data } = await API.post('/auth/login', { email, password });
      const token = data.token;
      const userName = data.name || data.username || data.user?.name || '';
      localStorage.setItem('token', token);
      userName && localStorage.setItem('username', userName);
      onLogin(token, userName);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>ReadEase - Sign Up</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering…' : 'Sign Up'}
        </button>
      </form>

      <p className="switch-link">
        Already have an account?{' '}
        <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
