import { Platform } from 'react-native';
import { asianTheme } from './asianTheme';

// Función para acceder de forma segura a cualquier propiedad del tema
export const getThemeProperty = (path, fallback) => {
  try {
    const parts = path.split('.');
    let result = asianTheme;
    
    for (const part of parts) {
      result = result[part];
      if (result === undefined) return fallback;
    }
    
    return result;
  } catch (error) {
    console.warn(`Error accediendo a la propiedad del tema: ${path}`);
    return fallback;
  }
};

// Funciones específicas para propiedades comunes
export const getColor = (colorPath, fallback = '#000000') => {
  return getThemeProperty(`colors.${colorPath}`, fallback);
};

export const getSpacing = (key, fallback = 8) => {
  return getThemeProperty(`spacing.${key}`, fallback);
};

// Para manejar la estructura especial de borders.radius
export const getBorderRadius = (key, fallback = 8) => {
  const mapping = {
    sm: 'small',
    md: 'medium',
    lg: 'large',
  };
  
  const mappedKey = mapping[key] || key;
  
  // Podemos usar tanto borderRadius como borders.radius ahora
  return getThemeProperty(`borderRadius.${key}`, 
    getThemeProperty(`borders.radius.${mappedKey}`, fallback));
};

// Para manejar sombras con compatibilidad web
export const getShadow = (key) => {
  if (Platform.OS === 'web') {
    switch(key) {
      case 'sm':
      case 'small':
        return { boxShadow: '0px 2px 4px rgba(196, 30, 58, 0.1)' };
      case 'md':
      case 'medium':
        return { boxShadow: '0px 4px 8px rgba(196, 30, 58, 0.15)' };
      case 'lg':
      case 'large':
        return { boxShadow: '0px 8px 16px rgba(196, 30, 58, 0.2)' };
      default:
        return {};
    }
  }
  
  const mapping = {
    sm: 'small',
    md: 'medium',
    lg: 'large',
  };
  
  const mappedKey = mapping[key] || key;
  return getThemeProperty(`shadows.${mappedKey}`, {});
};

// Mapeo común para colores de texto
export const getTextColor = (key = 'dark') => {
  // Ahora podemos usar directamente text.dark, etc.
  return getThemeProperty(`colors.text.${key}`, getColor('primary.black'));
};

// Mapeo para colores de fondo comunes
export const getBackgroundColor = (key = 'default') => {
  // Ahora podemos usar directamente background.default, etc.
  return getThemeProperty(`colors.background.${key}`, getColor('secondary.pearl'));
};