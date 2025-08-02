import { colors } from './colors';
import { typography } from './typography';
import { Platform } from 'react-native'; // Añade esta importación


// Colores orientales mejorados
const orientalColors = {
  primary: {
    red: '#C41E3A',       // Rojo tradicional chino
    gold: '#D4AF37',      // Oro imperial chino
    black: '#000000',
    dark: '#1A1A1A',
  },
  secondary: {
    bamboo: '#7B9A3F',    // Verde bambú
    jade: '#00A86B',      // Jade chino
    pearl: '#F9F6F0',     // Blanco perla
    plum: '#8E4585',      // Ciruela japonesa
    cherry: '#FFB7C5',    // Flor de cerezo
  },
  accent: {
    indigo: '#4B0082',    // Índigo japonés
    copper: '#B87333',    // Bronce antiguo
    lacquer: '#91252F',   // Laca japonesa
  },
  grey: {
    light: '#F5F5F5',
    medium: '#CCCCCC',
    dark: '#666666',
  },
};

// Fuentes con estilo oriental
const orientalTypography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  // Fuentes que evocan estética oriental
  fontFamily: {
    primary: Platform.select({
      ios: 'Hiragino Sans',
      android: 'Noto Sans JP',
      web: "'Noto Sans JP', sans-serif",
    }),
    decorative: Platform.select({
      ios: 'Hiragino Mincho ProN',
      android: 'Noto Serif JP',
      web: "'Noto Serif JP', serif",
    }),
  },
};

// Bordes y decoraciones orientales
const orientalDecorations = {
  borders: {
    radius: {
      small: 4,
      medium: 8,
      large: 16,
      round: 50,
      sm: 4,
      md: 8,
      lg: 16,
    },
    width: {
      thin: 1,
      medium: 2,
      thick: 3,
    },
    styles: {
      // Bordes especiales con estilo oriental
      paper: {
        borderWidth: 1,
        borderColor: orientalColors.secondary.bamboo,
        borderStyle: 'solid',
      },
      doubleLine: {
        borderWidth: 2,
        borderColor: orientalColors.primary.gold,
        borderStyle: 'double',
      },
    },
  },
};

// Define los estilos de sombra
const shadowStyles = {
  small: {
    shadowColor: colors.primary.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.primary.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.primary.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

const shadowAliases = {
  sm: shadowStyles.small,
  md: shadowStyles.medium,
  lg: shadowStyles.large,
};
export const asianTheme = {
  colors: {
    ...colors,
    white: '#FFFFFF', // Añadir esto para evitar usar 'white' directamente
    text: {
      dark: colors.primary.black,
      light: colors.secondary.pearl,
      primary: colors.primary.red,
      secondary: colors.secondary.bamboo,
    },
    background: {
      default: colors.secondary.pearl,
      card: '#FFFFFF',
      primary: colors.primary.red,
      secondary: colors.secondary.bamboo,
    },
    primary: {
      ...colors.primary,
      light: 'rgba(196, 30, 58, 0.1)', // Versión clara del rojo
    },
    // Añadir directamente colores comunes para evitar errores
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
  typography, // Esta es la referencia a typography.js
  
  // El resto se mantiene igual
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Mantener esto para compatibilidad
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    round: 50,
  },
  
  borders: {
    radius: {
      small: 8,
      medium: 12,
      large: 16,
      round: 50,
      // Añadir alias para compatibilidad
      sm: 8,
      md: 12,
      lg: 16,
    },
    width: {
      thin: 1,
      medium: 2,
      thick: 3,
    },
  },
  borderRadius: orientalDecorations.borders.radius,
  borders: orientalDecorations.borders,
  shadows: shadowStyles,
  shadow: shadowAliases,
  // Patrones orientales
  patterns: {
    wave: "url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"10\" viewBox=\"0 0 20 10\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 5C2.5 2.5 7.5 2.5 10 5C12.5 7.5 17.5 7.5 20 5V10H0V5Z\" fill=\"%23F5F5DC\" opacity=\"0.2\"/></svg>')",
    bamboo: "url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"8\" y=\"0\" width=\"4\" height=\"20\" fill=\"%237B9A3F\" opacity=\"0.1\"/></svg>')",
    sakura: "url('data:image/svg+xml;utf8,<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"20\" cy=\"20\" r=\"5\" fill=\"%23FFB7C5\" opacity=\"0.2\"/><circle cx=\"10\" cy=\"20\" r=\"3\" fill=\"%23FFB7C5\" opacity=\"0.15\"/><circle cx=\"30\" cy=\"20\" r=\"3\" fill=\"%23FFB7C5\" opacity=\"0.15\"/><circle cx=\"20\" cy=\"10\" r=\"3\" fill=\"%23FFB7C5\" opacity=\"0.15\"/><circle cx=\"20\" cy=\"30\" r=\"3\" fill=\"%23FFB7C5\" opacity=\"0.15\"/></svg>')",
  },
  components: {
    // Componentes con estilo oriental
    card: {
      container: {
        backgroundColor: '#FFFFFF',
        borderRadius: orientalDecorations.borders.radius.medium,
        padding: 16,
        ...shadowAliases.sm,
        borderLeftWidth: 4,
        borderLeftColor: orientalColors.primary.red,
      },
      header: {
        borderBottomWidth: 1,
        borderBottomColor: orientalColors.grey.light,
        paddingBottom: 8,
        marginBottom: 16,
      },
      title: {
        fontFamily: orientalTypography.fontFamily.decorative,
        color: orientalColors.primary.red,
        fontSize: orientalTypography.sizes.lg,
        fontWeight: orientalTypography.weights.semiBold,
      },
    },
    button: {
      primary: {
        backgroundColor: orientalColors.primary.red,
        borderRadius: orientalDecorations.borders.radius.medium,
        paddingVertical: 12,
        paddingHorizontal: 24,
        ...shadowAliases.sm,
      },
      secondary: {
        backgroundColor: orientalColors.secondary.bamboo,
        borderRadius: orientalDecorations.borders.radius.medium,
        paddingVertical: 12,
        paddingHorizontal: 24,
        ...shadowAliases.sm,
      },
      text: {
        color: '#FFFFFF',
        fontWeight: orientalTypography.weights.semiBold,
        textAlign: 'center',
      },
    },
  },
};