import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Container } from '@mui/material';
import { FaChartLine, FaGraduationCap, FaMapMarkedAlt, FaUniversity } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const FinancialDataSelection = () => {
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
        Dados Financeiros
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
        Selecione o tipo de dados financeiros que deseja visualizar
      </Typography>
      
      <div 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch',
          marginTop: 2,
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'stretch',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
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
              <Typography variant="h6" component="h2" gutterBottom>
                Dados por Município
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Visualize dados financeiros específicos de cada município do Piauí.
              </Typography>
              <Button 
                component={Link} 
                to="/municipios" 
                variant="contained" 
                color="primary" 
                size="small"
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
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
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
              <FaUniversity 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Dados por Estado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acesse dados financeiros consolidados do estado do Piauí.
              </Typography>
              <Button 
                component={Link} 
                to="/estado" 
                variant="contained" 
                color="primary" 
                size="small"
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
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
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
              <FaMapMarkedAlt 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Indicadores
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Explore indicadores e gráficos financeiros detalhados.
              </Typography>
              <Button 
                component={Link} 
                to="/indicadores" 
                variant="contained" 
                color="primary" 
                size="small"
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
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default FinancialDataSelection; 