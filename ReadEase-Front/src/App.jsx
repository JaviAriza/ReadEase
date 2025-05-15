import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';
import MyBooks from './pages/MyBooks';
import Config from './pages/Config';
import Store from './pages/Store';
import Login from './pages/Login';
import ReadMode from './pages/ReadMode';
import Header from './components/Header/Header'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Función para manejar login, la usarás para actualizar el estado cuando se loguee el usuario
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  // Función para manejar logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    // Aquí podrías añadir limpieza de tokens, llamadas a backend, etc.
  };

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/config" element={<Config />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Login onLogin={handleLogin} />} />
        <Route path="/store" element={<Store />} />
        <Route path="/readmode" element={<ReadMode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
