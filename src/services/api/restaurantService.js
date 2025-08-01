import apiClient from './apiClient';
import { API_CONFIG } from '../../config/api';

class RestaurantService {
  // Obtener lista de restaurantes
  async getRestaurants(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros de filtro si existen
      if (params.cuisine_type) queryParams.append('cuisine_type', params.cuisine_type);
      if (params.city) queryParams.append('city', params.city);
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);

      const url = queryParams.toString() 
        ? `${API_CONFIG.ENDPOINTS.RESTAURANTS.LIST}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.RESTAURANTS.LIST;

      const response = await apiClient.get(url);
      
      console.log('✅ Restaurantes obtenidos:', response.data?.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo restaurantes:', error);
      throw error;
    }
  }

  // Obtener detalle de un restaurante
  async getRestaurantDetail(restaurantId) {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.RESTAURANTS.DETAIL.replace(':id', restaurantId)
      );
      
      console.log('✅ Detalle de restaurante obtenido:', response.data?.data?.name);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo detalle del restaurante:', error);
      throw error;
    }
  }

  // Obtener mesas disponibles
  async getAvailableTables(params) {
    try {
      const queryParams = new URLSearchParams({
        restaurant_id: params.restaurant_id,
        reservation_date: params.reservation_date,
        party_size: params.party_size,
      });

      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CLIENT.AVAILABLE_TABLES}?${queryParams.toString()}`
      );
      
      console.log('✅ Mesas disponibles obtenidas:', response.data?.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo mesas disponibles:', error);
      throw error;
    }
  }
}

export default new RestaurantService();