import React from 'react';
import { Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Pedaços compartilhados pelas tabelas e gráficos financeiros que têm o
// botão "Correção Monetária", pra explicação e aviso ficarem iguais em todo lugar.

export const TEXTO_AJUDA_CORRECAO =
  'Atualiza os valores pela inflação (IPCA) até a data de referência escolhida, ' +
  'para dar pra comparar anos diferentes. Desligado, os valores são os nominais, ' +
  'exatamente como declarados no RREO.';

// "Valores corrigidos pelo IPCA até 31/08/2026" — vai no título dos arquivos
// exportados, pra ninguém citar o valor corrigido como se fosse o do RREO.
export const notaCorrecaoMonetaria = (dataReferencia) =>
  `Valores corrigidos pelo IPCA até ${dataReferencia.toLocaleDateString('pt-BR')}`;

// Sufixo do nome do arquivo exportado: "corrigido_IPCA_31-08-2026"
export const sufixoArquivoCorrecao = (dataReferencia) =>
  `corrigido_IPCA_${dataReferencia.toLocaleDateString('pt-BR').replace(/\//g, '-')}`;

// Rótulo do Switch com ícone de ajuda. O clique no ícone não liga/desliga o
// Switch (o rótulo inteiro de um FormControlLabel é clicável).
export const MonetaryCorrectionLabel = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
    Correção Monetária
    <Tooltip title={TEXTO_AJUDA_CORRECAO} arrow enterTouchDelay={0}>
      <span
        onClick={(e) => e.preventDefault()}
        style={{ display: 'inline-flex', cursor: 'help' }}
        aria-label="O que é a correção monetária?"
      >
        <HelpOutlineIcon sx={{ fontSize: '16px', color: '#666' }} />
      </span>
    </Tooltip>
  </span>
);
