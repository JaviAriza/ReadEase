import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ isLoggedIn, username, onLogout }) {
  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo-link">
          <h1 className="header__logo">ReadEase</h1>
        </Link>
      </div>
      <nav className="header__nav">
        {isLoggedIn ? (
          <button className="header__nav-button" onClick={onLogout}>
            {username} (Logout)
          </button>
        ) : (
          <>
            <Link to="/login" className="header__nav-link">
              Login
            </Link>
            <Link to="/signup" className="header__nav-link">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
