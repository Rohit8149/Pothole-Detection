import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setRole(localStorage.getItem('role') || 'citizen');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.setItem('login', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setRole(null);
    setShowLogoutConfirm(false);
    navigate("/home");
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', justifyContent: 'center' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            
            {/* Left Side - Logo / Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/home')}>
               <img src='/pothole-logo.svg' alt="PotholeDetect Logo" style={{ width: 32, height: 32 }} />
               <Typography
                 variant="h6"
                 fontWeight={700}
                 color="primary"
                 sx={{ display: { xs: 'none', sm: 'block' } }}
               >
                 PotholeDetect
               </Typography>
            </Box>

            {/* Right Side - Navigation Buttons */}
            <Box sx={{ display: "flex", gap: { xs: 2, md: 4 }, alignItems: "center" }}>
              <NavLink
                to="/home"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#2563eb" : "#475569",
                  fontWeight: isActive ? 600 : 500,
                  transition: 'color 0.2s'
                })}
                onMouseEnter={(e) => { if (e.target.style.color !== 'rgb(37, 99, 235)') e.target.style.color = '#0f172a'; }}
                onMouseLeave={(e) => { if (!window.location.pathname.includes('/home')) e.target.style.color = '#475569'; }}
              >
                Home
              </NavLink>

              {isLoggedIn && role === 'citizen' && (
                <>
                  <NavLink
                    to="/report"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#2563eb" : "#475569",
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.2s'
                    })}
                  >
                    Report
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "#2563eb" : "#475569",
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.2s'
                    })}
                  >
                    Dashboard
                  </NavLink>
                </>
              )}

              {isLoggedIn && role === 'field-officer' && (
                <NavLink
                  to="/field-officer/dashboard"
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: isActive ? "#1976d2" : "inherit",
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive ? "2px solid #1976d2" : "2px solid transparent",
                    paddingBottom: 4,
                    transition: 'all 0.2s'
                  })}
                >
                  Officer Dashboard
                </NavLink>
              )}

              {isLoggedIn && role === 'supervisor' && (
                <NavLink
                  to="/supervisor/dashboard"
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: isActive ? "#1976d2" : "inherit",
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive ? "2px solid #1976d2" : "2px solid transparent",
                    paddingBottom: 4,
                    transition: 'all 0.2s'
                  })}
                >
                  Supervisor Dashboard
                </NavLink>
              )}

              {/* Auth Button */}
              {isLoggedIn ? (
                 <Button 
                   sx={{ borderRadius: 2 }} 
                   variant="outlined" 
                   color="error"
                   onClick={() => setShowLogoutConfirm(true)}
                 >
                   Logout
                 </Button>
              ) : (
                 <>
                   <Button 
                     sx={{ borderRadius: 2 }} 
                     variant="outlined" 
                     color="primary"
                     onClick={() => navigate('/')}
                   >
                     Login
                   </Button>
                   <Button 
                     sx={{ borderRadius: 2 }} 
                     variant="contained" 
                     color="primary"
                     onClick={() => navigate('/register')}
                   >
                     Sign Up
                   </Button>
                 </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Dialog */}
      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
