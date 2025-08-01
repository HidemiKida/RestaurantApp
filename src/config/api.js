export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:8000/api'  // Para desarrollo local
    : 'https://tu-servidor.com/api', // Para producción
  
  TIMEOUT: 10000,
  
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
      DETAIL: '/restaurants/:id',
    },
    
    CLIENT: {
      RESERVATIONS: '/client/reservations',          // ← NUEVO
      AVAILABLE_TABLES: '/client/available-tables',
    },
    
    ADMIN: {
      RESTAURANT: '/admin/restaurant',
      TABLES: '/admin/tables',
      RESERVATIONS: '/admin/reservations',
      STATS: '/admin/restaurant/stats',
    }
  }
};