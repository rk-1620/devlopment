// components/Navbar.jsx
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, Menu, MenuItem, Avatar, Container 
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';  
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = ({ isAuthenticated, user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuOpen = (event) => setMobileAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: 'background.paper',
      color: 'text.primary',
      boxShadow: 'none',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            BlogSphere
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/getAllBlogs')}>Blogs</Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <IconButton
                  size="large"
                  edge="end"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  {user?.avatar ? (
                    <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/logout')}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="contained" onClick={() => navigate('/register')} sx={{ ml: 1 }}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileAnchorEl}
              open={Boolean(mobileAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigation('/blogs')}>Blogs</MenuItem>
              {isAuthenticated ? (
                [
                  <MenuItem key="dashboard" onClick={() => handleNavigation('/dashboard')}>Dashboard</MenuItem>,
                  <MenuItem key="profile" onClick={() => handleNavigation('/profile')}>Profile</MenuItem>,
                  <MenuItem key="logout" onClick={() => handleNavigation('/logout')}>Logout</MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={() => handleNavigation('/login')}>Login</MenuItem>,
                  <MenuItem key="register" onClick={() => handleNavigation('/register')}>Sign Up</MenuItem>
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};