import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ isLoggedIn, username, onLogout }) {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">ReadEase</h1>
        </Link>
      </div>

      <nav className="nav">
        {isLoggedIn ? (
          <button className="nav-link" onClick={onLogout}>
            {username} (Logout)
          </button>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
