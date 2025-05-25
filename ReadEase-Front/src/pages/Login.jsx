import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import SignUpForm from '../components/SignUpForm/SignUpForm';

const Login = () => {
  const location = useLocation();

  return (
    <div className="auth-container min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {location.pathname === '/login' && (
      <div className="">
        <LoginForm />
      </div>
      )}
      {location.pathname === '/signup' && (
      <div className="">
        <SignUpForm />
      </div>
      )}
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
