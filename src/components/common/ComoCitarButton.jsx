import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { cores } from '../../theme/tokens';

// "Como citar": referência no padrão ABNT para quem usa os dados em trabalhos,
// matérias ou relatórios. Usa o link da consulta atual (os filtros já vão na URL).
const MESES_ABNT = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

export const montarCitacao = (titulo, url, hoje = new Date()) =>
  `OBSERVATÓRIO DA POLÍTICA EDUCACIONAL PIAUIENSE (OPEPI). ${titulo}. Teresina: UFPI, ${hoje.getFullYear()}. ` +
  `Disponível em: ${url}. Acesso em: ${hoje.getDate()} ${MESES_ABNT[hoje.getMonth()]} ${hoje.getFullYear()}.`;

const ComoCitarButton = ({ titulo }) => {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const citacao = montarCitacao(titulo, typeof window !== 'undefined' ? window.location.href : '');

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(citacao);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (e) {
      console.error('Não foi possível copiar a citação:', e);
    }
  };

  return (
    <>
      <Button variant="text" onClick={() => setAberto(true)} startIcon={<FormatQuoteIcon />}>
        Como citar
      </Button>
      <Dialog open={aberto} onClose={() => setAberto(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Como citar estes dados</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: '13px', color: cores.textoSuave, marginBottom: '10px' }}>
            Referência no padrão ABNT, com o link desta consulta:
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: cores.tinta,
              backgroundColor: cores.zebra,
              border: `1px solid ${cores.linha}`,
              borderRadius: '10px',
              padding: '14px 16px',
              overflowWrap: 'anywhere',
            }}
          >
            {citacao}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setAberto(false)}>Fechar</Button>
          <Button variant="contained" onClick={copiar} startIcon={copiado ? <CheckIcon /> : <ContentCopyIcon />} aria-live="polite">
            {copiado ? 'Copiado' : 'Copiar citação'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComoCitarButton;
