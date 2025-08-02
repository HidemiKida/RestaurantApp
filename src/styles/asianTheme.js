import { colors } from './colors';
import { typography } from './typography';

// Definimos primero las sombras que usaremos
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

// Crear alias para mantener compatibilidad
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
  typography,
  
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
  
  // Mantener la estructura actual con nombres completos
  shadows: shadowStyles,
  
  // Añadir un alias para compatibilidad directa con asianTheme.shadow.sm
  shadow: shadowAliases,
  
  components: {
    // Se mantienen igual
  },
};