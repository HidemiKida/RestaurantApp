import axios from 'axios';
import { API_CONFIG } from '../../utils/constants';
import StorageService from '../../utils/storage';

class ApiClient {
  constructor() {
    // Crear instancia de axios con configuración base
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar token automáticamente
    this.client.interceptors.request.use(
      async (config) => {
        const token = await StorageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas y errores
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error('❌ Response Error:', error);
        
        // Si el token expiró (401), limpiamos storage
        if (error.response?.status === 401) {
          await StorageService.clearAll();
          // Aquí podrías redirigir al login
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Manejar errores de forma consistente
  handleError(error) {
    if (error.response) {
      // Error con respuesta del servidor
      const { status, data } = error.response;
      return {
        status,
        message: data?.message || 'Error del servidor',
        errors: data?.errors || null,
        success: false,
      };
    } else if (error.request) {
      // Error de conexión
      return {
        status: 0,
        message: 'Sin conexión a internet. Verifica tu conectividad 📡',
        success: false,
      };
    } else {
      // Error desconocido
      return {
        status: 500,
        message: 'Error inesperado. Intenta nuevamente 🔄',
        success: false,
      };
    }
  }

  // Métodos HTTP básicos
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Configurar nuevo token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.Authorization;
    }
  }
}

export default new ApiClient();