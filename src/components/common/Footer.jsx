import React from 'react';
import { Typography, Container, Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: theme.palette.surface.variant,
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: '16px 0',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          align="center"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          © {currentYear} Observatório de Dados Educacionais e Financeiros do Piauí
        </Typography>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            marginTop: 1,
            color: theme.palette.text.secondary,
          }}
        >
          Desenvolvido por{' '}
          <Link 
            href="https://www.ufpi.br/" 
            target="_blank" 
            rel="noopener"
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
          >
            UFPI
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 