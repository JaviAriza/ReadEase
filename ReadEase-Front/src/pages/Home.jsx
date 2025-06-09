
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-logo">
        <img
          src="https://res.cloudinary.com/dnjosjzrj/image/upload/v1747910618/Adobe_Express_-_file_coii59.png"
          alt="Logo ReadEase"
          style={{ width: '128px', height: '128px' }}
        />
      </div>

     
      <div className="cards-grid">
        <Link to="/store" className="card">
          <span className="card-icon">📚</span>
          <span className="card-label">Store</span>
        </Link>

        <Link to="/my-books" className="card">
          <span className="card-icon">📖</span>
          <span className="card-label">My books</span>
        </Link>

        <Link to="/config" className="card">
          <span className="card-icon">⚙️</span>
          <span className="card-label">Configuration</span>
        </Link>
      </div>

    </div>
  );
}
