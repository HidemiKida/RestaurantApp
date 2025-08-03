import axios from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG } from '../../utils/constants';
import StorageService from '../../utils/storage';

class ApiClient {
  constructor() {
    console.log(`🔌 Inicializando API con URL: ${API_CONFIG.BASE_URL}`);
    
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar token y debug
    this.client.interceptors.request.use(
      async (config) => {
        const token = await StorageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`📡 URL completa: ${config.baseURL}${config.url}`);
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para respuestas y errores
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        // Log detallado del error para diagnóstico
        console.error('❌ Response Error:', error);
        if (error.config) {
          console.error(`🔍 Error en request a: ${error.config.url}`);
          console.error(`🔍 Método: ${error.config.method}`);
          console.error(`🔍 URL completa: ${error.config.baseURL}${error.config.url}`);
        }
        
        if (error.response) {
          console.error(`🔍 Status: ${error.response.status}`);
          console.error('🔍 Datos:', error.response.data);
        } else if (error.request) {
          console.error('🔍 No se recibió respuesta del servidor');
        } else {
          console.error('🔍 Error al configurar la petición:', error.message);
        }
        
        // Si el token expiró (401), limpiamos storage
        if (error.response?.status === 401) {
          await StorageService.clearAll();
          if (this.onUnauthenticated) {
            this.onUnauthenticated();
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Manejar errores de forma consistente
  handleError(error) {
    // Error con respuesta del servidor
    if (error.response) {
      const { status, data } = error.response;
      return {
        status,
        message: data?.message || 'Error del servidor',
        errors: data?.errors || null,
        success: false,
      };
    } 
    // Error de conexión (no hay respuesta)
    else if (error.request) {
      // En Expo Go / React Native, mensaje más específico
      const errorMsg = Platform.OS !== 'web' 
        ? 'No se puede conectar al servidor. Verifica que la URL sea correcta y que el servidor esté en ejecución.' 
        : 'Sin conexión a internet. Verifica tu conectividad 📡';
        
      return {
        status: 0,
        message: errorMsg,
        error: error.message,
        success: false,
      };
    } 
    // Timeout
    else if (error.message?.includes('timeout')) {
      return {
        status: 408,
        message: 'La conexión ha tardado demasiado. Verifica tu red o si el servidor está sobrecargado ⏱️',
        success: false,
      };
    } 
    // Otros errores
    else {
      return {
        status: 500,
        message: 'Error inesperado. Intenta nuevamente 🔄',
        error: error.message || error,
        success: false,
      };
    }
  }

  // Métodos HTTP con manejo de errores mejorado
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en GET ${url}:`, error);
      throw this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      console.log(`🔄 Enviando POST a ${url} con datos:`, data);
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en POST ${url}:`, error);
      throw this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en PUT ${url}:`, error);
      throw this.handleError(error);
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en PATCH ${url}:`, error);
      throw this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Error en DELETE ${url}:`, error);
      throw this.handleError(error);
    }
  }

  // Configurar nuevo token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common.Authorization;
    }
  }

  // Método para probar conectividad básica
  async testConnection() {
    try {
      console.log('🔄 Probando conexión al servidor...');
      const response = await this.client.get('/', { timeout: 5000 });
      console.log('✅ Conexión exitosa:', response.status);
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }
}

export default new ApiClient();