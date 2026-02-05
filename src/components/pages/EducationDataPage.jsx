import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaMapMarkedAlt, FaUniversity, FaChartLine } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Box } from '@mui/material';
import { Button, Card, Select } from '../ui/index.jsx';

const EducationDataPage = ({ children, currentCategory }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = [
    { 
      id: 'basica', 
      label: 'Educação Básica',
      icon: FaGraduationCap,
      description: 'Educação Infantil, Fundamental e Médio',
      path: '/dados-educacionais/basica'
    },
    { 
      id: 'condicoes', 
      label: 'Condições de Oferta',
      icon: FaMapMarkedAlt,
      description: 'Infraestrutura Escolar',
      path: '/dados-educacionais/condicoes-de-oferta'
    },
    { 
      id: 'superior', 
      label: 'Educação Superior',
      icon: FaUniversity,
      description: 'Matrículas e Dados Institucionais',
      path: '/dados-educacionais/superior'
    },
    { 
      id: 'taxas', 
      label: 'Indicadores Educacionais',
      icon: FaChartLine,
      description: 'Taxas de Aprovação, Reprovação, Abandono e Distorção',
      path: '/dados-educacionais/taxas'
    }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.label
  }));

  const handleCategoryChange = (selectedOption) => {
    const selectedCategory = categories.find(cat => cat.id === selectedOption.value);
    if (selectedCategory) {
      navigate(selectedCategory.path);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === currentCategory);

  return (
    <Container sx={{ padding: '2rem 0', maxWidth: '100%', width: '100%' }}>
      {/* Seletor de Categoria */}
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography 
          variant="subtitle2" 
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          Categoria de Dados Educacionais
        </Typography>
        <Select
          options={categoryOptions}
          value={{ value: currentCategory, label: selectedCategoryData?.label || 'Selecione' }}
          onChange={handleCategoryChange}
          placeholder="Selecione uma categoria"
        />
      </Box>

      {/* Conteúdo da Categoria */}
      {children}
    </Container>
  );
};

export default EducationDataPage;
