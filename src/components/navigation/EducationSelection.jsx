import React from "react";
import { Link } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import {
  FaGraduationCap,
  FaChartLine,
  FaUniversity,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import { Button, Card } from "../ui";

const EducationSelection = () => {
  const theme = useTheme();

  return (
    <Container sx={{ padding: "2rem 0", maxWidth: "1200px" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          textAlign: "center",
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
          textAlign: "center",
          marginBottom: 3,
        }}
      >
        Selecione o tipo de dados educacionais que deseja visualizar
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          justifyContent: "center",
          alignItems: "stretch",
          marginTop: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Card 1 - Educação Básica */}
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "350px",
            minWidth: "250px",
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content
              padding="large"
              className="flex flex-col items-center text-center justify-between"
            >
              <FaGraduationCap
                style={{
                  color: theme.palette.primary.main,
                  fontSize: "4rem",
                  marginBottom: "1.5rem",
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Educação Básica
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Educação Infantil, Fundamental e Médio
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

        {/* Card 2 - Censo Escolar */}
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "350px",
            minWidth: "250px",
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content
              padding="large"
              className="flex flex-col items-center text-center justify-between"
            >
              <FaMapMarkedAlt
                style={{
                  color: theme.palette.primary.main,
                  fontSize: "4rem",
                  marginBottom: "1.5rem",
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Condições de Oferta
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Infraestrutura Escolar
              </Typography>
              <Button
                component={Link}
                to="/dados-educacionais/condicoes-de-oferta"
                variant="primary"
                size="medium"
                className="mt-4"
              >
                Acessar
              </Button>
            </Card.Content>
          </Card>
        </div>

        {/* Card 3 - Educação Superior */}
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "350px",
            minWidth: "250px",
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content
              padding="large"
              className="flex flex-col items-center text-center justify-between"
            >
              <FaUniversity
                style={{
                  color: theme.palette.primary.main,
                  fontSize: "4rem",
                  marginBottom: "1.5rem",
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Educação Superior
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Matrículas e Dados Institucionais
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

        {/* Card 4 - Taxas Educacionais */}
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "350px",
            minWidth: "250px",
          }}
        >
          <Card variant="elevated" className="h-full">
            <Card.Content
              padding="large"
              className="flex flex-col items-center text-center justify-between"
            >
              <FaChartLine
                style={{
                  color: theme.palette.primary.main,
                  fontSize: "4rem",
                  marginBottom: "1.5rem",
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                Indicadores Educacionais
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Taxas de Aprovação, Reprovação, Abandono e Distorção Idade-Série
              </Typography>
              <Button
                component={Link}
                to="/dados-educacionais/taxas"
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
