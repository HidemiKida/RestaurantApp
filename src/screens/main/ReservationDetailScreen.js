import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import reservationService from '../../services/api/reservationService'; // Tu servicio existente
import { formatError } from '../../utils/helpers';

const ReservationDetailScreen = ({ route, navigation }) => {
  const { reservation: initialReservation, onReservationUpdate, fromBooking } = route.params;
  const [reservation, setReservation] = useState(initialReservation);
  const [isLoading, setIsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Cargar detalles actualizados de la reserva
  useEffect(() => {
    if (reservation.id && !fromBooking) {
      loadReservationDetails();
    }
  }, []);

  const loadReservationDetails = async () => {
    try {
      setDetailLoading(true);
      const response = await reservationService.getReservationDetail(reservation.id);
      
      if (response.success && response.data) {
        const updatedReservation = response.data.data || response.data;
        setReservation(updatedReservation);
        
        // Notificar a la pantalla padre si hay callback
        if (onReservationUpdate) {
          onReservationUpdate(updatedReservation);
        }
        
        console.log('✅ Detalles de reservación actualizados');
      }
    } catch (error) {
      console.error('❌ Error cargando detalles:', error);
      // No mostrar error si solo es para refrescar datos
    } finally {
      setDetailLoading(false);
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
        return 'Confirmada ✅';
      case 'pendiente':
      case 'pending':
        return 'Pendiente ⏳';
      case 'cancelada':
      case 'cancelled':
        return 'Cancelada ❌';
      case 'completada':
      case 'completed':
        return 'Completada 🎉';
      default:
        return status || 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
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
      case 'vietnamita':
        return '🍲';
      case 'india':
        return '🍛';
      default:
        return ASIAN_EMOJIS.FOOD;
    }
  };

  const isUpcoming = () => {
    const reservationDate = new Date(reservation.reservation_date);
    const now = new Date();
    return reservationDate > now;
  };

  const canCancel = () => {
    // No se puede cancelar si ya está cancelada o completada
    const status = reservation.status?.toLowerCase();
    if (status === 'cancelada' || status === 'cancelled' || 
        status === 'completada' || status === 'completed') {
      return false;
    }
    
    // Verificar si quedan más de 2 horas
    const reservationDate = new Date(reservation.reservation_date);
    const now = new Date();
    const hoursUntilReservation = (reservationDate - now) / (1000 * 60 * 60);
    
    return hoursUntilReservation > 2; // Permite cancelar hasta 2 horas antes
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.',
      [
        { text: 'No, mantener reserva', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: confirmCancel,
        },
      ]
    );
  };

  const confirmCancel = async () => {
    try {
      setIsLoading(true);
      
      // Usar tu servicio existente para cancelar
      const response = await reservationService.cancelReservation(reservation.id);

      if (response.success) {
        // Actualizar el estado local
        const cancelledReservation = {
          ...reservation,
          status: 'cancelada'
        };
        setReservation(cancelledReservation);

        // Notificar a la pantalla padre
        if (onReservationUpdate) {
          onReservationUpdate(cancelledReservation);
        }

        Alert.alert(
          'Reserva Cancelada',
          response.message || 'Tu reserva ha sido cancelada exitosamente.',
          [
            {
              text: 'Entendido',
              onPress: () => {
                // Si vino del booking, regresar a la lista de reservas
                if (fromBooking) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      { name: 'Main' },
                      { name: 'Reservations' }
                    ],
                  });
                } else {
                  navigation.goBack();
                }
              },
            },
          ]
        );
        
        console.log('✅ Reservación cancelada exitosamente');
      } else {
        throw new Error(response.message || 'Error al cancelar la reserva');
      }
      
    } catch (error) {
      console.error('❌ Error cancelando reserva:', error);
      const errorMessage = formatError(error);
      
      Alert.alert(
        'Error al Cancelar', 
        errorMessage,
        [
          { text: 'Reintentar', onPress: confirmCancel },
          { text: 'Cerrar', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contactar Restaurante',
      `¿Cómo te gustaría contactar a ${reservation.restaurant?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Alert.alert('Función próximamente') },
        { text: 'WhatsApp', onPress: () => Alert.alert('Función próximamente') },
      ]
    );
  };

  const getTimeUntilReservation = () => {
    const reservationDate = new Date(reservation.reservation_date);
    const now = new Date();
    const diffMs = reservationDate - now;
    
    if (diffMs <= 0) return null;
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `En ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `En ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `En ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
    }
  };

  if (detailLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Estado de la reserva */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
            <Text style={styles.statusText}>{getStatusText(reservation.status)}</Text>
          </View>
          
          {isUpcoming() && (reservation.status?.toLowerCase() === 'confirmada' || reservation.status?.toLowerCase() === 'confirmed') && (
            <View style={styles.upcomingBadge}>
              <Ionicons name="time-outline" size={16} color="white" />
              <Text style={styles.upcomingText}>{getTimeUntilReservation()}</Text>
            </View>
          )}
        </View>

        {/* Información del restaurante */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            {getCuisineEmoji(reservation.restaurant?.cuisine_type)} {reservation.restaurant?.name}
          </Text>
          
          {reservation.restaurant?.address && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="location" size={20} color={asianTheme.colors.primary.red} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dirección</Text>
                <Text style={styles.detailValue}>{reservation.restaurant.address}</Text>
              </View>
            </View>
          )}

          {reservation.restaurant?.phone && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="call" size={20} color={asianTheme.colors.primary.red} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Teléfono</Text>
                <Text style={styles.detailValue}>{reservation.restaurant.phone}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Detalles de la reserva */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            {ASIAN_EMOJIS.CALENDAR} Detalles de la reserva
          </Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar" size={20} color={asianTheme.colors.primary.red} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fecha</Text>
              <Text style={styles.detailValue}>{formatDate(reservation.reservation_date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="time" size={20} color={asianTheme.colors.primary.red} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Hora</Text>
              <Text style={styles.detailValue}>{formatTime(reservation.reservation_date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="restaurant" size={20} color={asianTheme.colors.primary.red} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mesa</Text>
              <Text style={styles.detailValue}>
                {reservation.table?.table_number || `Mesa ${reservation.table?.id}`}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="people" size={20} color={asianTheme.colors.primary.red} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Personas</Text>
              <Text style={styles.detailValue}>
                {reservation.party_size} {reservation.party_size === 1 ? 'persona' : 'personas'}
              </Text>
            </View>
          </View>

          {reservation.special_requests && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="chatbubble" size={20} color={asianTheme.colors.primary.red} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Solicitudes especiales</Text>
                <Text style={styles.detailValue}>{reservation.special_requests}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            {ASIAN_EMOJIS.TEMPLE} Información importante
          </Text>

          <View style={styles.infoItem}>
            <Ionicons name="location" size={16} color={asianTheme.colors.secondary.bamboo} />
            <Text style={styles.infoText}>
              No olvides llegar puntual a tu reserva
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="card" size={16} color={asianTheme.colors.secondary.bamboo} />
            <Text style={styles.infoText}>
              El pago se realiza directamente en el restaurante
            </Text>
          </View>

          {canCancel() && (
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={asianTheme.colors.warning} />
              <Text style={styles.infoText}>
                Puedes cancelar hasta 2 horas antes de tu reserva
              </Text>
            </View>
          )}
        </View>

        {/* Acciones */}
        {canCancel() && (
          <View style={styles.actionsCard}>
            <AsianButton
              title="Cancelar Reserva"
              onPress={handleCancel}
              loading={isLoading}
              variant="outline"
              style={[styles.actionButton, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
              icon={<Ionicons name="close-circle-outline" size={20} color={asianTheme.colors.error} />}
            />
          </View>
        )}

        {/* Contactar restaurante */}
        <View style={styles.actionsCard}>
          <AsianButton
            title={`Contactar Restaurante ${ASIAN_EMOJIS.PHONE}`}
            onPress={handleContact}
            variant="outline"
            style={styles.actionButton}
            icon={<Ionicons name="call-outline" size={20} color={asianTheme.colors.primary.red} />}
          />
        </View>

        {/* Reservar nuevamente */}
        <View style={styles.actionsCard}>
          <AsianButton
            title={`Reservar Nuevamente ${ASIAN_EMOJIS.BAMBOO}`}
            onPress={() => navigation.navigate('Restaurants')}
            variant="primary"
            style={styles.actionButton}
          />
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

  loadingContainer: {
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

  statusCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  statusBadge: {
    paddingHorizontal: asianTheme.spacing.lg,
    paddingVertical: asianTheme.spacing.sm,
    borderRadius: 25,
    marginBottom: asianTheme.spacing.sm,
  },

  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    // Cambiado de asianTheme.colors.accent.gold a asianTheme.colors.primary.gold
    backgroundColor: asianTheme.colors.primary.gold,
    paddingHorizontal: asianTheme.spacing.md,
    paddingVertical: asianTheme.spacing.xs,
    borderRadius: 15,
  },

  upcomingText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },

  infoCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginTop: 0,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.lg,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: asianTheme.spacing.md,
  },

  detailIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: asianTheme.spacing.sm,
    paddingTop: 2,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },

  detailValue: {
    fontSize: 16,
    color: asianTheme.colors.primary.black,
    fontWeight: '500',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.sm,
  },

  infoText: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    flex: 1,
  },

  actionsCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    marginTop: 0,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  actionButton: {
    marginBottom: asianTheme.spacing.sm,
  },

  cancelButton: {
    borderColor: asianTheme.colors.error,
  },

  cancelButtonText: {
    color: asianTheme.colors.error,
  },
});

export default ReservationDetailScreen;