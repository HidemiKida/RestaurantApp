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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';

const RestaurantsScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo - luego conectarás con tu API
  const mockRestaurants = [
    {
      id: 1,
      name: 'Sakura Sushi',
      cuisine_type: 'japonesa',
      address: 'Centro Comercial Plaza',
      image_url: null,
      opening_time: '11:00',
      closing_time: '22:00',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dragon Palace',
      cuisine_type: 'china',
      address: 'Zona Rosa',
      image_url: null,
      opening_time: '12:00',
      closing_time: '23:00',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Thai Garden',
      cuisine_type: 'tailandesa',
      address: 'Barrio Norte',
      image_url: null,
      opening_time: '11:30',
      closing_time: '21:30',
      rating: 4.7,
    },
  ];

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      // Simular carga de API
      setTimeout(() => {
        setRestaurants(mockRestaurants);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error cargando restaurantes:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRestaurants();
    setRefreshing(false);
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

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
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
            {getCuisineEmoji(item.cuisine_type)} {item.cuisine_type}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Ionicons 
            name="location-outline" 
            size={16} 
            color={asianTheme.colors.secondary.bamboo} 
          />
          <Text style={styles.address}>{item.address}</Text>
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

        <View style={styles.ratingContainer}>
          <Ionicons 
            name="star" 
            size={16} 
            color={asianTheme.colors.accent.gold} 
          />
          <Text style={styles.rating}>{item.rating}</Text>
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

  if (loading) {
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
        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
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
    height: 100,
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

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: asianTheme.spacing.xs,
  },

  rating: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    fontWeight: 'bold',
    color: asianTheme.colors.accent.gold,
  },

  arrowContainer: {
    justifyContent: 'center',
    paddingRight: asianTheme.spacing.md,
  },
});

export default RestaurantsScreen;