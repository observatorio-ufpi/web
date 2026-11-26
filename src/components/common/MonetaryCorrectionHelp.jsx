import React from 'react';
import { Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Pedaços compartilhados pelas tabelas e gráficos financeiros que têm o
// botão "Correção Monetária", pra explicação e aviso ficarem iguais em todo lugar.

export const TEXTO_AJUDA_CORRECAO =
  'Atualiza os valores pela inflação, medida pelo Índice Nacional de Preços ao Consumidor Amplo (IPCA), ' +
  'até a data de referência selecionada, permitindo comparar valores de diferentes anos em termos reais.';

// Aviso exibido na tela e nos arquivos exportados, pra ninguém citar o valor
// atualizado como se fosse o declarado no RREO.
export const notaCorrecaoMonetaria = (dataReferencia) =>
  `Valores atualizados pelo IPCA até ${dataReferencia.toLocaleDateString('pt-BR')}. Os valores apresentados não correspondem aos valores nominais originalmente declarados no RREO.`;

// Sufixo do nome do arquivo exportado: "corrigido_IPCA_31-08-2026"
export const sufixoArquivoCorrecao = (dataReferencia) =>
  `corrigido_IPCA_${dataReferencia.toLocaleDateString('pt-BR').replace(/\//g, '-')}`;

// Rótulo do Switch com ícone de ajuda. O clique no ícone não liga/desliga o
// Switch (o rótulo inteiro de um FormControlLabel é clicável).
export const MonetaryCorrectionLabel = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
    Correção monetária
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
