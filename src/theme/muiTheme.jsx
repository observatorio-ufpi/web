import { createTheme } from '@mui/material/styles';

import { cores, fonte } from './tokens';

// Paleta da identidade visual (valores em ./tokens.js). Mantém as chaves
// antigas (container, onContainer...) porque partes do site leem esses nomes.
const nordestePastel = {
  primary: {
    main: cores.marca,
    light: cores.areia,
    dark: cores.marcaEscura,
    contrastText: '#FFFFFF',
    container: cores.areia,
    onContainer: cores.textoSobreAreia,
    onPrimary: '#FFFFFF',
    onPrimaryContainer: cores.textoSobreAreia,
  },

  secondary: {
    main: cores.series[1],
    light: '#F9E7C8',
    dark: '#A86A0F',
    contrastText: cores.tinta,
    container: '#F9E7C8',
    onContainer: '#5A3A06',
    onSecondary: cores.tinta,
    onSecondaryContainer: '#5A3A06',
  },

  tertiary: {
    main: cores.series[2],
    light: '#DCEBEE',
    dark: '#1F4A55',
    container: '#DCEBEE',
    onContainer: '#163840',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#163840',
  },

  error: {
    main: cores.naoAtende,
    light: '#F5DDDD',
    dark: '#7F2B1F',
    container: '#F5DDDD',
    onContainer: '#6B2418',
    onError: '#FFFFFF',
    onErrorContainer: '#6B2418',
  },

  success: { main: cores.atende, contrastText: '#FFFFFF' },
  warning: { main: cores.atencao, contrastText: '#FFFFFF' },

  surface: {
    main: cores.superficie,
    variant: cores.areia,
    onSurface: cores.tinta,
    onSurfaceVariant: cores.textoSuave,
    outline: cores.linhaForte,
    outlineVariant: cores.linha,
  },

  background: {
    default: cores.fundo,
    paper: cores.superficie,
  },

  grey: {
    50: '#FCFAF8',
    100: '#F6F3F2',
    200: cores.linha,
    300: cores.linhaForte,
    400: '#B8A797',
    500: cores.textoSuave,
    600: '#625448',
    700: cores.texto,
    800: '#3A2D24',
    900: cores.tinta,
  },
};

// Criar o tema com cores nordestinas
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: nordestePastel.primary,
    secondary: nordestePastel.secondary,
    tertiary: nordestePastel.tertiary,
    error: nordestePastel.error,
    success: nordestePastel.success,
    warning: nordestePastel.warning,
    surface: nordestePastel.surface,
    background: nordestePastel.background,
    grey: nordestePastel.grey,
    text: {
      primary: nordestePastel.surface.onSurface,
      secondary: nordestePastel.surface.onSurfaceVariant,
    },
    divider: nordestePastel.surface.outlineVariant,
  },

  // Formas e bordas MD3
  shape: {
    borderRadius: 16, // MD3 border radius padrão
  },

  // Shadows customizadas com mais profundidade
  shadows: [
    'none',
    '0 2px 4px rgba(139, 115, 85, 0.12)',
    '0 4px 8px rgba(139, 115, 85, 0.15)',
    '0 8px 16px rgba(139, 115, 85, 0.18)',
    '0 12px 24px rgba(139, 115, 85, 0.20)',
    '0 16px 32px rgba(139, 115, 85, 0.22)',
    '0 20px 40px rgba(139, 115, 85, 0.24)',
    '0 24px 48px rgba(139, 115, 85, 0.25)',
    '0 28px 56px rgba(139, 115, 85, 0.26)',
    '0 32px 64px rgba(139, 115, 85, 0.27)',
    '0 36px 72px rgba(139, 115, 85, 0.28)',
    '0 40px 80px rgba(139, 115, 85, 0.29)',
    '0 44px 88px rgba(139, 115, 85, 0.30)',
    '0 48px 96px rgba(139, 115, 85, 0.31)',
    '0 52px 104px rgba(139, 115, 85, 0.32)',
    '0 56px 112px rgba(139, 115, 85, 0.33)',
    '0 60px 120px rgba(139, 115, 85, 0.34)',
    '0 64px 128px rgba(139, 115, 85, 0.35)',
    '0 68px 136px rgba(139, 115, 85, 0.36)',
    '0 72px 144px rgba(139, 115, 85, 0.37)',
    '0 76px 152px rgba(139, 115, 85, 0.38)',
    '0 80px 160px rgba(139, 115, 85, 0.39)',
    '0 84px 168px rgba(139, 115, 85, 0.40)',
    '0 88px 176px rgba(139, 115, 85, 0.41)',
    '0 92px 184px rgba(139, 115, 85, 0.42)',
    '0 96px 192px rgba(139, 115, 85, 0.43)',
  ],

  // Tipografia MD3
  typography: {
    fontFamily: fonte,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    // Títulos MD3
    h1: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 400,
      lineHeight: 1.16,
      letterSpacing: '-0.15px',
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.24,
      letterSpacing: '0.15px',
    },
    h5: {
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.28,
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.33,
      letterSpacing: '0.15px',
    },

    // Corpo do texto MD3
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.15px',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.25px',
    },

    // Botões MD3
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.14,
      letterSpacing: '0.1px',
      textTransform: 'none', // MD3 não usa uppercase
    },

    // Caption MD3
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0.4px',
    },

    // Overline MD3
    overline: {
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
  },

  // Espaçamento MD3 (baseado em 8px)
  spacing: 8,

  // Componentes customizados MD3
  components: {
    // Botões MD3
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          minHeight: 40,
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
          '&:focus-visible': { outline: `2px solid ${cores.marca}`, outlineOffset: 2 },
        },
        contained: {
          boxShadow: 'none',
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },

    // Cards MD3
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
          '&:hover': {
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
          },
        },
      },
    },

    // AppBar MD3
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: nordestePastel.surface.main,
          color: nordestePastel.surface.onSurface,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
      },
    },

    // TextField MD3
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: nordestePastel.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: nordestePastel.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Select MD3
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    // Pagination MD3
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 12,
            margin: '0 2px',
            '&:hover': {
              backgroundColor: nordestePastel.primary.light,
            },
            '&.Mui-selected': {
              backgroundColor: nordestePastel.primary.main,
              color: nordestePastel.primary.onPrimary,
              '&:hover': {
                backgroundColor: nordestePastel.primary.dark,
              },
            },
          },
        },
      },
    },

    // Chip MD3
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          height: 32,
        },
      },
    },

    // Paper MD3
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
        elevation2: {
          boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.30)',
        },
        elevation3: {
          boxShadow: '0px 1px 8px 4px rgba(0, 0, 0, 0.15), 0px 3px 4px 0px rgba(0, 0, 0, 0.30)',
        },
      },
    },
  },

  // Transições MD3
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;
