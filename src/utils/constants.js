import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Función para obtener la URL correcta según el entorno
const getApiUrl = () => {
  if (__DEV__) {
    // Entorno de desarrollo
    if (Platform.OS === 'android') {
      // En Expo Go para Android, usa la IP del ordenador host
      // Esto funciona tanto para emulador como para dispositivo físico conectado a la misma red
      const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
      const localIp = debuggerHost?.split(':')[0] || 'http://127.0.0.1:8000/api'; // Reemplaza con tu IP si necesario
      
      return `http://${localIp}:8000/api`;
    } 
    else if (Platform.OS === 'ios') {
      // En iOS con Expo Go
      return 'http://localhost:8000/api';
    }
    // Web
    return 'http://localhost:8000/api';
  }
  
  // Producción
  return 'https://tu-api-produccion.com/api';
};

// Configuración y constantes de la aplicación
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 30000,
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH: '/auth/refresh',
    },
    RESTAURANTS: {
      LIST: '/restaurants',
      DETAIL: '/restaurants',
    },
    CLIENT: {
      RESERVATIONS: '/client/reservations',
      AVAILABLE_TABLES: '/client/available-tables',
      SERVICE: '/client/service',
    },
    ADMIN: {
      RESTAURANT: '/admin/restaurant',
      TABLES: '/admin/tables',
      STATS: '/admin/restaurant/stats',
    },
  },
};

// Roles de usuario
export const USER_ROLES = {
  CLIENT: 'cliente',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

// Claves para AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: '@restaurant_app_token',
  USER: '@restaurant_app_user',
  PREFERENCES: '@restaurant_app_preferences',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Asian Restaurant 🏮',
  VERSION: '1.0.0',
  THEME: 'asian',
  DEFAULT_LANGUAGE: 'es',
};

// Emojis asiáticos para usar en la app
export const ASIAN_EMOJIS = {
  RESTAURANT: '🏮',
  FOOD: '🍜',
  BENTO: '🍱',
  TEMPLE: '⛩️',
  CHERRY: '🌸',
  BAMBOO: '🎋',
  FLAG: '🎌',
  DRAGON: '🐉',
  LANTERN: '🏮',
};