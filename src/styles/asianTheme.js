import { colors } from './colors';
import { typography } from './typography';

export const asianTheme = {
  colors,
  typography,
  
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Bordes y sombras
  borders: {
    radius: {
      small: 8,
      medium: 12,
      large: 16,
      round: 50,
    },
    width: {
      thin: 1,
      medium: 2,
      thick: 3,
    },
  },
  
  // Sombras con estilo asiático
  shadows: {
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
  },
  
  // Componentes base
  components: {
    button: {
      primary: {
        backgroundColor: colors.primary.red,
        color: colors.secondary.pearl,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
      },
      secondary: {
        backgroundColor: colors.primary.gold,
        color: colors.primary.black,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.primary.red,
        borderWidth: 2,
        color: colors.primary.red,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
      },
    },
    card: {
      backgroundColor: colors.secondary.pearl,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    input: {
      backgroundColor: colors.secondary.pearl,
      borderColor: colors.secondary.bamboo,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.primary.black,
    },
  },
};