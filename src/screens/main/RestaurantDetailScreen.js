import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import restaurantService from '../../services/api/restaurantService';
import { formatError } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant: initialRestaurant } = route.params;
  
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para la búsqueda de mesas
  const [searchParams, setSearchParams] = useState({
    party_size: 2,
    reservation_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas desde ahora
  });

  useEffect(() => {
    loadRestaurantDetail();
  }, []);

  useEffect(() => {
    if (restaurant) {
      loadAvailableTables();
    }
  }, [searchParams, restaurant]);

  const loadRestaurantDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await restaurantService.getRestaurantDetail(initialRestaurant.id);
      
      if (response.success && response.data) {
        setRestaurant(response.data);
        console.log('✅ Detalle del restaurante cargado:', response.data.name);
      } else {
        throw new Error(response.message || 'Error cargando detalles del restaurante');
      }
    } catch (error) {
      console.error('Error cargando detalle del restaurante:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: loadRestaurantDetail },
          { text: 'Volver', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTables = async () => {
    try {
      setTablesLoading(true);
      
      const response = await restaurantService.getAvailableTables({
        restaurant_id: restaurant.id,
        reservation_date: searchParams.reservation_date,
        party_size: searchParams.party_size,
      });
      
      if (response.success && response.data) {
        setAvailableTables(response.data);
        setSelectedTable(null); // Resetear selección cuando cambien las mesas
        console.log('✅ Mesas disponibles cargadas:', response.data.length);
      } else {
        throw new Error(response.message || 'Error cargando mesas disponibles');
      }
    } catch (error) {
      console.error('Error cargando mesas disponibles:', error);
      const errorMessage = formatError(error);
      
      // Para mesas, mostramos un mensaje menos intrusivo
      setAvailableTables([]);
      Alert.alert('Información', 'No hay mesas disponibles para la fecha y hora seleccionadas');
    } finally {
      setTablesLoading(false);
    }
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

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handlePartySizeChange = (newSize) => {
    setSearchParams(prev => ({
      ...prev,
      party_size: newSize
    }));
  };

  const handleDateTimeChange = () => {
    // Aquí podrías abrir un DateTimePicker
    // Por ahora, incrementamos 1 hora como ejemplo
    const newDate = new Date(searchParams.reservation_date);
    newDate.setHours(newDate.getHours() + 1);
    
    setSearchParams(prev => ({
      ...prev,
      reservation_date: newDate.toISOString()
    }));
  };

  const handleBookTable = () => {
    if (!selectedTable) {
      Alert.alert('Selecciona una mesa', 'Por favor selecciona una mesa antes de continuar');
      return;
    }

    navigation.navigate('Booking', {
      restaurant,
      table: selectedTable,
      searchParams,
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const isRestaurantOpen = () => {
    if (!restaurant.is_active) return false;
    
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    return restaurant.opening_days?.includes(dayOfWeek);
  };

  const renderPartySizeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>Número de personas:</Text>
      <View style={styles.partySizeButtons}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
          <TouchableOpacity
            key={size}
            style={[
              styles.partySizeButton,
              searchParams.party_size === size && styles.partySizeButtonSelected
            ]}
            onPress={() => handlePartySizeChange(size)}
          >
            <Text style={[
              styles.partySizeButtonText,
              searchParams.party_size === size && styles.partySizeButtonTextSelected
            ]}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDateTimeSelector = () => {
    const { date, time } = formatDateTime(searchParams.reservation_date);
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Fecha y hora:</Text>
        <TouchableOpacity style={styles.dateTimeButton} onPress={handleDateTimeChange}>
          <Ionicons name="calendar-outline" size={20} color={asianTheme.colors.primary.red} />
          <Text style={styles.dateTimeText}>{date} • {time}</Text>
          <Ionicons name="chevron-down" size={20} color={asianTheme.colors.secondary.bamboo} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTableOption = (table) => (
    <TouchableOpacity
      key={table.id}
      style={[
        styles.tableOption,
        selectedTable?.id === table.id && styles.tableOptionSelected,
      ]}
      onPress={() => handleTableSelect(table)}
    >
      <View style={styles.tableInfo}>
        <View style={styles.tableHeader}>
          <Text style={[
            styles.tableNumber,
            selectedTable?.id === table.id && styles.tableNumberSelected,
          ]}>
            {table.table_number}
          </Text>
          
          <View style={styles.tableCapacity}>
            <Ionicons 
              name="people-outline" 
              size={16} 
              color={selectedTable?.id === table.id ? 'white' : asianTheme.colors.secondary.bamboo} 
            />
            <Text style={[
              styles.tableCapacityText,
              selectedTable?.id === table.id && styles.tableCapacityTextSelected,
            ]}>
              {table.capacity} personas
            </Text>
          </View>
        </View>
        
        {table.location && (
          <View style={styles.tableLocation}>
            <Ionicons 
              name="location-outline" 
              size={16} 
              color={selectedTable?.id === table.id ? 'white' : asianTheme.colors.secondary.bamboo} 
            />
            <Text style={[
              styles.tableLocationText,
              selectedTable?.id === table.id && styles.tableLocationTextSelected,
            ]}>
              {table.location}
            </Text>
          </View>
        )}
      </View>
      
      {selectedTable?.id === table.id && (
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color="white" 
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando detalles del restaurante...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😔</Text>
        <Text style={styles.errorTitle}>Ups, algo salió mal</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <AsianButton
          title="Reintentar"
          onPress={loadRestaurantDetail}
          variant="primary"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Imagen del restaurante */}
        <View style={styles.imageContainer}>
          {restaurant.image_url ? (
            <Image source={{ uri: restaurant.image_url }} style={styles.restaurantImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>
                {getCuisineEmoji(restaurant.cuisine_type)}
              </Text>
            </View>
          )}
          
          {/* Overlay con información básica */}
          <View style={styles.imageOverlay}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.cuisineType}>
              {getCuisineEmoji(restaurant.cuisine_type)} Cocina {restaurant.cuisine_type}
            </Text>
          </View>
        </View>

        {/* Estado del restaurante */}
        <View style={styles.statusBar}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isRestaurantOpen() ? asianTheme.colors.success : asianTheme.colors.error }
          ]}>
            <Text style={styles.statusText}>
              {isRestaurantOpen() ? 'Abierto ahora' : 'Cerrado'}
            </Text>
          </View>
        </View>

        {/* Información del restaurante */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={asianTheme.colors.primary.red} />
            <Text style={styles.address}>{restaurant.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={asianTheme.colors.primary.red} />
            <Text style={styles.hours}>
              {restaurant.opening_time} - {restaurant.closing_time}
            </Text>
          </View>

          {restaurant.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.phone}>{restaurant.phone}</Text>
            </View>
          )}
        </View>

        {/* Descripción */}
        {restaurant.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>
        )}

        {/* Búsqueda de mesas */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.CALENDAR} Buscar mesa
          </Text>
          
          {renderPartySizeSelector()}
          {renderDateTimeSelector()}
          
          <AsianButton
            title="Buscar mesas disponibles"
            onPress={loadAvailableTables}
            loading={tablesLoading}
            variant="outline"
            size="small"
            style={styles.searchButton}
          />
        </View>

        {/* Selección de mesas */}
        <View style={styles.tablesSection}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.TEMPLE} Mesas disponibles
          </Text>
          
          {tablesLoading ? (
            <View style={styles.tablesLoading}>
              <ActivityIndicator color={asianTheme.colors.primary.red} />
              <Text style={styles.tablesLoadingText}>Buscando mesas disponibles...</Text>
            </View>
          ) : availableTables.length > 0 ? (
            <>
              <Text style={styles.sectionSubtitle}>
                Elige la mesa que prefieras para tu experiencia gastronómica
              </Text>
              <View style={styles.tablesContainer}>
                {availableTables.map(renderTableOption)}
              </View>
            </>
          ) : (
            <View style={styles.noTablesContainer}>
              <Text style={styles.noTablesEmoji}>🙁</Text>
              <Text style={styles.noTablesText}>
                No hay mesas disponibles para la fecha y hora seleccionadas
              </Text>
              <Text style={styles.noTablesSubtext}>
                Intenta con otra fecha, hora o número de personas
              </Text>
            </View>
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoCard}>
            <Ionicons 
              name="shield-checkmark" 
              size={24} 
              color={asianTheme.colors.success} 
            />
            <Text style={styles.infoCardText}>Reserva confirmada al instante</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons 
              name="card" 
              size={24} 
              color={asianTheme.colors.primary.red} 
            />
            <Text style={styles.infoCardText}>Pago en el restaurante</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons 
              name="time" 
              size={24} 
              color={asianTheme.colors.accent.gold} 
            />
            <Text style={styles.infoCardText}>Cancelación gratuita hasta 2h antes</Text>
          </View>
        </View>

        {/* Botón de reserva */}
        {availableTables.length > 0 && (
          <View style={styles.bookingSection}>
            <AsianButton
              title={`Reservar Mesa ${ASIAN_EMOJIS.BAMBOO}`}
              onPress={handleBookTable}
              variant="primary"
              size="large"
              disabled={!selectedTable}
              style={styles.bookButton}
            />
            
            {!selectedTable && (
              <Text style={styles.selectTableHint}>
                Selecciona una mesa para continuar
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  loadingContainer: {
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

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  errorEmoji: {
    fontSize: 80,
    marginBottom: asianTheme.spacing.lg,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.md,
  },

  errorMessage: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: asianTheme.spacing.lg,
  },

  retryButton: {
    marginTop: asianTheme.spacing.md,
  },

  imageContainer: {
    height: 250,
    position: 'relative',
  },

  restaurantImage: {
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
    fontSize: 80,
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: asianTheme.spacing.lg,
  },

  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: asianTheme.spacing.xs,
  },

  cuisineType: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },

  statusBar: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.md,
    alignItems: 'center',
  },

  statusIndicator: {
    paddingHorizontal: asianTheme.spacing.md,
    paddingVertical: asianTheme.spacing.sm,
    borderRadius: 20,
  },

  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  infoSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.sm,
  },

  address: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 16,
    color: asianTheme.colors.primary.black,
    flex: 1,
  },

  hours: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 16,
    color: asianTheme.colors.primary.black,
  },

  phone: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 16,
    color: asianTheme.colors.primary.black,
  },

  descriptionSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.lg,
    lineHeight: 20,
  },

  description: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    lineHeight: 24,
  },

  searchSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  selectorContainer: {
    marginBottom: asianTheme.spacing.md,
  },

  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.sm,
  },

  partySizeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: asianTheme.spacing.sm,
  },

  partySizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: asianTheme.colors.grey.light,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  partySizeButtonSelected: {
    borderColor: asianTheme.colors.primary.red,
    backgroundColor: asianTheme.colors.primary.red,
  },

  partySizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.secondary.bamboo,
  },

  partySizeButtonTextSelected: {
    color: 'white',
  },

  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: asianTheme.spacing.md,
    borderWidth: 1,
    borderColor: asianTheme.colors.grey.light,
    borderRadius: 8,
    backgroundColor: 'white',
  },

  dateTimeText: {
    flex: 1,
    marginLeft: asianTheme.spacing.sm,
    fontSize: 16,
    color: asianTheme.colors.primary.black,
  },

  searchButton: {
    marginTop: asianTheme.spacing.md,
  },

  tablesSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  tablesLoading: {
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
  },

  tablesLoadingText: {
    marginTop: asianTheme.spacing.sm,
    color: asianTheme.colors.secondary.bamboo,
  },

  tablesContainer: {
    gap: asianTheme.spacing.sm,
  },

  tableOption: {
    borderWidth: 2,
    borderColor: asianTheme.colors.grey.light,
    borderRadius: 12,
    padding: asianTheme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  tableOptionSelected: {
    borderColor: asianTheme.colors.primary.red,
    backgroundColor: asianTheme.colors.primary.red,
  },

  tableInfo: {
    flex: 1,
  },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xs,
  },

  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
  },

  tableNumberSelected: {
    color: 'white',
  },

  tableCapacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableCapacityText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  tableCapacityTextSelected: {
    color: 'white',
  },

  tableLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableLocationText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  tableLocationTextSelected: {
    color: 'white',
  },

  noTablesContainer: {
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
  },

  noTablesEmoji: {
    fontSize: 60,
    marginBottom: asianTheme.spacing.md,
  },

  noTablesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.sm,
  },

  noTablesSubtext: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
  },

  additionalInfo: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.md,
  },

  infoCardText: {
    marginLeft: asianTheme.spacing.md,
    fontSize: 16,
    color: asianTheme.colors.primary.black,
  },

  bookingSection: {
    padding: asianTheme.spacing.lg,
    backgroundColor: 'white',
    marginBottom: asianTheme.spacing.xl,
  },

  bookButton: {
    marginBottom: asianTheme.spacing.sm,
  },

  selectTableHint: {
    textAlign: 'center',
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    fontStyle: 'italic',
  },
});

export default RestaurantDetailScreen;