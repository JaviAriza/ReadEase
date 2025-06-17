// src/pages/Home.jsx

import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBookOpen, FaCog } from 'react-icons/fa';

export default function Home() {
  useEffect(() => {
    // Al montar Home: quitamos scroll en html, body y #root
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (root) root.style.overflow = 'hidden';

    // Al desmontar Home: restauramos overflow
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  return (
    <main className="home-container full-screen">
      <h1 className="home-logo-text">ReadEase</h1>
      <div className="cards-grid">
        <Link to="/store" className="card">
          <FaShoppingCart className="card-icon" />
          <span className="card-label">Store</span>
        </Link>
        <Link to="/my-books" className="card">
          <FaBookOpen className="card-icon" />
          <span className="card-label">My Books</span>
        </Link>
        <Link to="/config" className="card">
          <FaCog className="card-icon" />
          <span className="card-label">Configuration</span>
        </Link>
      </div>
    </main>
  );
}
