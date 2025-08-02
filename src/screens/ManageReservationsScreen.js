import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../styles/asianTheme';
import { 
  getColor, 
  getSpacing, 
  getBorderRadius, 
  getShadow, 
  getTextColor, 
  getBackgroundColor 
} from '../styles/themeUtils';
import { ASIAN_EMOJIS } from '../utils/constants';
import ResponsiveContainer from '../components/common/ResponsiveContainer';
import AsianButton from '../components/common/AsianButton';
import adminService from '../services/api/adminService';
import { formatError } from '../utils/helpers';

const ManageReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Recargar reservas cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [])
  );

  const loadReservations = async (page = 1, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await adminService.getReservations({ page });

      if (response.success && response.data) {
        const reservationsData = response.data.data || response.data;
        
        if (page === 1) {
          setReservations(reservationsData);
        } else {
          setReservations(prev => [...prev, ...reservationsData]);
        }

        // Actualizar paginación si viene en la respuesta
        if (response.data.pagination || response.data.current_page) {
          setPagination({
            current_page: response.data.current_page || page,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || reservationsData.length,
          });
        }

        console.log('✅ Reservas cargadas:', reservationsData.length);
      } else {
        throw new Error(response.message || 'Error al cargar las reservas');
      }
    } catch (error) {
      console.error('❌ Error loading reservations:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadReservations(page, showLoader) },
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
    loadReservations(1, false);
  };

  const handleCreateReservation = () => {
    navigation.navigate('CreateReservation');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReservationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reservationCard}
      onPress={() => handleReservationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.reservation_date)}</Text>
          <Text style={styles.timeText}>{formatTime(item.reservation_date)}</Text>
        </View>
        
        <View 
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
        >
          <Text 
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.clientInfo}>
          <Ionicons name="person" size={16} color={getColor('secondary.bamboo')} />
          <Text style={styles.clientName}>
            {item.user?.name || 'Cliente'}
          </Text>
        </View>
        
        <View style={styles.reservationDetail}>
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
      
      {item.special_requests && (
        <View style={styles.specialRequests}>
          <Text style={styles.specialRequestsLabel}>Peticiones especiales:</Text>
          <Text style={styles.specialRequestsText}>{item.special_requests}</Text>
        </View>
      )}
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditReservation', { reservation: item })}
        >
          <Ionicons name="create-outline" size={18} color={getColor('secondary.bamboo')} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            /* Implementar confirmación de reserva */
            Alert.alert('Implementar', 'Función para confirmar reserva');
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={getColor('success')} />
          <Text style={[styles.actionText, { color: getColor('success') }]}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {ASIAN_EMOJIS.CALENDAR} Gestión de Reservas
          </Text>
          
          <AsianButton
            title="Nueva Reserva"
            onPress={handleCreateReservation}
            variant="primary"
            size="small"
            icon={<Ionicons name="add-circle-outline" size={18} color="white" />}
          />
        </View>
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={getColor('primary.red')} />
            <Text style={styles.loadingText}>Cargando reservas...</Text>
          </View>
        ) : (
          <FlatList
            data={reservations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReservationItem}
            contentContainerStyle={styles.reservationsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[getColor('primary.red')]}
                tintColor={getColor('primary.red')}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar" size={64} color={getColor('grey.light')} />
                <Text style={styles.emptyText}>
                  No hay reservas para mostrar
                </Text>
                <AsianButton
                  title="Crear Reserva"
                  onPress={handleCreateReservation}
                  variant="primary"
                  icon={<Ionicons name="add-circle-outline" size={18} color="white" />}
                  style={styles.emptyButton}
                />
              </View>
            }
          />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getSpacing('md'),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: getColor('grey.light'),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: getColor('primary.red'),
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
  reservationsList: {
    padding: getSpacing('md'),
    paddingBottom: getSpacing('xxl'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing('xl'),
  },
  emptyText: {
    fontSize: 18,
    color: getColor('grey.dark'),
    marginVertical: getSpacing('md'),
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: getSpacing('md'),
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    marginBottom: getSpacing('md'),
    ...getShadow('small'),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: getColor('grey.light'),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: getTextColor('dark'),
  },
  timeText: {
    marginLeft: getSpacing('sm'),
    fontSize: 14,
    color: getColor('secondary.bamboo'),
  },
  statusBadge: {
    paddingVertical: getSpacing('xs'),
    paddingHorizontal: getSpacing('sm'),
    borderRadius: getBorderRadius('sm'),
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: getSpacing('md'),
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing('sm'),
  },
  clientName: {
    marginLeft: getSpacing('xs'),
    fontSize: 16,
    fontWeight: '600',
    color: getTextColor('dark'),
  },
  reservationDetail: {
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
    marginLeft: getSpacing('xs'),
    fontSize: 14,
    color: getColor('grey.dark'),
  },
  specialRequests: {
    padding: getSpacing('md'),
    backgroundColor: getColor('secondary.pearl'),
    borderTopWidth: 1,
    borderTopColor: getColor('grey.light'),
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: getColor('secondary.bamboo'),
    marginBottom: getSpacing('xs'),
  },
  specialRequestsText: {
    fontSize: 14,
    color: getTextColor('dark'),
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: getSpacing('sm'),
    borderTopWidth: 1,
    borderTopColor: getColor('grey.light'),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing('sm'),
    marginLeft: getSpacing('sm'),
  },
  actionText: {
    marginLeft: getSpacing('xs'),
    fontSize: 14,
    color: getColor('secondary.bamboo'),
  },
});

export default ManageReservationsScreen;