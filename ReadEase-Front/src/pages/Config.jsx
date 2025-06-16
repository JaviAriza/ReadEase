// ReadEase-Front/src/pages/Configuration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import API from '../services/api';
import './Config.css';

export default function Configuration() {
  const [newName, setNewName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Decodifica JWT y extrae userId
  const decodeJwt = (token) => {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const jsonPayload = atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('');
      return JSON.parse(decodeURIComponent(jsonPayload));
    } catch {
      return null;
    }
  };
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodeJwt(token);
    return payload?.userId || payload?.id || payload?.sub;
  };

  const handleChangeName = async () => {
    setError(''); setMessage('');
    const userId = getUserId();
    if (!newName.trim()) return setError('Please enter a name.');
    try {
      const token = localStorage.getItem('token');
      await API.put(`/users/${userId}`, { name: newName.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Name updated successfully!');
      setNewName('');
    } catch {
      setError('Failed to change name.');
    }
  };

  const handleChangePassword = async () => {
    setError(''); setMessage('');
    const userId = getUserId();
    if (!oldPassword || !newPassword) return setError('Please fill both password fields.');
    try {
      const token = localStorage.getItem('token');
      await API.put(`/users/${userId}`, { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Password changed successfully!');
      setOldPassword(''); setNewPassword('');
    } catch {
      setError('Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    setError(''); setMessage('');
    try {
      const userId = getUserId();
      const token = localStorage.getItem('token');
      await API.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch {
      setError('Failed to delete account.');
    }
  };

  return (
    <div className="configuration-page">
      <div className="config-panel">
        <div className="panel-header">
          <FaTimesCircle className="panel-icon" />
          <span className="panel-title">My account</span>
        </div>
        <hr className="panel-divider" />
        <div className="panel-body">
          {error   && <p className="config-error">{error}</p>}
          {message && <p className="config-message">{message}</p>}

          <div className="config-group">
            <label>Enter your new name</label>
            <input
              type="text"
              className="config-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="New name"
            />
            <button className="config-button" onClick={handleChangeName}>
              Change name
            </button>
          </div>

          <div className="config-group">
            <label>Enter your old password</label>
            <input
              type="password"
              className="config-input"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Current password"
            />
            <label>Enter your new password</label>
            <input
              type="password"
              className="config-input"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <button className="config-button" onClick={handleChangePassword}>
              Change password
            </button>
          </div>

          <div className="config-footer">
            <button className="delete-button" onClick={handleDeleteAccount}>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
