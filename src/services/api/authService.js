import apiClient from './apiClient';
import { API_CONFIG } from '../../utils/constants';
import StorageService from '../../utils/storage';

class AuthService {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        phone: userData.phone || null,
      });

      if (response.success && response.data) {
        // Guardar token y usuario
        await StorageService.saveToken(response.data.token);
        await StorageService.saveUser(response.data.user);
        
        // Configurar token en cliente API
        apiClient.setAuthToken(response.data.token);
        
        console.log('✅ Registro exitoso:', response.data.user.name);
      }

      return response;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(credentials) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
      });

      if (response.success && response.data) {
        // Guardar token y usuario
        await StorageService.saveToken(response.data.token);
        await StorageService.saveUser(response.data.user);
        
        // Configurar token en cliente API
        apiClient.setAuthToken(response.data.token);
        
        console.log('✅ Login exitoso:', response.data.user.name);
      }

      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      
      if (response.success && response.data) {
        // Actualizar datos del usuario en storage
        await StorageService.saveUser(response.data.user);
        console.log('✅ Perfil actualizado:', response.data.user.name);
      }

      return response;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      // Intentar logout en el servidor
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('⚠️ Error en logout del servidor:', error);
      // Continuamos con el logout local aunque falle el servidor
    } finally {
      // Limpiar storage local
      await StorageService.clearAll();
      
      // Remover token del cliente API
      apiClient.setAuthToken(null);
      
      console.log('✅ Logout completado');
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
      
      if (response.success && response.data) {
        // Actualizar token
        await StorageService.saveToken(response.data.token);
        apiClient.setAuthToken(response.data.token);
        
        console.log('✅ Token renovado');
      }

      return response;
    } catch (error) {
      console.error('❌ Error renovando token:', error);
      // Si falla el refresh, hacer logout
      await this.logout();
      throw error;
    }
  }

  // Verificar si hay una sesión válida al iniciar la app
  async checkAuthStatus() {
    try {
      const token = await StorageService.getToken();
      const user = await StorageService.getUser();

      if (!token || !user) {
        return { isAuthenticated: false, user: null };
      }

      // Configurar token en cliente API
      apiClient.setAuthToken(token);

      // Verificar que el token siga siendo válido
      try {
        const profileResponse = await this.getProfile();
        if (profileResponse.success) {
          return { 
            isAuthenticated: true, 
            user: profileResponse.data.user 
          };
        }
      } catch (error) {
        // Si el token no es válido, limpiar storage
        await StorageService.clearAll();
        apiClient.setAuthToken(null);
      }

      return { isAuthenticated: false, user: null };
    } catch (error) {
      console.error('❌ Error verificando estado de auth:', error);
      return { isAuthenticated: false, user: null };
    }
  }
}

export default new AuthService();