import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../../styles/asianTheme';
import { 
  getColor, 
  getSpacing, 
  getBorderRadius, 
  getShadow, 
  getTextColor, 
  getBackgroundColor 
} from '../../styles/themeUtils';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import adminService from '../../services/api/adminService';
import { formatError } from '../../utils/helpers';

// Configuración del calendario en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const ReservationCalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservations, setReservations] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  // Cargar reservas cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadMonthData();
    }, [])
  );

  // Cargar reservas cuando cambia el mes en el calendario
  useEffect(() => {
    loadMonthData();
  }, [calendarMonth]);

  // Cargar reservas cuando cambia la fecha seleccionada
  useEffect(() => {
    loadDayReservations(selectedDate);
  }, [selectedDate]);

  const loadMonthData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError(null);

      // Obtener el primer y último día del mes
      const date = new Date();
      date.setMonth(calendarMonth);
      
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

      // Obtener todas las reservas del mes
      const response = await adminService.getReservations({
        start_date: firstDay,
        end_date: lastDay,
        per_page: 100, // Obtener un número grande para tener todas las del mes
      });

      if (response.success && response.data) {
        const monthReservations = response.data.data || response.data;
        
        // Crear objeto de marcadores para el calendario
        const marked = {};
        
        monthReservations.forEach(reservation => {
          const date = reservation.reservation_date.split('T')[0];
          
          if (!marked[date]) {
            marked[date] = {
              marked: true,
              dotColor: getStatusColor(reservation.status),
              selectedDotColor: getStatusColor(reservation.status),
            };
          }
        });
        
        // Marcar la fecha seleccionada
        marked[selectedDate] = {
          ...marked[selectedDate],
          selected: true,
          selectedColor: getColor('primary.light'),
        };
        
        setMarkedDates(marked);
        
        // Si estamos mirando la fecha seleccionada, también actualizamos las reservas del día
        if (!dayLoading) {
          loadDayReservations(selectedDate, false);
        }
        
        console.log('✅ Datos del mes cargados:', Object.keys(marked).length, 'días con reservas');
      } else {
        throw new Error(response.message || 'Error al cargar reservaciones del mes');
      }
    } catch (error) {
      console.error('❌ Error loading month data:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadMonthData() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDayReservations = async (date, showLoader = true) => {
    try {
      if (showLoader) {
        setDayLoading(true);
      }

      const response = await adminService.getReservations({
        date: date,
        per_page: 50, // Mostrar más reservas para el día seleccionado
      });

      if (response.success && response.data) {
        const dayReservations = response.data.data || response.data;
        setReservations(dayReservations);
        
        console.log(`✅ Reservas cargadas para ${date}:`, dayReservations.length);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error(`❌ Error loading reservations for ${date}:`, error);
      setReservations([]);
    } finally {
      setDayLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMonthData(false);
  };

  const handleDayPress = (day) => {
    // Actualizar marcas
    const newMarkedDates = { ...markedDates };
    
    // Desmarcar la selección anterior
    if (markedDates[selectedDate]) {
      newMarkedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: false,
      };
    }
    
    // Marcar la nueva selección
    newMarkedDates[day.dateString] = {
      ...markedDates[day.dateString],
      selected: true,
      selectedColor: getColor('primary.light'),
    };
    
    setMarkedDates(newMarkedDates);
    setSelectedDate(day.dateString);
  };

  const handleMonthChange = (month) => {
    setCalendarMonth(month.month - 1); // Mes en JS es 0-indexed
  };

  const handleReservationPress = (reservation) => {
    navigation.navigate('ReservationDetail', { reservation });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada':
      case 'confirmed':
        return getColor('success');
      case 'pendiente':
      case 'pending':
        return getColor('warning');
      case 'cancelada':
      case 'cancelled':
        return getColor('error');
      case 'completada':
      case 'completed':
        return getColor('secondary.bamboo');
      default:
        return getColor('grey.medium');
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderReservationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reservationItem}
      onPress={() => handleReservationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(item.reservation_date)}
        </Text>
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: getStatusColor(item.status) }
          ]} 
        />
      </View>
      
      <View style={styles.reservationInfo}>
        <Text style={styles.clientName}>
          {item.user?.name || 'Cliente'}
        </Text>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={16} color={getColor('secondary.bamboo')} />
            <Text style={styles.detailText}>
              {item.party_size} {item.party_size === 1 ? 'persona' : 'personas'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="restaurant" size={16} color={getColor('secondary.bamboo')} />
            <Text style={styles.detailText}>
              Mesa #{item.table?.number || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text 
          style={[
            styles.statusText, 
            { color: getStatusColor(item.status) }
          ]}
        >
          {getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={getColor('primary.red')} />
            <Text style={styles.loadingText}>Cargando calendario...</Text>
          </View>
        ) : (
          <>
            <View style={styles.calendarContainer}>
              <Calendar
                current={selectedDate}
                onDayPress={handleDayPress}
                onMonthChange={handleMonthChange}
                markedDates={markedDates}
                hideExtraDays={true}
                enableSwipeMonths={true}
                renderArrow={(direction) => (
                  <Ionicons
                    name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                    size={20}
                    color={getColor('primary.red')}
                  />
                )}
                theme={{
                  calendarBackground: 'white',
                  textSectionTitleColor: getColor('secondary.bamboo'),
                  selectedDayBackgroundColor: getColor('primary.red'),
                  selectedDayTextColor: 'white',
                  todayTextColor: getColor('primary.red'),
                  dayTextColor: getTextColor('dark'),
                  textDisabledColor: getColor('grey.light'),
                  arrowColor: getColor('primary.red'),
                  monthTextColor: getColor('primary.red'),
                  indicatorColor: getColor('primary.red'),
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
              />
            </View>
            
            <View style={styles.reservationsContainer}>
              <View style={styles.dayHeader}>
                <Text style={styles.selectedDate}>
                  {formatSelectedDate(selectedDate)}
                </Text>
                
                <AsianButton
                  title="Nueva Reserva"
                  variant="primary"
                  size="small"
                  onPress={() => navigation.navigate('CreateReservation')}
                  icon={<Ionicons name="add-circle-outline" size={18} color="white" />}
                />
              </View>
              
              {dayLoading ? (
                <View style={styles.dayLoadingContainer}>
                  <ActivityIndicator size="small" color={getColor('primary.red')} />
                  <Text style={styles.dayLoadingText}>Cargando reservas...</Text>
                </View>
              ) : (
                <FlatList
                  data={reservations}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderReservationItem}
                  contentContainerStyle={styles.reservationsList}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                      colors={[getColor('primary.red')]}
                      tintColor={getColor('primary.red')}
                    />
                  }
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Ionicons 
                        name="calendar-outline" 
                        size={64} 
                        color={getColor('grey.light')}
                      />
                      <Text style={styles.emptyText}>
                        No hay reservas para este día
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </>
        )}
      </ResponsiveContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getBackgroundColor('default'),
  },
  content: {
    flex: 1,
    padding: 0, // Sin padding para maximizar espacio
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: getSpacing('md'),
    color: getColor('grey.dark'),
    fontSize: 16,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: getColor('grey.light'),
    ...getShadow('sm'),
  },
  reservationsContainer: {
    flex: 1,
    backgroundColor: getBackgroundColor('default'),
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: getColor('grey.light'),
    backgroundColor: 'white',
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor('primary.red'),
  },
  dayLoadingContainer: {
    padding: getSpacing('lg'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLoadingText: {
    marginLeft: getSpacing('sm'),
    color: getColor('grey.dark'),
  },
  reservationsList: {
    padding: getSpacing('md'),
    paddingBottom: isTablet ? getSpacing('xl') : 100, // Espacio para navegación en la parte inferior
  },
  emptyContainer: {
    padding: getSpacing('xl') * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: getSpacing('md'),
    fontSize: 16,
    color: getColor('grey.dark'),
    textAlign: 'center',
  },
  reservationItem: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('md'),
    marginBottom: getSpacing('md'),
    flexDirection: 'row',
    ...getShadow('sm'),
  },
  timeContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing('md'),
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: getColor('grey.dark'),
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: getSpacing('sm'),
  },
  reservationInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: getTextColor('dark'),
    marginBottom: getSpacing('xs'),
  },
  reservationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: getSpacing('md'),
    marginBottom: getSpacing('xs'),
  },
  detailText: {
    fontSize: 14,
    color: getColor('grey.dark'),
    marginLeft: getSpacing('xs'),
  },
  statusBadge: {
    borderRadius: getBorderRadius('sm'),
    paddingHorizontal: getSpacing('sm'),
    paddingVertical: getSpacing('xs'),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ReservationCalendarScreen;