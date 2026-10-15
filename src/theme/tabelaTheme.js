import { createTheme } from '@mui/material/styles';
import temaGlobal from './muiTheme';
import { cores, fonte } from './tokens';

// Tema das tabelas de Dados Educacionais (Básica, Superior, Taxas), que usam
// <ThemeProvider theme={...}> local. Herda o tema global (cores e fonte da marca)
// e aplica o mesmo visual das tabelas financeiras: cabeçalho areia compacto,
// linhas alternadas, realce ao passar o mouse, números alinhados.
// Mantém `background.default` e `background.tableHeader`, que essas tabelas leem.
const temaTabela = createTheme(temaGlobal, {
  palette: {
    background: {
      default: cores.superficie,
      tableHeader: cores.areia,
    },
  },
  typography: { fontFamily: fonte, fontSize: 14 },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${cores.linha}`,
          color: cores.tinta,
          fontVariantNumeric: 'tabular-nums',
        },
        head: {
          backgroundColor: cores.areia,
          color: cores.textoSobreAreia,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          lineHeight: 1.35,
          padding: '10px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 120ms ease',
          '.MuiTableBody-root &:nth-of-type(even)': { backgroundColor: cores.zebra },
          '.MuiTableBody-root &:hover': { backgroundColor: '#F8EFE9' },
          '.MuiTableBody-root &:last-child td, .MuiTableBody-root &:last-child th': { borderBottom: 0 },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${cores.linha}`,
          borderRadius: '14px',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default temaTabela;
