import React from 'react';
import { Container } from '@mui/material';

// Moldura das páginas financeiras (Municípios, Estado, Indicadores).
// A troca de categoria ficava num select aqui no topo, repetindo o que a
// sidebar já mostrava — agora fica só nas abas da sidebar
// (FinancialCategorySidebar). `currentCategory` é mantido por compatibilidade.
// eslint-disable-next-line no-unused-vars
const FinancialDataPage = ({ children, currentCategory }) => (
  <Container sx={{ padding: '8px 0 32px', maxWidth: '1200px !important', width: '100%' }}>
    {children}
  </Container>
);

export default FinancialDataPage;
