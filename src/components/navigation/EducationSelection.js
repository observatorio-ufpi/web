import { Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { FaChartLine, FaSchool, FaUniversity } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../style/FinancialDataSelection.css';

const EducationSelection = () => {
    return (
        <Container className="financial-selection-container">
          <Typography variant="h4" component="h1" gutterBottom className="page-title">
            Dados Educacionais
          </Typography>
          <Typography variant="subtitle1" gutterBottom className="page-subtitle">
            Selecione o tipo de dados educacionais que deseja visualizar
          </Typography>

          <Grid container spacing={4} className="selection-grid">
            <Grid item xs={12} md={4}>
              <Card className="selection-card">
                <CardContent className="card-content">
                  <FaSchool className="card-icon" />
                  <Typography variant="h5" component="h2" className="card-title">
                    Educação Básica
                  </Typography>
                  <Typography variant="body1" className="card-description">
                    Visualize dados sobre matrículas, escolas, professores e outros indicadores da educação básica no Piauí.
                  </Typography>
                  <Button
                    component={Link}
                    to="/dados-educacionais/basica"
                    variant="contained"
                    color="primary"
                    className="card-button"
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="selection-card">
                <CardContent className="card-content">
                  <FaUniversity className="card-icon" />
                  <Typography variant="h5" component="h2" className="card-title">
                    Educação Superior
                  </Typography>
                  <Typography variant="body1" className="card-description">
                    Acesse dados sobre cursos, matrículas, docentes e instituições de ensino superior no Piauí.
                  </Typography>
                  <Button
                    component={Link}
                    to="/dados-educacionais/superior"
                    variant="contained"
                    color="primary"
                    className="card-button"
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="selection-card">
                <CardContent className="card-content">
                  <FaChartLine className="card-icon" />
                  <Typography variant="h5" component="h2" className="card-title">
                    Taxas Educacionais
                  </Typography>
                  <Typography variant="body1" className="card-description">
                    Consulte taxas de matrículas líquidas e brutas, taxa de atendimento educacional e população fora da escola.
                  </Typography>
                  <Button
                    component={Link}
                    to="/dados-educacionais/taxas"
                    variant="contained"
                    color="primary"
                    className="card-button"
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
    );
};

export default EducationSelection;