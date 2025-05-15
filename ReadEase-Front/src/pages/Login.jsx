import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import './Login.css';

const Login = () => {
  const location = useLocation();

  return (
    <div className="auth-container">
      {location.pathname === '/login' && <LoginForm />}
      {location.pathname === '/signup' && <SignUpForm />}
      <div className="auth-switch">
        {location.pathname === '/login' ? (
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        ) : (
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
