import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBookOpen, FaCog } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  return (
    <main className="home-container">
      {/* Logo como texto */}
      <h1 className="home-logo-text">ReadEase</h1>

      {/* Tarjetas con React Icons */}
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