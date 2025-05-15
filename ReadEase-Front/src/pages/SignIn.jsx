import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = () => {
    if (username && password) {
      // Guardar el nombre de usuario en el localStorage (o cookies, JWT, etc.)
      localStorage.setItem('username', username);
      navigate('/'); // Redirigir a la página principal
    } else {
      alert('Please enter your credentials');
    }
  };

  return (
    <div>
      <h1>Signin</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignin}>Signin</button>
    </div>
  );
}
