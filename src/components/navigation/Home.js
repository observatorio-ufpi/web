import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Container } from '@mui/material';
import { FaChartLine, FaGraduationCap } from 'react-icons/fa';
import '../../style/Home.css';

const Home = () => {
  return (
    <Container className="home-container">
      <Typography variant="h4" component="h1" gutterBottom className="welcome-title">
        Bem-vindo ao Observatório de Dados Educacionais e Financeiros do Piauí
      </Typography>
      <Typography variant="subtitle1" gutterBottom className="welcome-subtitle">
        Selecione o tipo de dados que deseja visualizar
      </Typography>
      
      <Grid container spacing={4} className="selection-grid">
        <Grid item xs={12} md={6}>
          <Card className="selection-card">
            <CardContent className="card-content">
              <FaGraduationCap className="card-icon" />
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
                className="selection-button"
              >
                Acessar Dados Educacionais
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card className="selection-card">
            <CardContent className="card-content">
              <FaChartLine className="card-icon" />
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
                className="selection-button"
              >
                Acessar Dados Financeiros
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 