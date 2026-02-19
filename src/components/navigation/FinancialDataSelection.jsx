import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container } from '@mui/material';
import { FaChartLine, FaChartPie, FaMapMarkedAlt, FaUniversity } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Button, Card } from '../ui';

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
        {/* Card 1 - Dados por Município */}
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content padding="large" className="flex flex-col items-center text-center justify-between">
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
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>
        
        {/* Card 2 - Dados Estaduais */}
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content padding="large" className="flex flex-col items-center text-center justify-between">
              <FaUniversity 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Dados Estaduais
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acesse dados financeiros consolidados do estado do Piauí.
              </Typography>
              <Button 
                component={Link} 
                to="/estado" 
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>
        
        {/* Card 3 - Indicadores por Município */}
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content padding="large" className="flex flex-col items-center text-center justify-between">
              <FaChartPie 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Indicadores - Município
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Explore indicadores e gráficos financeiros dos municípios.
              </Typography>
              <Button 
                component={Link} 
                to="/indicadores" 
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>

        {/* Card 4 - Indicadores por Estado */}
        <div 
          style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            minWidth: '250px'
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content padding="large" className="flex flex-col items-center text-center justify-between">
              <FaMapMarkedAlt 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Indicadores - Estado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Explore indicadores e gráficos financeiros do estado.
              </Typography>
              <Button 
                component={Link} 
                to="/indicadores-estaduais" 
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default FinancialDataSelection; 