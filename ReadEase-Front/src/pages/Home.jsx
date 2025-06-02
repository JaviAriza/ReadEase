// src/pages/Home.jsx
import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      
      <main className="home-main">
        <img
          src="https://res.cloudinary.com/dnjosjzrj/image/upload/v1747910618/Adobe_Express_-_file_coii59.png"
          alt="Logo ReadEase"
          style={{ width: '128px', height: '128px', marginBottom: '32px' }}
        />
        <div className="buttons-container">
          <Link to="/store" className="card">
            <span className="card-icon">📚</span>
            <span className="card-label">Store</span>
          </Link>

          <Link to="/my-books" className="card">
            <span className="card-icon">📖</span>
            <span className="card-label">My books</span>
          </Link>

          <Link to="/config" className="card">
            <span className="card-icon">⚙️</span>
            <span className="card-label">Configuration</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
