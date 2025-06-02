// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header  from './components/Header/Header';
import Footer  from './components/Footer/Footer';

import Home     from './pages/Home';
import Login    from './pages/Login';
import Cart     from './pages/Cart';
import Config   from './pages/Config';
import MyBooks  from './pages/MyBooks';
import ReadMode from './pages/ReadMode';
import Store    from './pages/Store';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    alert('Debes estar registrado para acceder a esta ruta');
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App({ token, username, onLogin, onLogout }) {
  const isLoggedIn = Boolean(token);

  return (
    <BrowserRouter>
      <div className="full-screen flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={onLogout}
        />

        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login onLogin={onLogin} />} />
            <Route path="/signup" element={<Login onLogin={onLogin} />} />
            <Route path="/store"  element={<Store />} />

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
              path="/read-mode"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ReadMode />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
