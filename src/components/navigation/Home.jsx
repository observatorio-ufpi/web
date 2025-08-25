import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Container } from '@mui/material';
import { FaChartLine, FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const Home = () => {
  const theme = useTheme();
  
  return (
    <Container sx={{ padding: '2rem 0', maxWidth: '1200px' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: 2,
        }}
      >
        Bem-vindo ao Observatório de Dados Educacionais e Financeiros do Piauí
      </Typography>
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={{
          color: theme.palette.text.secondary,
          textAlign: 'center',
          marginBottom: 3,
        }}
      >
        Selecione o tipo de dados que deseja visualizar
      </Typography>
      
      <div 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4,
          justifyContent: 'center',
          alignItems: 'stretch',
          marginTop: 2,
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '32px',
          justifyContent: 'center',
          alignItems: 'stretch',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div 
          style={{
            flex: '1 1 400px',
            maxWidth: '500px',
            minWidth: '300px'
          }}
        >
          <Card sx={{ 
            width: '100%',
            height: '100%',
            borderRadius: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            },
          }}>
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 3,
              flex: 1,
              justifyContent: 'space-between',
            }}>
              <FaGraduationCap 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Dados Educacionais
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Acesse dados e estatísticas sobre educação, incluindo matrículas, funcionários e outros indicadores educacionais.
              </Typography>
              <Button 
                component={Link} 
                to="/dados-educacionais" 
                variant="contained" 
                color="primary" 
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  marginTop: 2,
                  padding: '0.75rem 1.5rem',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Acessar Dados Educacionais
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div 
          style={{
            flex: '1 1 400px',
            maxWidth: '500px',
            minWidth: '300px'
          }}
        >
          <Card sx={{ 
            width: '100%',
            height: '100%',
            borderRadius: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            },
          }}>
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 3,
              flex: 1,
              justifyContent: 'space-between',
            }}>
              <FaChartLine 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Dados Financeiros
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Visualize dados financeiros relacionados à educação, incluindo receitas, despesas e investimentos.
              </Typography>
              <Button 
                component={Link} 
                to="/dados-financeiros" 
                variant="contained" 
                color="primary" 
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  marginTop: 2,
                  padding: '0.75rem 1.5rem',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Acessar Dados Financeiros
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Home; 