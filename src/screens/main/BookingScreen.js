import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';

const BookingScreen = ({ route, navigation }) => {
  const { restaurant, table } = route.params;
  
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    time: new Date(),
    partySize: '2',
    specialRequests: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configurar fecha mínima (hoy)
  const minDate = new Date();
  // Configurar fecha máxima (3 meses adelante)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBookingData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBookingData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const validateBooking = () => {
    const errors = [];

    // Validar tamaño del grupo
    const partySize = parseInt(bookingData.partySize);
    if (!partySize || partySize < 1 || partySize > table.capacity) {
      errors.push(`El número de personas debe ser entre 1 y ${table.capacity}`);
    }

    // Validar fecha (no puede ser en el pasado)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('La fecha no puede ser en el pasado');
    }

    // Validar horario del restaurante
    const selectedTime = bookingData.time;
    const openingTime = new Date();
    const [openHour, openMinute] = restaurant.opening_time.split(':');
    openingTime.setHours(parseInt(openHour), parseInt(openMinute), 0, 0);
    
    const closingTime = new Date();
    const [closeHour, closeMinute] = restaurant.closing_time.split(':');
    closingTime.setHours(parseInt(closeHour), parseInt(closeMinute), 0, 0);

    if (selectedTime < openingTime || selectedTime > closingTime) {
      errors.push(`El horario debe ser entre ${restaurant.opening_time} y ${restaurant.closing_time}`);
    }

    return errors;
  };

  const handleBooking = async () => {
    const errors = validateBooking();
    
    if (errors.length > 0) {
      Alert.alert('Error en la reserva', errors.join('\n'));
      return;
    }

    try {
      setIsLoading(true);

      // Combinar fecha y hora
      const reservationDateTime = new Date(bookingData.date);
      reservationDateTime.setHours(
        bookingData.time.getHours(),
        bookingData.time.getMinutes(),
        0,
        0
      );

      // Aquí harías la llamada a tu API
      const reservationData = {
        restaurant_id: restaurant.id,
        table_id: table.id,
        reservation_date: reservationDateTime.toISOString(),
        party_size: parseInt(bookingData.partySize),
        special_requests: bookingData.specialRequests,
      };

      console.log('Datos de reserva:', reservationData);

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        '¡Reserva Exitosa! 🎉',
        `Tu mesa ha sido reservada en ${restaurant.name} para el ${formatDate(bookingData.date)} a las ${formatTime(bookingData.time)}.`,
        [
          {
            text: 'Ver mis reservas',
            onPress: () => navigation.navigate('Reservations'),
          },
          {
            text: 'Continuar explorando',
            onPress: () => navigation.navigate('Restaurants'),
          },
        ]
      );

    } catch (error) {
      console.error('Error al hacer reserva:', error);
      Alert.alert('Error', 'No se pudo completar la reserva. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Resumen de la reserva */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {ASIAN_EMOJIS.RESTAURANT} Resumen de tu reserva
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Restaurante:</Text>
            <Text style={styles.summaryValue}>{restaurant.name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mesa:</Text>
            <Text style={styles.summaryValue}>{table.table_number}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Capacidad:</Text>
            <Text style={styles.summaryValue}>Hasta {table.capacity} personas</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ubicación:</Text>
            <Text style={styles.summaryValue}>{table.location}</Text>
          </View>
        </View>

        {/* Formulario de reserva */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Detalles de la reserva</Text>

          {/* Selector de fecha */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fecha</Text>
            <AsianButton
              title={formatDate(bookingData.date)}
              onPress={() => setShowDatePicker(true)}
              variant="outline"
              style={styles.dateButton}
              icon={<Ionicons name="calendar-outline" size={20} color={asianTheme.colors.primary.red} />}
            />
          </View>

          {/* Selector de hora */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hora</Text>
            <AsianButton
              title={formatTime(bookingData.time)}
              onPress={() => setShowTimePicker(true)}
              variant="outline"
              style={styles.dateButton}
              icon={<Ionicons name="time-outline" size={20} color={asianTheme.colors.primary.red} />}
            />
          </View>

          {/* Número de personas */}
          <View style={styles.inputGroup}>
            <AsianInput
              label="Número de personas"
              value={bookingData.partySize}
              onChangeText={(value) => setBookingData(prev => ({ ...prev, partySize: value }))}
              placeholder="2"
              keyboardType="numeric"
              icon={<Ionicons name="people-outline" size={20} color={asianTheme.colors.primary.red} />}
            />
            <Text style={styles.capacityHint}>
              Máximo {table.capacity} personas para esta mesa
            </Text>
          </View>

          {/* Solicitudes especiales */}
          <View style={styles.inputGroup}>
            <AsianInput
              label="Solicitudes especiales (opcional)"
              value={bookingData.specialRequests}
              onChangeText={(value) => setBookingData(prev => ({ ...prev, specialRequests: value }))}
              placeholder="Ej: Celebración de cumpleaños, alergias alimentarias..."
              multiline
              numberOfLines={3}
              icon={<Ionicons name="chatbubble-outline" size={20} color={asianTheme.colors.primary.red} />}
            />
          </View>
        </View>

        {/* Información importante */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {ASIAN_EMOJIS.TEMPLE} Información importante
          </Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color={asianTheme.colors.success} />
            <Text style={styles.infoText}>Tu reserva será confirmada automáticamente</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color={asianTheme.colors.warning} />
            <Text style={styles.infoText}>Puedes cancelar hasta 2 horas antes</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="card" size={16} color={asianTheme.colors.primary.red} />
            <Text style={styles.infoText}>El pago se realiza directamente en el restaurante</Text>
          </View>
        </View>

        {/* Botón de confirmar */}
        <View style={styles.confirmSection}>
          <AsianButton
            title={`Confirmar Reserva ${ASIAN_EMOJIS.CHERRY}`}
            onPress={handleBooking}
            loading={isLoading}
            variant="primary"
            size="large"
          />
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={bookingData.date}
            mode="date"
            display="default"
            minimumDate={minDate}
            maximumDate={maxDate}
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={bookingData.time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
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

  summaryCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: asianTheme.spacing.sm,
  },

  summaryLabel: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    flex: 1,
    textAlign: 'right',
  },

  formCard: {
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

  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.lg,
  },

  inputGroup: {
    marginBottom: asianTheme.spacing.lg,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.sm,
  },

  dateButton: {
    justifyContent: 'flex-start',
  },

  capacityHint: {
    fontSize: 12,
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.xs,
    fontStyle: 'italic',
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

  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
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

  confirmSection: {
    padding: asianTheme.spacing.lg,
  },
});

export default BookingScreen;