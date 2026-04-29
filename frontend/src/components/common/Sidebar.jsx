import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon as MenuListItemIcon,
} from "@mui/material";
import TrafficIcon from '@mui/icons-material/Traffic';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuItems, activeItem, onItemClick, userInfo }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleProfileClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("login");
    navigate("/");
  };

  return (
    <Box 
      sx={{ 
        width: 280, 
        flexShrink: 0, 
        height: '100vh', 
        position: 'sticky', 
        top: 0,
        borderRight: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Brand — click navigates to /home */}
      <Box 
        onClick={() => navigate('/home')}
        sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.04) },
          transition: 'background 0.15s',
        }}
      >
        <Box sx={{ 
          width: 34, height: 34, borderRadius: 2, 
          bgcolor: 'primary.main', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', flexShrink: 0 
        }}>
          <TrafficIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
          PotholeDetect
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ px: 2, py: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.id}>
            <ListItemButton 
              selected={activeItem === item.id} 
              onClick={() => onItemClick(item.id)}
              sx={{ 
                borderRadius: 2, 
                mb: 0.5, 
                '&.Mui-selected': { 
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1) + ' !important', 
                  color: 'primary.main', 
                  '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.15) + ' !important' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                } 
              }}
            >
              <ListItemIcon sx={{ color: activeItem === item.id ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: activeItem === item.id ? 700 : 500 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Profile — click opens menu */}
      <Box 
        onClick={handleProfileClick}
        sx={{ 
          p: 2, 
          mx: 1,
          mb: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          transition: 'all 0.15s',
          '&:hover': { 
            bgcolor: (t) => alpha(t.palette.primary.main, 0.05), 
            borderColor: 'primary.light',
          },
        }}
      >
        <Avatar sx={{ bgcolor: userInfo.avatarColor || 'secondary.main', width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
          {userInfo.avatarText || 'U'}
        </Avatar>
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {userInfo.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {userInfo.role || 'Account'}
          </Typography>
        </Box>
        {/* three-dot hint */}
        <Typography color="text.disabled" sx={{ fontSize: 18, letterSpacing: -1, lineHeight: 1 }}>
          ···
        </Typography>
      </Box>

      {/* Profile Popup Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 200, mt: -1 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={700}>{userInfo.name || 'User'}</Typography>
          <Typography variant="caption" color="text.secondary">{userInfo.role || 'Account'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, py: 1.2 }}>
          <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight={500}>Profile</Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleLogout} 
          sx={{ gap: 1.5, py: 1.2, color: 'error.main', '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.06) } }}
        >
          <LogoutIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Sidebar;
