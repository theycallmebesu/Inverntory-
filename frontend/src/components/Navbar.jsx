import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/products">Inventory System</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/suppliers">Suppliers</Link>
        </li>
      </ul>
      <div className="navbar-user">
        {user && <span className="user-welcome">Hello, {user.username}</span>}
        {user && (
          <Link to="/settings" className="btn-edit" style={{ marginRight: '10px' }}>
            Settings
          </Link>
        )}
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
