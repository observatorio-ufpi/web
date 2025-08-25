import { createTheme } from '@mui/material/styles';

// Paleta de cores Material Design 3
const md3Colors = {
  // Cores primárias
  primary: {
    main: '#6750A4', // MD3 Primary
    light: '#D0BCFF',
    dark: '#4F378B',
    container: '#EADDFF',
    onContainer: '#21005D',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#21005D',
  },

  // Cores secundárias
  secondary: {
    main: '#625B71', // MD3 Secondary
    light: '#E8DEF8',
    dark: '#3B2F5F',
    container: '#E8DEF8',
    onContainer: '#1D192B',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1D192B',
  },

  // Cores terciárias
  tertiary: {
    main: '#7D5260', // MD3 Tertiary
    light: '#FFB4AB',
    dark: '#633B48',
    container: '#FFB4AB',
    onContainer: '#31111D',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#31111D',
  },

  // Cores de erro
  error: {
    main: '#BA1A1A', // MD3 Error
    light: '#FFB4AB',
    dark: '#93000A',
    container: '#FFDAD6',
    onContainer: '#410002',
    onError: '#FFFFFF',
    onErrorContainer: '#410002',
  },

  // Cores de superfície
  surface: {
    main: '#FFFBFE', // MD3 Surface
    variant: '#E7E0EC',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },

  // Cores de fundo
  background: {
    default: '#FFFBFE',
    paper: '#FFFBFE',
  },

  // Cores neutras
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Criar o tema MD3
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: md3Colors.primary,
    secondary: md3Colors.secondary,
    tertiary: md3Colors.tertiary,
    error: md3Colors.error,
    surface: md3Colors.surface,
    background: md3Colors.background,
    grey: md3Colors.grey,
    text: {
      primary: md3Colors.surface.onSurface,
      secondary: md3Colors.surface.onSurfaceVariant,
    },
    divider: md3Colors.surface.outlineVariant,
  },

  // Formas e bordas MD3
  shape: {
    borderRadius: 16, // MD3 border radius padrão
  },

  // Tipografia MD3
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
          borderRadius: 20, // MD3 button shape
          padding: '10px 24px',
          minHeight: 40,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
          },
          '&:active': {
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
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
          backgroundColor: md3Colors.surface.main,
          color: md3Colors.surface.onSurface,
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
              borderColor: md3Colors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: md3Colors.primary.main,
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
              backgroundColor: md3Colors.primary.light,
            },
            '&.Mui-selected': {
              backgroundColor: md3Colors.primary.main,
              color: md3Colors.primary.onPrimary,
              '&:hover': {
                backgroundColor: md3Colors.primary.dark,
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
