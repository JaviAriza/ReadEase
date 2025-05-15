import React from 'react';
import { Link } from 'react-router-dom';

export default function Store() {
  return (
    <div>
      <h1>Store</h1>
      <p>Here you can browse the available books and add them to your cart.</p>
      {/* Agregar lógica para mostrar los libros disponibles */}

      <Link to="/cart">Go to Cart</Link>
    </div>
  );
}
