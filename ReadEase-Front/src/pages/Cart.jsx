// src/pages/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div className="page-container">
      <h1 className="page-title">Cart</h1>
      <p className="page-text">Your selected books will appear here.</p>
      <Link to="/" className="link-back">Go back Home</Link>
    </div>
  );
}
