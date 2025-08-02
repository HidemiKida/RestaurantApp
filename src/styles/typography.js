import { Platform } from 'react-native';

export const typography = {
  // Tamaños de fuente
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  
  // Pesos de fuente
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  
  // Fuentes que evocan estética oriental
  fontFamily: Platform.select({
    ios: {
      primary: 'System',
      decorative: 'Hiragino Mincho ProN',
    },
    android: {
      primary: 'Roboto',
      decorative: 'serif',
    },
    web: {
      primary: "'Noto Sans JP', sans-serif",
      decorative: "'Noto Serif JP', serif",
    },
  }),
  
  // Estilos predefinidos para usar en componentes
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 0.25,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 0.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 0.15,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: '500',
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.75,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: '500',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
  },
};