import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';
import reservationService from '../../services/api/reservationService';
import { formatError, validators } from '../../utils/helpers';
import { useAuth } from '../../context/auth/AuthContext';

const BookingScreen = ({ route, navigation }) => {
  const { restaurant, table, searchParams } = route.params;
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    special_requests: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Configurar el título de la pantalla
    navigation.setOptions({
      title: `Reservar en ${restaurant.name}`,
    });
  }, [navigation, restaurant.name]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        weekday: 'long',
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

  const validateForm = () => {
    const errors = {};

    // Validaciones básicas
    if (formData.special_requests && formData.special_requests.length > 500) {
      errors.special_requests = 'Las solicitudes especiales no pueden exceder 500 caracteres';
    }

    // Validar que la fecha sea futura
    const reservationDate = new Date(searchParams.reservation_date);
    const now = new Date();
    if (reservationDate <= now) {
      errors.date = 'La fecha de reservación debe ser futura';
    }

    // Validar que el número de personas sea válido
    if (!searchParams.party_size || searchParams.party_size < 1 || searchParams.party_size > 20) {
      errors.party_size = 'El número de personas debe estar entre 1 y 20';
    }

    // Validar que el número de personas no exceda la capacidad de la mesa
    if (searchParams.party_size > table.capacity) {
      errors.party_size = `La mesa seleccionada tiene capacidad para ${table.capacity} personas máximo`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCreateReservation = async () => {
    if (!validateForm()) {
      Alert.alert('Error en el formulario', 'Por favor corrige los errores antes de continuar');
      return;
    }

    try {
      setLoading(true);

      const reservationData = {
        restaurant_id: restaurant.id,
        table_id: table.id,
        reservation_date: searchParams.reservation_date,
        party_size: searchParams.party_size,
        special_requests: formData.special_requests.trim() || null,
      };

      const response = await reservationService.createReservation(reservationData);

      if (response.success && response.data) {
        // Mostrar confirmación
        Alert.alert(
          '¡Reservación Confirmada! 🎉',
          `Tu mesa ha sido reservada exitosamente en ${restaurant.name}`,
          [
            {
              text: 'Ver Detalles',
              onPress: () => {
                // Navegar a los detalles de la reservación
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'Main' },
                    { 
                      name: 'ReservationDetail', 
                      params: { 
                        reservation: response.data,
                        fromBooking: true 
                      } 
                    }
                  ],
                });
              }
            },
            {
              text: 'Mis Reservas',
              onPress: () => {
                // Navegar a la lista de reservas
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'Main' },
                    { name: 'Reservations' }
                  ],
                });
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Error creando la reservación');
      }
    } catch (error) {
      console.error('Error creando reservación:', error);
      const errorMessage = formatError(error);
      
      Alert.alert(
        'Error al Reservar',
        errorMessage,
        [
          { text: 'Reintentar', onPress: handleCreateReservation },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (loading) {
      Alert.alert(
        'Reservación en proceso',
        '¿Estás seguro de que quieres cancelar? Se perderá el progreso de tu reservación.',
        [
          { text: 'Continuar reservando', style: 'cancel' },
          { text: 'Sí, cancelar', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const { date, time } = formatDateTime(searchParams.reservation_date);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ResponsiveContainer>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Resumen de la reserva */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {ASIAN_EMOJIS.RESTAURANT} Resumen de tu reserva
            </Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Restaurante:</Text>
              <Text style={styles.summaryValue}>
                {getCuisineEmoji(restaurant.cuisine_type)} {restaurant.name}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mesa:</Text>
              <Text style={styles.summaryValue}>{table.table_number}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Capacidad:</Text>
              <Text style={styles.summaryValue}>Hasta {table.capacity} personas</Text>
            </View>
            
            {table.location && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ubicación:</Text>
                <Text style={styles.summaryValue}>{table.location}</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha:</Text>
              <Text style={styles.summaryValue}>{date}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hora:</Text>
              <Text style={styles.summaryValue}>{time}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Personas:</Text>
              <Text style={styles.summaryValue}>{searchParams.party_size} persona{searchParams.party_size !== 1 ? 's' : ''}</Text>
            </View>
          </View>

          {/* Información del cliente */}
          <View style={styles.clientInfoCard}>
            <Text style={styles.cardTitle}>
              {ASIAN_EMOJIS.CUSTOMER} Información del cliente
            </Text>
            
            <View style={styles.clientInfoRow}>
              <Ionicons name="person-outline" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.clientInfoText}>{user?.name}</Text>
            </View>
            
            <View style={styles.clientInfoRow}>
              <Ionicons name="mail-outline" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.clientInfoText}>{user?.email}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.clientInfoRow}>
                <Ionicons name="call-outline" size={20} color={asianTheme.colors.primary.red} />
                <Text style={styles.clientInfoText}>{user.phone}</Text>
              </View>
            )}
          </View>

          {/* Solicitudes especiales */}
          <View style={styles.requestsCard}>
            <Text style={styles.cardTitle}>
              {ASIAN_EMOJIS.MESSAGE} Solicitudes especiales (opcional)
            </Text>
            
            <Text style={styles.requestsSubtitle}>
              ¿Tienes alguna solicitud especial? Compártela con el restaurante
            </Text>

            <AsianInput
              label=""
              value={formData.special_requests}
              onChangeText={(value) => handleInputChange('special_requests', value)}
              placeholder="Ej: Celebración de cumpleaños, necesidades dietéticas, ubicación preferida..."
              multiline
              numberOfLines={4}
              maxLength={500}
              error={formErrors.special_requests}
              style={styles.requestsInput}
            />
            
            <Text style={styles.characterCount}>
              {formData.special_requests.length}/500 caracteres
            </Text>
          </View>

          {/* Términos y condiciones */}
          <View style={styles.termsCard}>
            <Text style={styles.cardTitle}>
              {ASIAN_EMOJIS.TEMPLE} Términos de la reserva
            </Text>

            <View style={styles.termItem}>
              <Ionicons name="checkmark-circle" size={16} color={asianTheme.colors.success} />
              <Text style={styles.termText}>
                Tu reserva será confirmada inmediatamente
              </Text>
            </View>

            <View style={styles.termItem}>
              <Ionicons name="time" size={16} color={asianTheme.colors.warning} />
              <Text style={styles.termText}>
                Puedes cancelar hasta 2 horas antes sin costo
              </Text>
            </View>

            <View style={styles.termItem}>
              <Ionicons name="card" size={16} color={asianTheme.colors.primary.red} />
              <Text style={styles.termText}>
                El pago se realiza directamente en el restaurante
              </Text>
            </View>

            <View style={styles.termItem}>
              <Ionicons name="location" size={16} color={asianTheme.colors.secondary.bamboo} />
              <Text style={styles.termText}>
                Por favor, llega puntual para mantener tu reserva
              </Text>
            </View>
          </View>

          {/* Mostrar errores de validación */}
          {Object.keys(formErrors).length > 0 && (
            <View style={styles.errorCard}>
              <Ionicons name="warning" size={20} color={asianTheme.colors.error} />
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>Corrige los siguientes errores:</Text>
                {Object.values(formErrors).map((error, index) => (
                  <Text key={index} style={styles.errorText}>• {error}</Text>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <AsianButton
            title="Volver"
            onPress={handleGoBack}
            variant="outline"
            size="medium"
            disabled={loading}
            style={styles.backButton}
          />
          
          <AsianButton
            title={loading ? 'Reservando...' : `Confirmar Reserva ${ASIAN_EMOJIS.BAMBOO}`}
            onPress={handleCreateReservation}
            variant="primary"
            size="medium"
            loading={loading}
            disabled={loading}
            style={styles.confirmButton}
          />
        </View>

        {/* Loading overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
              <Text style={styles.loadingText}>Creando tu reservación...</Text>
              <Text style={styles.loadingSubtext}>Por favor espera un momento</Text>
            </View>
          </View>
        )}
      </ResponsiveContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  scrollContainer: {
    flex: 1,
  },

  summaryCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.sm,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: asianTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },

  summaryLabel: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    fontWeight: '500',
  },

  summaryValue: {
    fontSize: 14,
    color: asianTheme.colors.primary.black,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },

  clientInfoCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.sm,
    marginBottom: asianTheme.spacing.sm,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
  },

  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.sm,
  },

  clientInfoText: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.primary.black,
  },

  requestsCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.sm,
    marginBottom: asianTheme.spacing.sm,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  requestsSubtitle: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.md,
    lineHeight: 20,
  },

  requestsInput: {
    marginBottom: asianTheme.spacing.sm,
  },

  characterCount: {
    fontSize: 12,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'right',
  },

  termsCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.sm,
    marginBottom: asianTheme.spacing.sm,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: asianTheme.spacing.sm,
  },

  termText: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.primary.black,
    flex: 1,
    lineHeight: 20,
  },

  errorCard: {
    backgroundColor: asianTheme.colors.error + '10',
    margin: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.sm,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: asianTheme.colors.error + '30',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  errorTextContainer: {
    marginLeft: asianTheme.spacing.sm,
    flex: 1,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: asianTheme.colors.error,
    marginBottom: asianTheme.spacing.xs,
  },

  errorText: {
    fontSize: 14,
    color: asianTheme.colors.error,
    marginBottom: asianTheme.spacing.xs,
  },

  actionButtons: {
    flexDirection: 'row',
    padding: asianTheme.spacing.lg,
    paddingTop: asianTheme.spacing.md,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: asianTheme.colors.grey.light,
    gap: asianTheme.spacing.md,
  },

  backButton: {
    flex: 1,
  },

  confirmButton: {
    flex: 2,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingCard: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: asianTheme.spacing.xl,
  },

  loadingText: {
    marginTop: asianTheme.spacing.md,
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
  },

  loadingSubtext: {
    marginTop: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },
});

export default BookingScreen;