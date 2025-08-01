import { USER_ROLES, ASIAN_EMOJIS } from './constants';

// Validaciones
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  password: (password) => {
    return password && password.length >= 8;
  },
  
  phone: (phone) => {
    if (!phone) return true; // Es opcional
    const re = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return re.test(phone);
  },
  
  name: (name) => {
    return name && name.trim().length >= 2;
  },
};

// Formatear respuestas de error
export const formatError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.errors) {
    // Si hay errores de validación, tomar el primero
    const firstError = Object.values(error.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }
  
  return 'Error inesperado. Intenta nuevamente 🔄';
};

// Obtener nombre del rol en español
export const getRoleName = (role) => {
  const roleNames = {
    [USER_ROLES.CLIENT]: 'Cliente',
    [USER_ROLES.ADMIN]: 'Administrador',
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
  };
  
  return roleNames[role] || 'Usuario';
};

// Obtener emoji según el rol
export const getRoleEmoji = (role) => {
  const roleEmojis = {
    [USER_ROLES.CLIENT]: ASIAN_EMOJIS.CHERRY,
    [USER_ROLES.ADMIN]: ASIAN_EMOJIS.LANTERN,
    [USER_ROLES.SUPER_ADMIN]: ASIAN_EMOJIS.DRAGON,
  };
  
  return roleEmojis[role] || ASIAN_EMOJIS.BAMBOO;
};

// Formatear fechas
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timeString) => {
  const date = new Date(`2000-01-01T${timeString}`);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generar saludo según la hora
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return `Buenos días ${ASIAN_EMOJIS.CHERRY}`;
  } else if (hour < 18) {
    return `Buenas tardes ${ASIAN_EMOJIS.LANTERN}`;
  } else {
    return `Buenas noches ${ASIAN_EMOJIS.FLAG}`;
  }
};