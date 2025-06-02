// src/pages/MyBooks.jsx
import React from 'react';

export default function MyBooks() {
  return (
    // 1) h-full w-full: ocupa todo el área padre
    // 2) flex flex-col items-center justify-center: centra vertical/horizontal
    // 3) bg-white: fondo blanco (puedes personalizar)
    // 4) overflow-hidden: quita scroll
    <div className="h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden">
      <h1 className="text-3xl font-semibold mb-4">My Books</h1>
      <p>These are the books in your library.</p>
    </div>
  );
}
