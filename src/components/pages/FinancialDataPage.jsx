import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaChartPie, FaUniversity } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Box } from '@mui/material';
import { Select } from '../ui/index.jsx';

const FinancialDataPage = ({ children, currentCategory }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = [
    { 
      id: 'municipios', 
      label: 'Dados por Município',
      description: 'Visualize dados financeiros específicos de cada município',
      path: '/municipios'
    },
    { 
      id: 'estado', 
      label: 'Dados por Estado',
      description: 'Acesse dados financeiros consolidados do Piauí',
      path: '/estado'
    },
    { 
      id: 'indicadores', 
      label: 'Indicadores - Município',
      description: 'Explore indicadores e gráficos dos municípios',
      path: '/indicadores'
    },
    { 
      id: 'indicadores-estaduais', 
      label: 'Indicadores - Estado',
      description: 'Explore indicadores e gráficos do estado',
      path: '/indicadores-estaduais'
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
          Categoria de Dados Financeiros
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

export default FinancialDataPage;
