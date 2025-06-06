// ReadEase-Front/src/App.jsx
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
  // 1) Estado para token y username
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  // 2) Estado para tema (light / dark)
  const [theme, setTheme] = useState('light');

  // 3) Al montar la App, cargamos token/username y tema desde localStorage si existen
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedName = localStorage.getItem('username');
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedName) {
      setUsername(savedName);
    }

    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  // 4) Esta función la llamará LoginForm cuando el backend nos devuelva el JWT y el nombre
  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  // 5) Cerrar sesión: borramos estado y localStorage
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

  // 6) Alternar tema y guardarlo en localStorage
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('appTheme', next);
      return next;
    });
  };

  const isLoggedIn = Boolean(token);

  return (
    <div className={`full-screen flex flex-col ${theme}`}>
      <BrowserRouter>
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
          toggleTheme={toggleTheme}
          currentTheme={theme}
        />

        <div className="flex-grow main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Login y SignUp comparten el mismo componente Login */}
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

            {/* Cualquier otra ruta redirige a Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}
