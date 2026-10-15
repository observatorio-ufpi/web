import React from 'react';
import { Box, Typography } from '@mui/material';
import { cores } from '../../theme/tokens';
import { Link as RouterLink } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

// Cabeçalho padrão das páginas de dados: caminho ("Dados financeiros › Estado"),
// título curto, etiquetas com o que está sendo mostrado e, à direita, as ações
// (copiar link, ficha técnica, exportar...). Antes cada página tinha o seu:
// título centralizado longo ("Título – Piauí (2007-2024)") ou nenhum.
const PageHeader = ({ caminho, titulo, etiquetas = [], acoes = null }) => (
  <Box
    component="header"
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: '16px 24px',
      marginBottom: '28px',
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      {caminho && <Typography sx={{ fontSize: '13px', color: cores.textoSuave }}>{caminho}</Typography>}
      <Typography
        component="h1"
        sx={{ fontSize: { xs: '24px', md: '28px' }, lineHeight: 1.25, fontWeight: 700, color: cores.tinta }}
      >
        {titulo}
      </Typography>
      {etiquetas.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {etiquetas.map((item) => {
            const etiqueta = typeof item === 'string' ? item : item.texto;
            const ehLink = typeof item === 'object' && item.link;
            return (
            <Box
              key={etiqueta}
              {...(ehLink
                ? { component: RouterLink, to: item.link, title: item.titulo, 'aria-label': item.titulo }
                : { component: 'span' })}
              sx={{
                height: '28px',
                padding: '0 12px',
                borderRadius: '999px',
                backgroundColor: cores.areia,
                color: cores.textoSobreAreia,
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                ...(ehLink && {
                  border: `1px solid ${cores.linhaForte}`,
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                  '&:hover': { backgroundColor: cores.areiaEscura, borderColor: cores.marca },
                }),
              }}
            >
              {etiqueta}
              {ehLink && <ArrowOutwardIcon sx={{ fontSize: '15px' }} aria-hidden="true" />}
            </Box>
            );
          })}
        </Box>
      )}
    </Box>
    {acoes && <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>{acoes}</Box>}
  </Box>
);

export const periodoEtiqueta = (inicio, fim) => (String(inicio) === String(fim) ? `${inicio}` : `${inicio}–${fim}`);

export default PageHeader;
