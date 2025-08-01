import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';

const ReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  // Datos de ejemplo
  const mockReservations = [
    {
      id: 1,
      restaurant: {
        name: 'Sakura Sushi',
        cuisine_type: 'japonesa',
      },
      reservation_date: '2025-08-05T19:30:00Z',
      party_size: 4,
      status: 'confirmada',
      table: { table_number: 'Mesa 5' },
    },
    {
      id: 2,
      restaurant: {
        name: 'Dragon Palace',
        cuisine_type: 'china',
      },
      reservation_date: '2025-07-28T20:00:00Z',
      party_size: 2,
      status: 'completada',
      table: { table_number: 'Mesa 12' },
    },
    {
      id: 3,
      restaurant: {
        name: 'Thai Garden',
        cuisine_type: 'tailandesa',
      },
      reservation_date: '2025-08-10T18:00:00Z',
      party_size: 6,
      status: 'pendiente',
      table: { table_number: 'Mesa 8' },
    },
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      // Simular carga de API
      setTimeout(() => {
        setReservations(mockReservations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return asianTheme.colors.success;
      case 'pendiente':
        return asianTheme.colors.warning;
      case 'cancelada':
        return asianTheme.colors.error;
      case 'completada':
        return asianTheme.colors.secondary.bamboo;
      default:
        return asianTheme.colors.grey.medium;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada ✅';
      case 'pendiente':
        return 'Pendiente ⏳';
      case 'cancelada':
        return 'Cancelada ❌';
      case 'completada':
        return 'Completada 🎉';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      default:
        return ASIAN_EMOJIS.FOOD;
    }
  };

  const renderReservation = ({ item }) => (
    <TouchableOpacity
      style={styles.reservationCard}
      onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>
            {getCuisineEmoji(item.restaurant.cuisine_type)} {item.restaurant.name}
          </Text>
          <Text style={styles.tableInfo}>{item.table.table_number}</Text>
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
      <Text style={styles.emptyEmoji}>{ASIAN_EMOJIS.BENTO}</Text>
      <Text style={styles.emptyTitle}>No tienes reservas</Text>
      <Text style={styles.emptyText}>
        ¡Explora nuestros restaurantes y haz tu primera reserva!
      </Text>
      <AsianButton
        title="Explorar Restaurantes"
        onPress={() => navigation.navigate('Restaurants')}
        variant="primary"
        style={styles.exploreButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        {reservations.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={reservations}
            renderItem={renderReservation}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[asianTheme.colors.primary.red]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ResponsiveContainer>
  );
};

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
    color: asianTheme.colors.secondary.bamboo,
  },

  listContainer: {
    padding: asianTheme.spacing.md,
  },

  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: asianTheme.spacing.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.sm,
  },

  restaurantInfo: {
    flex: 1,
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
  },

  statusBadge: {
    paddingHorizontal: asianTheme.spacing.sm,
    paddingVertical: asianTheme.spacing.xs,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },

  cardBody: {
    paddingHorizontal: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xs,
  },

  detailText: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    flex: 1,
  },

  cardFooter: {
    alignItems: 'flex-end',
    paddingHorizontal: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
  },

  emptyEmoji: {
    fontSize: 64,
    marginBottom: asianTheme.spacing.lg,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: asianTheme.spacing.xl,
  },

  exploreButton: {
    minWidth: 200,
  },
});

export default ReservationsScreen;