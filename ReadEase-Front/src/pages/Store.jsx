// src/pages/Store.jsx
import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import API from '../services/api';
import './Store.css';

export default function Store() {
  // Estados para manejar lista de libros, búsqueda, loading y error general
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error(err);
        setError('Error al cargar los libros. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filtrar los libros por título (searchTerm)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store-container">
      {/* Buscador */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Busca un libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Estado de carga y error */}
      {loading && <p className="status-message">Cargando libros…</p>}
      {error && <p className="status-message error">{error}</p>}

      {/* Lista vertical compacta */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <p className="status-message">No se encontraron libros.</p>
          ) : (
            <div className="vertical-list">
              {filteredBooks.map((book, index) => {
                // Seleccionar color del icono según índice
                const iconColor = iconColors[index % iconColors.length];
                return (
                  <div key={book.id} className="book-item">
                    <div className="book-cover">
                      <FaBook style={{ color: iconColor, fontSize: '24px' }} />
                    </div>
                    <div className="book-content">
                      <span className="book-title">{book.title}</span>
                      <span className="book-author">por {book.author}</span>
                      <span className="book-price">{book.price}</span>
                    </div>
                    <a
                      href={book.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button"
                    >
                      Leer PDF
                    </a>
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
