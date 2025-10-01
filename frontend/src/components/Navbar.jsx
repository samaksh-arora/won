import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">WON</span>
          <span className="logo-subtitle">Wayne Opportunities Network</span>
        </Link>

        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/search" className="nav-link">
                  Search Students
                </Link>
              </li>
              <li>
                <Link to="/profile" className="nav-link">
                  My Profile
                </Link>
              </li>
              <li>
                <span className="nav-user">Hi, {user?.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-button logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-button register-btn">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
