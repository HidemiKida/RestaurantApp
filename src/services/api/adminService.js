import apiClient from './apiClient';
import { API_CONFIG } from '../../config/api';

class AdminService {
  // Obtener estadísticas del restaurante
  async getRestaurantStats() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.STATS);
      
      if (response.success) {
        console.log('✅ Estadísticas del restaurante obtenidas');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Obtener información del restaurante para admin
  async getRestaurantInfo() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.RESTAURANT);
      
      if (response.success) {
        console.log('✅ Información del restaurante obtenida');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo información del restaurante:', error);
      throw error;
    }
  }

  // Obtener reservas con filtros para admin
  async getReservations(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.date) queryParams.append('date', params.date);
      if (params.table_id) queryParams.append('table_id', params.table_id);
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const url = queryParams.toString() 
        ? `${API_CONFIG.ENDPOINTS.ADMIN.RESERVATIONS}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.ADMIN.RESERVATIONS;

      const response = await apiClient.get(url);
      
      if (response.success) {
        console.log('✅ Reservas admin obtenidas:', response.data?.data?.length || 0);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo reservas admin:', error);
      throw error;
    }
  }

  // Actualizar estado de reserva
  async updateReservationStatus(reservationId, status) {
    try {
      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.ADMIN.RESERVATIONS}/${reservationId}/status`,
        { status }
      );
      
      if (response.success) {
        console.log('✅ Estado de reserva actualizado:', reservationId, status);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error actualizando estado de reserva:', error);
      throw error;
    }
  }

  // Obtener mesas para admin
  async getTables(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.location) queryParams.append('location', params.location);

      const url = queryParams.toString() 
        ? `${API_CONFIG.ENDPOINTS.ADMIN.TABLES}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.ADMIN.TABLES;

      const response = await apiClient.get(url);
      
      if (response.success) {
        console.log('✅ Mesas admin obtenidas:', response.data?.data?.length || 0);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo mesas admin:', error);
      throw error;
    }
  }
}

export default new AdminService();