// ReadEase-Front/src/components/Header/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaMoon, FaSun } from 'react-icons/fa';
import './Header.css';

export default function Header({
  isLoggedIn,
  username,
  onLogout,
  toggleTheme,
  currentTheme,
}) {
  const location = useLocation();
  const isOnStorePage = location.pathname === '/store';
  const ThemeIcon = currentTheme === 'light' ? FaMoon : FaSun;

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo-link">
          <h1 className="header__logo">ReadEase</h1>
        </Link>
      </div>

      <nav className="header__nav">
        {isLoggedIn ? (
          <>
            <button className="header__nav-button" onClick={onLogout}>
              {username} (Logout)
            </button>
            {isOnStorePage && (
              <Link to="/cart" className="header__cart-button">
                <FaShoppingCart size={20} />
              </Link>
            )}
          </>
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
        <button
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <ThemeIcon size={20} />
        </button>
      </nav>
    </header>
);
}
