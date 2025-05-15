// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyBooks from './pages/MyBooks';
import Config from './pages/Config';
import Signin from './pages/Signin';  // Asegúrate de importar el Login
import Store from './pages/Store';
import ReadMode from './pages/ReadMode';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/config" element={<Config />} />
        <Route path="/login" element={<Signin />} /> {/* Ruta para Login */}
        <Route path="/store" element={<Store />} />
        <Route path="/readmode" element={<ReadMode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
