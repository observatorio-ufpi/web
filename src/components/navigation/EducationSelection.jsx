import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container } from '@mui/material';
import { FaGraduationCap, FaChartLine, FaUniversity, FaMapMarkedAlt } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Button, Card } from '../ui';

const EducationSelection = () => {
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
        Dados Educacionais
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
        Selecione o tipo de dados educacionais que deseja visualizar
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
          <Card variant="elevated" className="h-full">
            <Card.Content padding="large" className="flex flex-col items-center text-center justify-between">
              <FaGraduationCap 
                style={{ 
                  color: theme.palette.primary.main,
                  fontSize: '4rem',
                  marginBottom: '1.5rem'
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Educação Básica
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Dados sobre educação infantil, fundamental e médio, incluindo matrículas e funcionários.
              </Typography>
              <Button 
                component={Link} 
                to="/dados-educacionais/basica" 
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>
        
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
                Educação Superior
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Informações sobre ensino superior, incluindo matrículas e dados institucionais.
              </Typography>
              <Button 
                component={Link} 
                to="/dados-educacionais/superior" 
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>
        
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
                Taxa de Frequência
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Dados sobre taxas de frequência escolar e indicadores de participação.
              </Typography>
              <Button 
                component={Link} 
                to="/dados-educacionais/taxa-frequencia" 
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

export default EducationSelection;