import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import reservationService from '../../services/api/reservationService'; // Tu servicio existente
import { formatError } from '../../utils/helpers';

const ReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Recargar reservas cuando la pantalla recibe foco (ej: después de crear una nueva)
  useFocusEffect(
    useCallback(() => {
      loadReservations(1, true);
    }, [])
  );

  const loadReservations = async (page = 1, showLoader = true) => {
    try {
      if (showLoader && page === 1) {
        setLoading(true);
      }
      setError(null);

      // Usar tu servicio existente
      const response = await reservationService.getUserReservations({ page });

      if (response.success && response.data) {
        const reservationsData = response.data.data || response.data;
        
        if (page === 1) {
          setReservations(reservationsData);
        } else {
          setReservations(prev => [...prev, ...reservationsData]);
        }

        // Actualizar paginación si viene en la respuesta
        if (response.data.pagination || response.data.current_page) {
          setPagination({
            current_page: response.data.current_page || page,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || reservationsData.length,
          });
        }

        console.log('✅ Reservas cargadas:', reservationsData.length);
      } else {
        throw new Error(response.message || 'Error al cargar las reservas');
      }
    } catch (error) {
      console.error('❌ Error loading reservations:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadReservations(page, showLoader) },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations(1, false);
  };

  const getCuisineEmoji = (cuisineType) => {
    switch (cuisineType?.toLowerCase()) {
      case 'japonesa':
        return '🍣';
      case 'china':
        return '🥟';
      case 'tailandesa':
        return '🍜';
      case 'coreana':
        return '🍲';
      case 'vietnamita':
        return '🍲';
      case 'india':
        return '🍛';
      default:
        return ASIAN_EMOJIS.FOOD;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
      case 'confirmed':
        return asianTheme.colors.success;
      case 'pendiente':
      case 'pending':
        return asianTheme.colors.warning;
      case 'cancelada':
      case 'cancelled':
        return asianTheme.colors.error;
      case 'completada':
      case 'completed':
        return asianTheme.colors.secondary.bamboo;
      default:
        return asianTheme.colors.grey.medium;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
      case 'confirmed':
        return 'Confirmada';
      case 'pendiente':
      case 'pending':
        return 'Pendiente';
      case 'cancelada':
      case 'cancelled':
        return 'Cancelada';
      case 'completada':
      case 'completed':
        return 'Completada';
      default:
        return status || 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReservationPress = (reservation) => {
    navigation.navigate('ReservationDetail', { 
      reservation,
      onReservationUpdate: (updatedReservation) => {
        // Actualizar la reserva en la lista cuando se modifique
        setReservations(prev => 
          prev.map(r => r.id === updatedReservation.id ? updatedReservation : r)
        );
      }
    });
  };

  const renderReservation = ({ item }) => (
    <TouchableOpacity
      style={styles.reservationCard}
      onPress={() => handleReservationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>
            {getCuisineEmoji(item.restaurant?.cuisine_type)} {item.restaurant?.name}
          </Text>
          <Text style={styles.tableInfo}>
            {item.table?.table_number || `Mesa ${item.table?.id}`}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={asianTheme.colors.secondary.bamboo} 
          />
          <Text style={styles.detailText}>{formatDate(item.reservation_date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons 
            name="people-outline" 
            size={16} 
            color={asianTheme.colors.secondary.bamboo} 
          />
          <Text style={styles.detailText}>
            {item.party_size} {item.party_size === 1 ? 'persona' : 'personas'}
          </Text>
        </View>

        {item.special_requests && (
          <View style={styles.detailRow}>
            <Ionicons 
              name="chatbubble-outline" 
              size={16} 
              color={asianTheme.colors.secondary.bamboo} 
            />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.special_requests}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={asianTheme.colors.primary.red} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{ASIAN_EMOJIS.CALENDAR}</Text>
      <Text style={styles.emptyTitle}>No tienes reservas aún</Text>
      <Text style={styles.emptySubtitle}>
        {error 
          ? 'Hubo un problema cargando tus reservas' 
          : 'Explora nuestros restaurantes y haz tu primera reserva'
        }
      </Text>
      
      {error ? (
        <AsianButton
          title="Reintentar"
          onPress={() => loadReservations()}
          variant="outline"
          size="small"
          style={styles.retryButton}
        />
      ) : (
        <AsianButton
          title={`Explorar Restaurantes ${ASIAN_EMOJIS.RESTAURANT}`}
          onPress={() => navigation.navigate('Restaurants')}
          variant="primary"
          size="medium"
          style={styles.exploreButton}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando tus reservas...</Text>
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        {/* Header con estadísticas */}
        {reservations.length > 0 && (
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>
              {pagination.total || reservations.length} reserva{(pagination.total || reservations.length) !== 1 ? 's' : ''} total{(pagination.total || reservations.length) !== 1 ? 'es' : ''}
            </Text>
          </View>
        )}

        <FlatList
          data={reservations}
          renderItem={renderReservation}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            reservations.length === 0 && styles.emptyListContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[asianTheme.colors.primary.red]}
              tintColor={asianTheme.colors.primary.red}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          // Paginación infinita (si la necesitas más adelante)
          onEndReached={() => {
            if (pagination.current_page < pagination.last_page && !loading) {
              loadReservations(pagination.current_page + 1, false);
            }
          }}
          onEndReachedThreshold={0.1}
        />
      </View>
    </ResponsiveContainer>
  );
};

// Los estilos se mantienen iguales...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  loadingText: {
    marginTop: asianTheme.spacing.md,
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
  },

  headerStats: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.md,
    marginHorizontal: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.md,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  statsText: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    fontWeight: '500',
  },

  listContainer: {
    padding: asianTheme.spacing.md,
    paddingTop: asianTheme.spacing.sm,
  },

  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: asianTheme.spacing.md,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: asianTheme.spacing.md,
  },

  restaurantInfo: {
    flex: 1,
    marginRight: asianTheme.spacing.md,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  tableInfo: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    fontWeight: '500',
  },

  statusBadge: {
    paddingHorizontal: asianTheme.spacing.sm,
    paddingVertical: asianTheme.spacing.xs,
    borderRadius: 12,
  },

  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  cardBody: {
    gap: asianTheme.spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: asianTheme.spacing.sm,
  },

  detailText: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    flex: 1,
  },

  cardFooter: {
    alignItems: 'flex-end',
    marginTop: asianTheme.spacing.sm,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: asianTheme.spacing.xxl,
    paddingHorizontal: asianTheme.spacing.xl,
  },

  emptyEmoji: {
    fontSize: 64,
    marginBottom: asianTheme.spacing.lg,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.sm,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: asianTheme.spacing.xl,
  },

  retryButton: {
    marginTop: asianTheme.spacing.md,
  },

  exploreButton: {
    marginTop: asianTheme.spacing.md,
    minWidth: 200,
  },
});

export default ReservationsScreen;