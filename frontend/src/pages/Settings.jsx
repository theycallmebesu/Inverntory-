import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/common.css';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(user ? user.username : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !currentPassword || !newPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      const response = await axiosInstance.put('/reset', {
        username,
        currentPassword,
        newPassword
      });
      setSuccessMsg(response.data.message);
      // Logout the user after successful credential reset
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Failed to update credentials.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>Settings: Reset Credentials</h2>
        
        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleReset} className="form-container" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
          <div className="form-group">
            <label>New Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
          
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
