import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaHome, FaChartLine, FaGraduationCap, FaBars } from 'react-icons/fa';
import '../style/Navbar.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className="logo-link">
            Observatório de Dados
          </Link>
        </Typography>
        
        {/* Menu para telas grandes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<FaHome />}
            className="nav-button"
          >
            Início
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/dados-financeiros" 
            startIcon={<FaChartLine />}
            className="nav-button"
          >
            Dados Financeiros
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/dados-educacionais" 
            startIcon={<FaGraduationCap />}
            className="nav-button"
          >
            Dados Educacionais
          </Button>
        </Box>
        
        {/* Menu hambúrguer para telas pequenas */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <FaBars />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/">
              <FaHome className="menu-icon" /> Início
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/dados-financeiros">
              <FaChartLine className="menu-icon" /> Dados Financeiros
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/dados-educacionais">
              <FaGraduationCap className="menu-icon" /> Dados Educacionais
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 