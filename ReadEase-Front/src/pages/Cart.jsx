import React from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div>
      <h1>Cart</h1>
      <p>Your selected books will appear here.</p>
      {/* Agrega aquí la lógica para mostrar los libros en el carrito */}

      <Link to="/store">Back to Store</Link>
    </div>
  );
}
