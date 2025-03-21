import React from 'react';
import { Typography, Container, Box, Link } from '@mui/material';
import '../../style/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} Observatório de Dados Educacionais e Financeiros do Piauí
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Desenvolvido por{' '}
          <Link color="inherit" href="https://www.ufpi.br/" target="_blank" rel="noopener">
            UFPI
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 