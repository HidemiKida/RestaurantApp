import axios from 'axios';
import { API_CONFIG } from './constants';

// Función para verificar conectividad al servidor
export const checkServerConnection = async () => {
  try {
    console.log('🔍 Verificando conexión al servidor...');
    await axios.get(`${API_CONFIG.BASE_URL}/ping`, { 
      timeout: 5000 
    });
    console.log('✅ Servidor accesible');
    return true;
  } catch (error) {
    console.log('❌ Servidor no accesible:', error.message);
    return false;
  }
};

// Función para verificar conectividad a internet
export const checkInternetConnection = async () => {
  try {
    console.log('🔍 Verificando conexión a internet...');
    await axios.get('https://www.google.com/generate_204', { 
      timeout: 5000 
    });
    console.log('✅ Internet accesible');
    return true;
  } catch (error) {
    console.log('❌ Internet no accesible:', error.message);
    return false;
  }
};

// Función completa que verifica internet y servidor
export const diagnoseConnection = async () => {
  const hasInternet = await checkInternetConnection();
  if (!hasInternet) {
    return {
      connected: false,
      internet: false,
      server: false,
      message: 'No hay conexión a Internet'
    };
  }
  
  const serverReachable = await checkServerConnection();
  if (!serverReachable) {
    return {
      connected: false,
      internet: true,
      server: false,
      message: 'Hay conexión a Internet pero el servidor no está disponible'
    };
  }
  
  return {
    connected: true,
    internet: true,
    server: true,
    message: 'Conexión completa establecida'
  };
};