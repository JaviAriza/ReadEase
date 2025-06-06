// ReadEase-Front/src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // [{ id, cart_id, book_id, book: { title, author, price, ... } }, ...]
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Decodifica un JWT (Base64URL) y devuelve el payload como objeto.
  const decodeJwt = (token) => {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  // Obtiene el userId desde el JWT en localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return (payload && (payload.id || payload.userId || payload.sub)) || null;
  };

  // Recupera el cartId del usuario (GET /carts?user_id=<userId>) y luego los cart-items
  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('You must be logged in to view your cart.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      // 1) GET /carts
      const cartsResponse = await API.get('/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filtramos para obtener el carrito de este userId
      const userCart = cartsResponse.data.find((c) => c.user_id === userId);
      if (!userCart) {
        // Si no existe carrito, dejamos lista vacía
        setCartItems([]);
        setLoading(false);
        return;
      }

      const cartId = userCart.id;

      // 2) GET /cart-items?cart_id=<cartId>
      const itemsResponse = await API.get(`/cart-items?cart_id=${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Se asume que cada item trae su campo 'book' embebido
      setCartItems(itemsResponse.data);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Error loading cart.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto que corre al montar para obtener los items del carrito
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calcula total sumando price de cada book
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.book.price) || 0;
      return sum + price;
    }, 0);
  };

  // Maneja el pago: crea una orden y sus order_items, luego borra los cart_items
  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('You must be logged in to pay.');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');

      // 1) POST /orders { user_id: <userId> }
      const createOrderResponse = await API.post(
        '/orders',
        { user_id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Asumimos que la respuesta incluye al menos { id: <orderId> }
      let orderId = createOrderResponse.data.id;
      // Si no viene `id`, hacemos fallback:
      if (!orderId) {
        // Podríamos lanzar error, o buscar la última orden del usuario:
        // Aquí abortamos para simplificar:
        throw new Error('Order ID not returned by server.');
      }

      // 2) Para cada cart_item, creamos un order_item
      for (const item of cartItems) {
        await API.post(
          '/order-items',
          {
            order_id: orderId,
            book_id: item.book_id,
            // Podrías incluir cantidad u otro campo si tu orden lo soporta
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // 3) Una vez creados todos los order_items, borramos cada cart_item:
      for (const item of cartItems) {
        await API.delete(`/cart-items/${item.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // 4) Vaciar estado local y mostrar éxito
      setCartItems([]);
      setMessage('Payment successful! Your order has been placed.');
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Error processing payment.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="cart-error">{error}</p>}
      {message && <p className="cart-message">{message}</p>}

      {!loading && cartItems.length === 0 && !message && (
        <p>Your cart is empty.</p>
      )}

      {!loading && cartItems.length > 0 && (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-left">
                  <div className="cart-item-title">{item.book.title}</div>
                  <div className="cart-item-author">
                    by {item.book.author}
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">
                    ${parseFloat(item.book.price).toFixed(2)}
                  </div>
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
        </>
      )}
    </div>
  );
}
