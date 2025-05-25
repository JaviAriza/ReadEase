import React from 'react';
import Footer from '../components/Footer/Footer'; 
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-[#def5e1]">

      {/* Contenido principal */}
      <main className="">

        {/* Logo */}
        <img
          src="https://res.cloudinary.com/dnjosjzrj/image/upload/v1747910618/Adobe_Express_-_file_coii59.png"
          alt="Logo"
          className=""
        />
        
        {/* Botones */}
        <div className="flex">

          <Link
            to="/store"
            className=""
          >
            <span>📚</span>
            <span className="mt-2">Store</span>
          </Link>

          <Link
            to="/my-books"
            className=""
          >
            <span>📖</span>
            <span className="">My books</span>

          </Link>

          <Link
            to="/config"
            className=""
          >
            <span>⚙️</span>
            <span className="">Configuration</span>
          </Link>
          
        </div>

      </main>

      <Footer />
    </div>
  );
}
