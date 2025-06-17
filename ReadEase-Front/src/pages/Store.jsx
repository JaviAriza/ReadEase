import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import API from '../services/api';
import './Store.css';

export default function Store() {
  // ── Estados básicos ───────────────────────────────────────────
  const [books, setBooks]           = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ── Paginación ─────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ── Desactivar scroll global al montar y restaurar al desmontar ──
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (root) root.style.overflow = 'hidden';

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  // ── Fetch de libros ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await API.get('/books');
        setBooks(resp.data);
      } catch {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Resetear página al cambiar búsqueda o lista de libros ───────
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, books]);

  // ── Filtrado y paginado ────────────────────────────────────────
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  // ── JWT + carrito ─────────────────────────────────────────────
  const decodeJwt = (token) => {
    try {
      let payload = token.split('.')[1]
        .replace(/-/g, '+').replace(/_/g, '/');
      while (payload.length % 4) payload += '=';
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };
  const getUserIdFromToken = () => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    const pl = decodeJwt(t);
    return pl && (pl.id || pl.userId || pl.sub);
  };

  const handleAddToCart = async (bookId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      window.dispatchEvent(new CustomEvent('cart-popup', {
        detail: { message: 'You must be logged in to add to cart.', type: 'error' }
      }));
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new CustomEvent('cart-popup', {
        detail: { message: 'You must be logged in to add to cart.', type: 'error' }
      }));
      return;
    }
    try {
      // 1) Leer o crear carrito
      const cartsResp = await API.get('/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      let cart = cartsResp.data.find(c => c.user_id === userId);
      if (!cart) {
        const createResp = await API.post(
          '/carts',
          { user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        cart = { id: createResp.data.id };
      }
      const cartId = cart.id;
      if (!cartId) throw new Error('No cart ID');

      // 2) Añadir item
      await API.post(
        '/cart-items',
        { cart_id: cartId, book_id: bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3) Volver a leer recuento de items
      const itemsResp = await API.get('/cart-items', {
        params: { cart_id: cartId },
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = itemsResp.data.length;

      // 4) Emitir eventos
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count } }));
      window.dispatchEvent(new CustomEvent('cart-popup', {
        detail: { message: 'Book added to cart successfully!', type: 'success' }
      }));
    } catch {
      window.dispatchEvent(new CustomEvent('cart-popup', {
        detail: { message: 'Error adding book to cart.', type: 'error' }
      }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="store-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filtered.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <>
          <div className="vertical-list">
            {pageItems.map(book => (
              <div key={book.id} className="book-item">
                <div className="book-cover">
                  <FaBook className="book-icon" size={48} />
                </div>
                <div className="book-content">
                  <div className="book-text">
                    <span className="book-title">{book.title}</span>
                    <span className="book-author">by {book.author}</span>
                  </div>
                  <span className="book-price">
                    ${parseFloat(book.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className="action-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              « Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={p === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next »
            </button>
          </div>
        </>
      )}
    </div>
  );
}
