import React from 'react';
import Footer from '../components/Footer/Footer'; 
import './Home.css';
import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <div className="home-container">
      
      
      <div className="content">
        <header className="header">
          <h1 className="logo">ReadEase</h1>
        </header>

        <div className="buttons-container">
          <Link to="/store" className="home-button">
            Store
          </Link>
          <Link to="/my-books" className="home-button">
            My Books
          </Link>
          <Link to="/config" className="home-button">
            Configuration
          </Link>
        </div>
      </div>
      
      <Footer />  
    </div>
  );
}
