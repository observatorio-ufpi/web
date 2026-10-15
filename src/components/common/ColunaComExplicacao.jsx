import React from 'react';
import { Tooltip } from '@mui/material';
import { explicarColuna } from '../../utils/glossario';

// Nome de coluna com explicação ao passar o mouse/tocar (termos do glossário:
// IPTU, FPM, MDE, VAAT...). Sublinhado pontilhado indica que há explicação.
const ColunaComExplicacao = ({ nome }) => {
  const explicacao = explicarColuna(nome);
  if (!explicacao) return nome;
  return (
    <Tooltip title={explicacao} arrow enterTouchDelay={0}>
      <span
        tabIndex={0}
        style={{ borderBottom: '1px dotted currentColor', cursor: 'help', outlineOffset: 2 }}
      >
        {nome}
      </span>
    </Tooltip>
  );
};

export default ColunaComExplicacao;
