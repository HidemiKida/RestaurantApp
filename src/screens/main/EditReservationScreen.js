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

const EditReservationScreen = ({ route, navigation }) => {
  const { reservation } = route.params;
  
  const [formData, setFormData] = useState({
    reservation_date: reservation.reservation_date || new Date().toISOString(),
    party_size: reservation.party_size?.toString() || '2',
    special_requests: reservation.special_requests || '',
    status: reservation.status || 'pending',
  });
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Editar Reserva',
    });
  }, [navigation]);

  const validateForm = () => {
    const errors = {};

    // Validar fecha de reserva
    const reservationDate = new Date(formData.reservation_date);
    const now = new Date();
    
    if (isNaN(reservationDate.getTime())) {
      errors.reservation_date = 'La fecha no es válida';
    } else if (reservationDate < now) {
      errors.reservation_date = 'La fecha de reservación debe ser futura';
    }

    // Validar número de personas
    const partySize = parseInt(formData.party_size);
    if (isNaN(partySize) || partySize < 1 || partySize > 20) {
      errors.party_size = 'El número de personas debe estar entre 1 y 20';
    }

    // Validar peticiones especiales
    if (formData.special_requests && formData.special_requests.length > 500) {
      errors.special_requests = 'Las solicitudes especiales no pueden exceder 500 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleUpdateReservation = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const updateData = {
        reservation_date: formData.reservation_date,
        party_size: parseInt(formData.party_size),
        special_requests: formData.special_requests,
        status: formData.status,
      };
      
      const response = await reservationService.updateReservation(reservation.id, updateData);
      
      if (response.success) {
        Alert.alert(
          '¡Reserva Actualizada! 🎉',
          'Tu reserva ha sido actualizada correctamente.',
          [
            { 
              text: 'Ver Detalles', 
              onPress: () => {
                // Navegar de vuelta a detalles con la reserva actualizada
                navigation.navigate('ReservationDetail', {
                  reservation: response.data,
                  onReservationUpdate: route.params?.onReservationUpdate
                });
              }
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Error al actualizar la reserva');
      }
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      Alert.alert(
        'Error',
        formatError(error),
        [{ text: 'Entendido', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ResponsiveContainer style={styles.content}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Ionicons 
              name="calendar-outline" 
              size={32} 
              color={asianTheme.colors.primary.red} 
            />
            <Text style={styles.headerTitle}>
              Modificar Detalles de la Reserva
            </Text>
            
            <Text style={styles.restaurantName}>
              {ASIAN_EMOJIS.RESTAURANT} {reservation.restaurant?.name || 'Restaurante'}
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Fecha y Hora */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Fecha y Hora</Text>
              <AsianInput
                placeholder="YYYY-MM-DD HH:MM:SS"
                value={formData.reservation_date}
                onChangeText={(text) => handleInputChange('reservation_date', text)}
                error={formErrors.reservation_date}
                leftIcon="calendar"
                keyboardType="default"
                hint="Formato: YYYY-MM-DD HH:MM:SS"
              />
              <Text style={styles.inputHelper}>
                Fecha actual: {formatDateTime(formData.reservation_date).date} a las {formatDateTime(formData.reservation_date).time}
              </Text>
            </View>

            {/* Número de personas */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Número de Personas</Text>
              <AsianInput
                placeholder="2"
                value={formData.party_size}
                onChangeText={(text) => handleInputChange('party_size', text)}
                error={formErrors.party_size}
                leftIcon="people"
                keyboardType="numeric"
                hint="Entre 1 y 20 personas"
              />
            </View>

            {/* Peticiones Especiales */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Peticiones Especiales</Text>
              <AsianInput
                placeholder="Ej: Mesa cerca de la ventana..."
                value={formData.special_requests}
                onChangeText={(text) => handleInputChange('special_requests', text)}
                error={formErrors.special_requests}
                leftIcon="list"
                multiline
                numberOfLines={3}
                maxLength={500}
                hint="Opcional: Peticiones especiales para el restaurante"
              />
            </View>
          </View>

          <View style={styles.actionButtons}>
            <AsianButton
              title="Guardar Cambios"
              onPress={handleUpdateReservation}
              loading={loading}
              loadingText="Actualizando..."
              icon="checkmark-circle-outline"
            />

            <AsianButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              type="secondary"
              icon="close-circle-outline"
            />
          </View>
        </ScrollView>
      </ResponsiveContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.lg,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginVertical: asianTheme.spacing.sm,
    textAlign: 'center',
  },
  restaurantName: {
    fontSize: 18,
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.sm,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: asianTheme.spacing.lg,
  },
  formGroup: {
    marginBottom: asianTheme.spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },
  inputHelper: {
    fontSize: 14,
    color: asianTheme.colors.grey.medium,
    marginTop: asianTheme.spacing.xs,
  },
  actionButtons: {
    gap: asianTheme.spacing.md,
  },
});

export default EditReservationScreen;