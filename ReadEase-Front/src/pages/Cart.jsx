// ReadEase-Front/src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import API from '../services/api';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Decodifica JWT y devuelve payload
  const decodeJwt = (token) => {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => ('%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Extrae userId del token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return (payload && (payload.id || payload.userId || payload.sub)) || null;
  };

  // Carga ítems del carrito
  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('You must be logged in to view your cart.');
        return;
      }
      const token = localStorage.getItem('token');
      const cartsRes = await API.get('/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userCart = cartsRes.data.find(c => c.user_id === userId);
      if (!userCart) {
        setCartItems([]);
        return;
      }
      const itemsRes = await API.get(`/cart-items?cart_id=${userCart.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(itemsRes.data);
    } catch (err) {
      console.error(err);
      setError('Error loading cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Suma precios
  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + (parseFloat(item.book.price) || 0), 0);

  // Elimina un ítem del carrito
  const handleRemove = async (itemId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/cart-items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error(err);
      setError('Error removing item.');
    } finally {
      setLoading(false);
    }
  };

  // Maneja el pago
  const handlePay = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(
        '/carts/pay',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems([]);
      setMessage(res.data.message || 'Purchase completed successfully!');
    } catch (err) {
      console.error(err);
      setError('Error processing payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {loading && <p>Loading...</p>}
      {error   && <p className="cart-error">{error}</p>}
      {message && <p className="cart-message">{message}</p>}

      {!loading && cartItems.length === 0 && !message && (
        <p>Your cart is empty.</p>
      )}

      {!loading && cartItems.length > 0 && (
        <>
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-left">
                  <div className="cart-item-title">{item.book.title}</div>
                  <div className="cart-item-author">by {item.book.author}</div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">
                    ${parseFloat(item.book.price).toFixed(2)}
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.id)}
                    disabled={loading}
                    style={{ marginLeft: '8px' }}
                  >
                    <FaTrash style={{ color: 'red' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              Total: ${calculateTotal().toFixed(2)}
            </div>
            <button
              className="pay-button"
              onClick={handlePay}
              disabled={loading}
            >
              Pay
            </button>
          </div>

          {/* Botón pegado al footer */}
          <div className="cart-footer">
            <button
              className="back-button"
              onClick={() => navigate('/store')} // ahora va a la tienda
              disabled={loading}
            >
              Back to Store
            </button>
          </div>
        </>
      )}
    </div>
  );
}
