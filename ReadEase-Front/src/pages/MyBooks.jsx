import React, { useState, useEffect } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import API from '../services/api';
import './MyBooks.css';

export default function MyBooks() {
  const [books, setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Fetch de mis libros
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
    fetchMyBooks();
  }, []);

  return (
    <div className="mybooks-container">
      <h2>My Books</h2>

      {loading && <p>Loading...</p>}
      {error   && <p className="error">{error}</p>}
      {!loading && books.length === 0 && <p>You have no books yet.</p>}

      <div className="books-list">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
            </div>
            <button
              className="read-button"
              onClick={() => window.open(book.pdf_url, '_blank')}
            >
              <FaBookOpen style={{ marginRight: '6px' }}/>
              Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
