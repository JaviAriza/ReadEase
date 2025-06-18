// ReadEase-Front/src/pages/MyBooks.jsx
import React, { useState, useEffect } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import API from '../services/api';
import './MyBooks.css';

export default function MyBooks() {
  const [books, setBooks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');

  // Trae mis libros
  const fetchMyBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/user-books/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setError('Error loading your books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Creamos y ejecutamos la función asíncrona, sin devolverla
    fetchMyBooks();
  }, []); // <-- solo al montar

  // Lista de autores únicos ordenados
  const authors = Array.from(new Set(books.map(b => b.author))).sort();

  // Filtrado por autor y por búsqueda
  const filtered = books
    .filter(b => !selectedAuthor || b.author === selectedAuthor)
    .filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="mybooks-container">
      <h2>My Books</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && books.length === 0 && <p>You have no books yet.</p>}

      <div className="mybooks-content">
        <aside className="sidebar">
          <h3>Authors</h3>
          <ul>
            <li
              className={!selectedAuthor ? 'active' : ''}
              onClick={() => setSelectedAuthor(null)}
            >All</li>
            {authors.map(author => (
              <li
                key={author}
                className={selectedAuthor === author ? 'active' : ''}
                onClick={() => setSelectedAuthor(author)}
              >
                {author}
              </li>
            ))}
          </ul>
        </aside>

        <div className="main-area">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="books-list">
            {filtered.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                </div>
                <button
                  className="read-button"
                  onClick={() => window.open(book.pdf_url, '_blank')}
                >
                  <FaBookOpen /> Read
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
