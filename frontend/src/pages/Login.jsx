import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../styles/common.css';
import '../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      const response = await axiosInstance.post('/login', { username, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/products');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Invalid username or password.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="developer-credit">
        Developed By: Bishu Maharjan
      </div>
      
      <div className="login-card">
        <h2>Login</h2>
        <p>Welcome to our Inventory Management</p>
        
        {errorMsg && <div className="alert-error">{errorMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          
          <button type="submit" className="btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
