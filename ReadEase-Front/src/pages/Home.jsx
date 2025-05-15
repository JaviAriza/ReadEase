import React from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <Header /> 
      
      <div className="content">
        <header className="header">
          <h1 className="logo">ReadEase</h1>
        </header>

        <div className="buttons-container">
          <button className="home-button">Store</button>
          <button className="home-button">My Books</button>
          <button className="home-button">Configuration</button>
        </div>
      </div>
      
      <Footer />  
    </div>
  );
}
