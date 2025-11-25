import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  Menu,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { AccountCircle, AccountCircleOutlined, Login } from '@mui/icons-material';
import { GiRamProfile } from 'react-icons/gi';
import { Typography } from 'antd';


const Header = ({ onDateChange }) => {
  const theme = useTheme();
  const location = useLocation();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [context, setContext] = useState('Account');
  const [loaded, setLoaded] = useState(false); // trigger animation
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const isSecurity = location.pathname.toLowerCase().startsWith('/security');
  const Operational = location.pathname.toLowerCase().startsWith('/operational');
  const layout = isSecurity ? "1" : Operational ? "2" : "3";

  // Open menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Close the menu
      handleClose();
      
      // Redirect to login
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to logout. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  useEffect(() => {
    setLoaded(true); // trigger fade-in on mount
  }, []);

  useEffect(() => {
    if (startDate && endDate && context) {
      onDateChange({ startDate, endDate, context });
    }
  }, [startDate, endDate, context]);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };
  const navigate = useNavigate();
  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        bgcolor:'white',
        color: theme.palette.text.primary,
        // borderBottom: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} >
          <img src={logo} alt="logo" style={{ height: 70, marginRight: 25 }}  onClick={() => navigate('/')} />
          <Typography.Title 
  level={3}
  style={{
    fontFamily: "Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontSize: "23px",
    fontWeight: 700,
    color: "black",
    margin: 0
  }}
>
{layout === "1" ? "Security":layout === "2" ?  "Operational Excellence":"Cost Management"} 
</Typography.Title>
 

        </Box>

        {/* <Fade in={loaded} timeout={600}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              bgcolor: '#F9F7F3 ',
              p: 1.5,
              borderRadius: 2,
            }}
          >
            <Select
              size="small"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              sx={{
                minWidth: 150,
                bgcolor: 'white',
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <MenuItem value="Account">By Account</MenuItem>
              <MenuItem value="Environment">By Environment</MenuItem>
              <MenuItem value="Service">By Service</MenuItem>
              <MenuItem value="App">By App</MenuItem>
            </Select>

            <TextField
              size="small"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                boxShadow: 1,
              }}
            />

            <TextField
              size="small"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                boxShadow: 1,
              }}
            />

            <Button
              variant="outlined"
              size="small"
              onClick={handleReset}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                },
              }}
            >
              Reset
            </Button>

            <IconButton sx={{ ml: 1 }}>
              <AccountCircle fontSize="medium" />
            </IconButton>
          </Box>
        </Fade> */}
         <IconButton onClick={handleMenu}>
              <AccountCircleOutlined fontSize="medium" /> 
            </IconButton>
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { handleClose(); alert("Go to Profile"); }}>
         <AccountCircleOutlined/>  &nbsp;  Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Login/> &nbsp; Logout
        </MenuItem>
      </Menu>
      </Toolbar>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
