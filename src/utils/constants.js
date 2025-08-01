// Configuración y constantes de la aplicación
export const API_CONFIG = {
  // Cambia esta URL por la de tu backend Laravel
  BASE_URL: 'http://localhost:8000/api', // 🔄 CAMBIAR POR TU URL
  TIMEOUT: 10000,
  
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