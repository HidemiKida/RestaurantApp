import apiClient from './apiClient';
import { API_CONFIG } from '../../config/api';

class ReservationService {
  // Crear nueva reservación
  async createReservation(reservationData) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLIENT.RESERVATIONS, {
        restaurant_id: reservationData.restaurant_id,
        table_id: reservationData.table_id,
        reservation_date: reservationData.reservation_date,
        party_size: reservationData.party_size,
        special_requests: reservationData.special_requests || null,
      });

      if (response.success && response.data) {
        console.log('✅ Reservación creada exitosamente:', response.data.id);
      }

      return response;
    } catch (error) {
      console.error('❌ Error creando reservación:', error);
      throw error;
    }
  }

  // Obtener reservaciones del usuario
  async getUserReservations(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.date) queryParams.append('date', params.date);
      if (params.page) queryParams.append('page', params.page);

      const url = queryParams.toString() 
        ? `${API_CONFIG.ENDPOINTS.CLIENT.RESERVATIONS}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.CLIENT.RESERVATIONS;

      const response = await apiClient.get(url);
      
      console.log('✅ Reservaciones obtenidas:', response.data?.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo reservaciones:', error);
      throw error;
    }
  }

  // Obtener detalle de una reservación
  async getReservationDetail(reservationId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CLIENT.RESERVATIONS}/${reservationId}`
      );
      
      console.log('✅ Detalle de reservación obtenido:', response.data?.data?.id);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo detalle de reservación:', error);
      throw error;
    }
  }

  // Cancelar reservación
  async cancelReservation(reservationId) {
    try {
      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.CLIENT.RESERVATIONS}/${reservationId}/cancel`
      );
      
      console.log('✅ Reservación cancelada:', reservationId);
      return response;
    } catch (error) {
      console.error('❌ Error cancelando reservación:', error);
      throw error;
    }
  }
}

export default new ReservationService();