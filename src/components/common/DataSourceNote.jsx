import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// Rodapé "Fonte" das tabelas financeiras, com link pra quem quiser conferir
// o número no documento original do SIOPE.
const LINKS_SIOPE = {
  municipal: 'https://www.fnde.gov.br/siope/relatoriosMunicipais.jsp',
  estadual: 'https://www.fnde.gov.br/siope/relatoriosEstaduais.jsp',
};

const DataSourceNote = ({ nivel = 'municipal' }) => (
  <Typography
    variant="caption"
    sx={{
      display: 'block',
      textAlign: 'right',
      color: '#666',
      fontSize: '12px',
      fontStyle: 'italic',
      marginTop: '8px',
    }}
  >
    Fonte: RREO (Anexo 8 – MDE), 6º bimestre / SIOPE – FNDE. Elaboração: OPEPI/UFPI.{' '}
    <a
      href={LINKS_SIOPE[nivel]}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit', textDecoration: 'underline' }}
    >
      Conferir no SIOPE
    </a>
    {' · '}
    <Link to="/glossario" style={{ color: 'inherit', textDecoration: 'underline' }}>
      Glossário
    </Link>
  </Typography>
);

export default DataSourceNote;
