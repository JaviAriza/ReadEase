// ReadEase-Front/src/pages/Store.jsx
import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import API from '../services/api';
import './Store.css';

export default function Store() {
  // Estados para manejar lista de libros, búsqueda, loading, error y mensaje de estado
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Mensaje de éxito/error al añadir al carrito

  // Array de colores para el icono del libro
  const iconColors = [
    '#E27D60', // terracota suave
    '#8589CB', // lila suave
    '#41B3A3', // turquesa
    '#F8B195', // rosa pastel
    '#E8A87C', // melocotón
    '#C38D9E', // lila más oscuro
    '#85DCB0', // verde menta
    '#F67280'  // salmón
  ];

  // Al montar el componente: traemos la lista de libros del backend
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get('/books');
        setBooks(response.data);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filtrar libros por término de búsqueda
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Decodifica el JWT (soporta Base64URL) y devuelve el payload como objeto.
   */
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

  /**
   * Obtiene el userId del JWT almacenado en localStorage.
   * Revisa payload.id, payload.userId o payload.sub.
   */
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return (payload && (payload.id || payload.userId || payload.sub)) || null;
  };

  /**
   * Maneja añadir un libro al carrito (requiere token en encabezado):
   * 1. Obtiene userId del JWT.
   * 2. Llama a GET /carts y filtra para encontrar el carrito propio.
   * 3. Si no existe, crea uno vía POST /carts y “fallback” vuelve a leer /carts para localizar su ID.
   * 4. Finalmente, hace POST /cart-items con el cartId correcto.
   */
  const handleAddToCart = async (bookId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setMessage('You must be logged in to add to cart.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add to cart.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      // 1) Hacemos GET /carts con Authorization
      const cartsResponse = await API.get('/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2) Filtramos localmente para encontrar el carrito del userId
      const existingCart = cartsResponse.data.find(
        (c) => c.user_id === userId
      );

      let cartId;

      if (existingCart) {
        // Si lo encontramos, tomamos su id
        cartId = existingCart.id;
      } else {
        // Si no existe, lo creamos
        const createCartResponse = await API.post(
          '/carts',
          { user_id: userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Intentamos leer el id directamente de la respuesta
        cartId = createCartResponse.data.id;

        // Si el backend NO nos devolvió `id` en createCartResponse.data, hacemos fallback:
        if (!cartId) {
          // Volvemos a leer todos los carritos y buscamos el que acabamos de crear
          const allCarts = await API.get('/carts', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const newCart = allCarts.data.find((c) => c.user_id === userId);
          cartId = newCart?.id || null;
        }
      }

      // 3) Si aún no tenemos cartId válido, lanzamos error
      if (!cartId) {
        throw new Error('Could not determine cart ID');
      }

      // 4) Con cartId correcto, añadimos el libro al carrito
      await API.post(
        '/cart-items',
        {
          cart_id: cartId,
          book_id: bookId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Book added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setMessage('Error adding book to cart.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="store-container">
      {/* -------- Barra de búsqueda -------- */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* -------- Mensaje de estado (éxito/error) -------- */}
      {message && <p className="status-message">{message}</p>}

      {/* -------- Lista de libros -------- */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <div className="vertical-list">
              {filteredBooks.map((book) => {
                const randomColor =
                  iconColors[Math.floor(Math.random() * iconColors.length)];
                return (
                  <div key={book.id} className="book-item">
                    {/* Icono de libro con color aleatorio */}
                    <div className="book-cover">
                      <FaBook size={48} color={randomColor} />
                    </div>

                    {/* Contenido: bloque de texto, precio y botón */}
                    <div className="book-content">
                      {/* Bloque de título + autor */}
                      <div className="book-text">
                        <span className="book-title">{book.title}</span>
                        <span className="book-author">by {book.author}</span>
                      </div>

                      {/* Precio */}
                      <span className="book-price">
                        ${parseFloat(book.price).toFixed(2)}
                      </span>

                      {/* Botón para añadir al carrito */}
                      <button
                        onClick={() => handleAddToCart(book.id)}
                        className="action-button"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
