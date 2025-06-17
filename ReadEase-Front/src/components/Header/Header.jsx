// ReadEase-Front/src/components/Header/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import API from '../../services/api';  // ajusta ruta si difiere
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

  // Badge y popup
  const [cartCount, setCartCount] = useState(0);
  const [popup, setPopup]         = useState(null);

  // Decodificador JWT para extraer userId
  const decodeJwt = (token) => {
    try {
      let base64 = token.split('.')[1]
        .replace(/-/g,'+').replace(/_/g,'/');
      while (base64.length % 4) base64 += '=';
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return payload && (payload.id || payload.userId || payload.sub);
  };

  // 1) Escucha eventos de add/remove
  useEffect(() => {
    const onCartUpdated = (e) => {
      setCartCount(e.detail.count);
    };
    const onCartPopup = (e) => {
      setPopup({ ...e.detail });
      setTimeout(() => setPopup(null), 3000);
    };

    window.addEventListener('cart-updated', onCartUpdated);
    window.addEventListener('cart-popup',   onCartPopup);

    return () => {
      window.removeEventListener('cart-updated', onCartUpdated);
      window.removeEventListener('cart-popup',   onCartPopup);
    };
  }, []);

  // 2) Al cambiar de ruta (o al montar), recarga el recuento desde el servidor
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }
      const userId = getUserIdFromToken();
      if (!userId) {
        setCartCount(0);
        return;
      }
      try {
        // 2.1) Obtén el carrito del usuario
        const cartsResp = await API.get('/carts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cart = cartsResp.data.find(c => c.user_id === userId);
        if (!cart) {
          setCartCount(0);
          return;
        }

        // 2.2) Obtén items de ese carrito
        const itemsResp = await API.get('/cart-items', {
          params:    { cart_id: cart.id },
          headers:   { Authorization: `Bearer ${token}` },
        });
        setCartCount(itemsResp.data.length);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };

    fetchCartCount();
  }, [location.pathname, isLoggedIn]);

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
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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

      {popup && (
        <div className={`cart-popup ${popup.type}`}>
          {popup.type === 'success' ? (
            <FaCheckCircle size={20} />
          ) : (
            <FaTimesCircle size={20} />
          )}
          <span>{popup.message}</span>
        </div>
      )}
    </header>
  );
}
