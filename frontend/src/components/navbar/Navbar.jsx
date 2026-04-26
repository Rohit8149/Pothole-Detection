import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Note: isLoggedIn state and showLogoutConfirm state should be managed by parent component or context
  // For now, these are placeholder variables for the HTML structure
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(localStorage.getItem('login') === 'true');
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src='/pothole-logo.svg' alt="PotholeDetect Logo" />
          <span>PotholeDetect</span>
        </div>
        <ul className="nav-links">
          <li className={location.pathname === '/home' ? 'active' : ''}>
            <Link to="/home">Home</Link>
          </li>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/report' ? 'active' : ''}>
            <Link to="/report">Report Pothole</Link>
          </li>
        </ul>

        {/* Auth Button Section */}
        <div className="auth-section">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={() => {setShowLogoutConfirm(true)}}>
              Logout
            </button>
          ) : (
            <Link className="login-btn" to="/">
              {/* Sign In */}
              Logout
            </Link>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Overlay */}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <div className="logout-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="logout-actions">
              <button className="cancel-btn" onClick={() => {setShowLogoutConfirm(false)}}>
                Cancel
              </button>
              <button className="confirm-logout-btn" onClick={() => {localStorage.setItem('login', 'false'); setIsLoggedIn(false); setShowLogoutConfirm(false); navigate("/home")}}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
