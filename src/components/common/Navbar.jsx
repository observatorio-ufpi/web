import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaHome, FaChartLine, FaGraduationCap, FaBars } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: theme.palette.surface.main,
        color: theme.palette.surface.onSurface,
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Observatório de Dados
          </Link>
        </Typography>

        {/* Menu para telas grandes */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button
            component={Link}
            to="/"
            startIcon={<FaHome />}
            sx={{
              color: theme.palette.primary.main,
              marginLeft: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
              '@media (max-width: 600px)': {
                fontSize: '0.8rem',
                padding: '6px 8px',
              },
            }}
          >
            Início
          </Button>
          <Button
            component={Link}
            to="/dados-financeiros"
            startIcon={<FaChartLine />}
            sx={{
              color: theme.palette.primary.main,
              marginLeft: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
              '@media (max-width: 600px)': {
                fontSize: '0.8rem',
                padding: '6px 8px',
              },
            }}
          >
            Dados Financeiros
          </Button>
          <Button
            component={Link}
            to="/dados-educacionais"
            startIcon={<FaGraduationCap />}
            sx={{
              color: theme.palette.primary.main,
              marginLeft: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
              '@media (max-width: 600px)': {
                fontSize: '0.8rem',
                padding: '6px 8px',
              },
            }}
          >
            Dados Educacionais
          </Button>
        </Box>

        {/* Menu hambúrguer para telas pequenas */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            onClick={handleClick}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
            }}
          >
            <FaBars />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/">
              <FaHome style={{ marginRight: '8px' }} /> Início
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              component={Link}
              to="/dados-financeiros"
            >
              <FaChartLine style={{ marginRight: '8px' }} /> Dados Financeiros
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              component={Link}
              to="/dados-educacionais"
            >
              <FaGraduationCap style={{ marginRight: '8px' }} /> Dados Educacionais
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
