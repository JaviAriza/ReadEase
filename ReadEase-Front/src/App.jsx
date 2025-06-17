import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Config from './pages/Config';
import MyBooks from './pages/MyBooks';
import ReadMode from './pages/ReadMode';
import Store from './pages/Store';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [token, setToken]       = useState(null);
  const [username, setUsername] = useState(null);
  const [theme, setTheme]       = useState('light');

  // Carga inicial de token, username y tema
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedName  = localStorage.getItem('username');
    if (savedToken) setToken(savedToken);
    if (savedName)  setUsername(savedName);

    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('appTheme', next);
      return next;
    });
  };

  const isLoggedIn = Boolean(token);

  return (
    /* Aplicamos full-screen + tema */
    <div className={`full-screen ${theme}`}>
      <BrowserRouter>
        {/* Header siempre arriba */}
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
          toggleTheme={toggleTheme}
          currentTheme={theme}
        />

        {/* Contenido central que crece */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route
              path="/signup"
              element={<Login onLogin={handleLogin} />}
            />

            <Route path="/store" element={<Store />} />

            <Route
              path="/cart"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/config"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Config />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-books"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <MyBooks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/read/:bookId"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ReadMode />
                </ProtectedRoute>
              }
            />

            {/* Ruta comodín */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer siempre al final */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}
