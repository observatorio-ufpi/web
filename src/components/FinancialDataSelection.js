import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Container } from '@mui/material';
import { FaCity, FaLandmark, FaChartBar } from 'react-icons/fa';
import '../style/FinancialDataSelection.css';

const FinancialDataSelection = () => {
  return (
    <Container className="financial-selection-container">
      <Typography variant="h4" component="h1" gutterBottom className="page-title">
        Dados Financeiros
      </Typography>
      <Typography variant="subtitle1" gutterBottom className="page-subtitle">
        Selecione o tipo de dados financeiros que deseja visualizar
      </Typography>
      
      <Grid container spacing={4} className="selection-grid">
        <Grid item xs={12} md={4}>
          <Card className="selection-card">
            <CardContent className="card-content">
              <FaCity className="card-icon" />
              <Typography variant="h5" component="h2" gutterBottom>
                Dados dos Municípios
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Acesse dados financeiros detalhados de todos os municípios, incluindo receitas, despesas e impostos.
              </Typography>
              <Button 
                component={Link} 
                to="/municipios" 
                variant="contained" 
                color="primary" 
                className="selection-button"
              >
                Acessar Dados dos Municípios
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="selection-card">
            <CardContent className="card-content">
              <FaLandmark className="card-icon" />
              <Typography variant="h5" component="h2" gutterBottom>
                Dados do Estado
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Visualize dados financeiros consolidados do estado, incluindo impostos, transferências e despesas com educação.
              </Typography>
              <Button 
                component={Link} 
                to="/estado" 
                variant="contained" 
                color="primary" 
                className="selection-button"
              >
                Acessar Dados do Estado
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="selection-card">
            <CardContent className="card-content">
              <FaChartBar className="card-icon" />
              <Typography variant="h5" component="h2" gutterBottom>
                Indicadores Financeiros
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Explore gráficos e indicadores financeiros comparativos entre municípios, incluindo percentuais de aplicação e composição de receitas.
              </Typography>
              <Button 
                component={Link} 
                to="/indicadores" 
                variant="contained" 
                color="primary" 
                className="selection-button"
              >
                Acessar Indicadores
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FinancialDataSelection; 