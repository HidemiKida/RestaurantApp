import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import restaurantService from '../../services/api/restaurantService';
import { formatError } from '../../utils/helpers';

const RestaurantsScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async (page = 1, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await restaurantService.getRestaurants({
        page,
        per_page: 10,
      });

      if (response.success && response.data) {
        const { data: restaurantList, ...paginationData } = response.data;
        
        if (page === 1) {
          setRestaurants(restaurantList);
        } else {
          // Para paginación (si implementas infinite scroll)
          setRestaurants(prev => [...prev, ...restaurantList]);
        }
        
        setPagination(paginationData);
      } else {
        throw new Error(response.message || 'Error cargando restaurantes');
      }
    } catch (error) {
      console.error('Error cargando restaurantes:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadRestaurants(page, showLoader) },
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
    loadRestaurants(1, false);
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

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.restaurantImage}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>
              {getCuisineEmoji(item.cuisine_type)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        
        <View style={styles.cuisineContainer}>
          <Text style={styles.cuisineText}>
            {getCuisineEmoji(item.cuisine_type)} Cocina {item.cuisine_type}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Ionicons 
            name="location-outline" 
            size={16} 
            color={asianTheme.colors.secondary.bamboo} 
          />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Ionicons 
            name="time-outline" 
            size={16} 
            color={asianTheme.colors.secondary.bamboo} 
          />
          <Text style={styles.hours}>
            {item.opening_time} - {item.closing_time}
          </Text>
        </View>

        {/* Estado del restaurante */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_active ? asianTheme.colors.success : asianTheme.colors.error }
          ]}>
            <Text style={styles.statusText}>
              {item.is_active ? 'Abierto' : 'Cerrado'}
            </Text>
          </View>
          
          {item.max_capacity && (
            <Text style={styles.capacityText}>
              Hasta {item.max_capacity} personas
            </Text>
          )}
        </View>
      </View>

      <View style={styles.arrowContainer}>
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
      <Text style={styles.emptyEmoji}>{ASIAN_EMOJIS.RESTAURANT}</Text>
      <Text style={styles.emptyTitle}>No hay restaurantes disponibles</Text>
      <Text style={styles.emptySubtitle}>
        {error ? 'Hubo un problema cargando los restaurantes' : 'No se encontraron restaurantes en este momento'}
      </Text>
      {error && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadRestaurants()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        {/* Header con estadísticas */}
        {restaurants.length > 0 && (
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>
              {pagination.total} restaurante{pagination.total !== 1 ? 's' : ''} disponible{pagination.total !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            restaurants.length === 0 && styles.emptyListContainer
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
        />
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
    fontSize: 16,
  },

  headerStats: {
    padding: asianTheme.spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },

  statsText: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
  },

  listContainer: {
    padding: asianTheme.spacing.md,
  },

  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: asianTheme.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  restaurantImage: {
    width: 100,
    height: 120,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: asianTheme.colors.grey.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderEmoji: {
    fontSize: 30,
  },

  restaurantInfo: {
    flex: 1,
    padding: asianTheme.spacing.md,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  cuisineContainer: {
    marginBottom: asianTheme.spacing.sm,
  },

  cuisineText: {
    fontSize: 14,
    color: asianTheme.colors.primary.red,
    fontWeight: '600',
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xs,
  },

  address: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    flex: 1,
  },

  hours: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: asianTheme.spacing.sm,
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

  capacityText: {
    fontSize: 12,
    color: asianTheme.colors.secondary.bamboo,
  },

  arrowContainer: {
    justifyContent: 'center',
    paddingRight: asianTheme.spacing.md,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: asianTheme.spacing.xl,
  },

  emptyEmoji: {
    fontSize: 80,
    marginBottom: asianTheme.spacing.lg,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.md,
  },

  emptySubtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: asianTheme.spacing.lg,
  },

  retryButton: {
    backgroundColor: asianTheme.colors.primary.red,
    paddingHorizontal: asianTheme.spacing.lg,
    paddingVertical: asianTheme.spacing.md,
    borderRadius: 8,
  },

  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantsScreen;