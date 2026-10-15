import React from 'react';
import { Container } from '@mui/material';

// Moldura das páginas de Dados Educacionais (Básica, Condições, Superior, Indicadores).
// A troca de categoria ficava num select aqui no topo, repetindo a sidebar —
// agora fica só nas abas da sidebar (EducationCategorySidebar).
// `currentCategory` é mantido por compatibilidade.
// eslint-disable-next-line no-unused-vars
const EducationDataPage = ({ children, currentCategory }) => (
  <Container sx={{ padding: '8px 0 32px', maxWidth: '1200px !important', width: '100%' }}>
    {children}
  </Container>
);

export default EducationDataPage;
