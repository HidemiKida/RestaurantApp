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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  // Mock data para mesas disponibles
  const mockTables = [
    { id: 1, table_number: 'Mesa 1', capacity: 2, location: 'Ventana' },
    { id: 2, table_number: 'Mesa 5', capacity: 4, location: 'Centro' },
    { id: 3, table_number: 'Mesa 8', capacity: 6, location: 'Terraza' },
    { id: 4, table_number: 'Mesa 12', capacity: 8, location: 'VIP' },
  ];

  useEffect(() => {
    // Simular carga de mesas disponibles
    setAvailableTables(mockTables);
  }, []);

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

  const handleBookTable = () => {
    if (!selectedTable) {
      Alert.alert('Selecciona una mesa', 'Por favor selecciona una mesa antes de continuar');
      return;
    }

    navigation.navigate('Booking', {
      restaurant,
      table: selectedTable,
    });
  };

  const renderTableOption = (table) => (
    <TouchableOpacity
      key={table.id}
      style={[
        styles.tableOption,
        selectedTable?.id === table.id && styles.tableOptionSelected,
      ]}
      onPress={() => setSelectedTable(table)}
    >
      <View style={styles.tableInfo}>
        <Text style={[
          styles.tableNumber,
          selectedTable?.id === table.id && styles.tableNumberSelected,
        ]}>
          {table.table_number}
        </Text>
        
        <View style={styles.tableDetails}>
          <View style={styles.tableDetailRow}>
            <Ionicons 
              name="people-outline" 
              size={16} 
              color={selectedTable?.id === table.id ? 'white' : asianTheme.colors.secondary.bamboo} 
            />
            <Text style={[
              styles.tableDetailText,
              selectedTable?.id === table.id && styles.tableDetailTextSelected,
            ]}>
              Hasta {table.capacity} personas
            </Text>
          </View>
          
          <View style={styles.tableDetailRow}>
            <Ionicons 
              name="location-outline" 
              size={16} 
              color={selectedTable?.id === table.id ? 'white' : asianTheme.colors.secondary.bamboo} 
            />
            <Text style={[
              styles.tableDetailText,
              selectedTable?.id === table.id && styles.tableDetailTextSelected,
            ]}>
              {table.location}
            </Text>
          </View>
        </View>
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

        {/* Información del restaurante */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="star" size={20} color={asianTheme.colors.accent.gold} />
            <Text style={styles.rating}>{restaurant.rating || '4.5'} estrellas</Text>
          </View>

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
        </View>

        {/* Descripción */}
        {restaurant.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>
        )}

        {/* Selección de mesas */}
        <View style={styles.tablesSection}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.TEMPLE} Selecciona tu mesa
          </Text>
          
          <Text style={styles.sectionSubtitle}>
            Elige la mesa que prefieras para tu experiencia gastronómica
          </Text>

          <View style={styles.tablesContainer}>
            {availableTables.map(renderTableOption)}
          </View>
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
            <Text style={styles.infoCardText}>Cancelación gratuita</Text>
          </View>
        </View>

        {/* Botón de reserva */}
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
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
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

  infoSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.md,
  },

  rating: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.accent.gold,
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

  tablesSection: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
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
  },

  tableOptionSelected: {
    borderColor: asianTheme.colors.primary.red,
    backgroundColor: asianTheme.colors.primary.red,
  },

  tableInfo: {
    flex: 1,
  },

  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  tableNumberSelected: {
    color: 'white',
  },

  tableDetails: {
    gap: asianTheme.spacing.xs,
  },

  tableDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableDetailText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  tableDetailTextSelected: {
    color: 'white',
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