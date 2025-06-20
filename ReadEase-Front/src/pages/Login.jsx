import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm   from '../components/LoginForm/LoginForm';
import SignUpForm  from '../components/SignUpForm/SignUpForm';
import './Login.css';

export default function Login({ onLogin }) {
  const location = useLocation();

  return (
    <div className="auth-container">
      {location.pathname === '/login' && (
        <LoginForm onLogin={onLogin} />
      )}
      {location.pathname === '/signup' && (
        <SignUpForm onLogin={onLogin} />
      )}
    </div>
  );
}
