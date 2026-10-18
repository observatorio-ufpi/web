import React from 'react';
import { Tooltip } from '@mui/material';
import { mudancaRREO } from '../../utils/mudancasRREO';

// Marcador ao lado do ano (2021, 2023) em que o formato do RREO mudou.
// Passar o mouse/tocar mostra o que mudou.
const MarcaMudancaRREO = ({ ano }) => {
  const texto = mudancaRREO(ano);
  if (!texto) return null;
  return (
    <Tooltip title={texto} arrow enterTouchDelay={0}>
      <span
        tabIndex={0}
        aria-label={`Mudança no modelo do relatório em ${ano}: ${texto}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 6,
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#F6E3C8',
          color: '#8A5A12',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'help',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
      >
        !
      </span>
    </Tooltip>
  );
};

export default MarcaMudancaRREO;
