import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';

const ReservationDetailScreen = ({ route, navigation }) => {
  const { reservation } = route.params;
  const [isLoading, setIsLoading] = useState(false);

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

  const isUpcoming = () => {
    const reservationDate = new Date(reservation.reservation_date);
    const now = new Date();
    return reservationDate > now;
  };

  const canCancel = () => {
    if (reservation.status === 'cancelada' || reservation.status === 'completada') {
      return false;
    }
    
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
      
      // Aquí harías la llamada a tu API para cancelar
      console.log('Cancelando reserva:', reservation.id);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Reserva Cancelada',
        'Tu reserva ha sido cancelada exitosamente.',
        [
          {
            text: 'Entendido',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      Alert.alert('Error', 'No se pudo cancelar la reserva. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contactar Restaurante',
      `¿Cómo te gustaría contactar a ${reservation.restaurant.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Alert.alert('Función próximamente') },
        { text: 'WhatsApp', onPress: () => Alert.alert('Función próximamente') },
      ]
    );
  };

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Estado de la reserva */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
            <Text style={styles.statusText}>{getStatusText(reservation.status)}</Text>
          </View>
          
          {isUpcoming() && reservation.status === 'confirmada' && (
            <View style={styles.upcomingBadge}>
              <Ionicons name="time-outline" size={16} color="white" />
              <Text style={styles.upcomingText}>Próxima reserva</Text>
            </View>
          )}
        </View>

        {/* Información del restaurante */}
        <View style={styles.restaurantCard}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>
              {getCuisineEmoji(reservation.restaurant.cuisine_type)} {reservation.restaurant.name}
            </Text>
            <TouchableOpacity onPress={handleContact} style={styles.contactButton}>
              <Ionicons name="chatbubble-outline" size={20} color={asianTheme.colors.primary.red} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.cuisineType}>Cocina {reservation.restaurant.cuisine_type}</Text>
        </View>

        {/* Detalles de la reserva */}
        <View style={styles.detailsCard}>
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
              <Text style={styles.detailValue}>{reservation.table.table_number}</Text>
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
    backgroundColor: asianTheme.colors.accent.gold,
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

  restaurantCard: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xs,
  },

  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    flex: 1,
  },

  contactButton: {
    padding: asianTheme.spacing.sm,
  },

  cuisineType: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  detailsCard: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.md,
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
    marginTop: 2,
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
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    lineHeight: 22,
  },

  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    lineHeight: 20,
  },

  actionsCard: {
    paddingHorizontal: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.md,
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