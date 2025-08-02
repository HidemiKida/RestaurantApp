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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import adminService from '../../services/api/adminService';
import { formatError } from '../../utils/helpers';

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
          <Ionicons name="person" size={16} color={asianTheme.colors.secondary.bamboo} />
          <Text style={styles.clientName}>
            {item.user?.name || 'Cliente'}
          </Text>
        </View>
        
        <View style={styles.reservationDetail}>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={16} color={asianTheme.colors.secondary.bamboo} />
            <Text style={styles.detailText}>
              {item.party_size} {item.party_size === 1 ? 'persona' : 'personas'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="restaurant" size={16} color={asianTheme.colors.secondary.bamboo} />
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
          <Ionicons name="create-outline" size={18} color={asianTheme.colors.secondary.bamboo} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            /* Implementar confirmación de reserva */
            Alert.alert('Implementar', 'Función para confirmar reserva');
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={asianTheme.colors.success} />
          <Text style={[styles.actionText, { color: asianTheme.colors.success }]}>Confirmar</Text>
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
            icon="add-circle-outline"
            onPress={handleCreateReservation}
            type="primary"
            size="small"
          />
        </View>
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
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
                colors={[asianTheme.colors.primary.red]}
                tintColor={asianTheme.colors.primary.red}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar" size={64} color={asianTheme.colors.grey.light} />
                <Text style={styles.emptyText}>
                  No hay reservas para mostrar
                </Text>
                <AsianButton
                  title="Crear Reserva"
                  onPress={handleCreateReservation}
                  type="primary"
                  icon="add-circle-outline"
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
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: asianTheme.spacing.md,
    backgroundColor: asianTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: asianTheme.spacing.md,
    color: asianTheme.colors.grey.dark,
    fontSize: 16,
  },
  reservationsList: {
    padding: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    color: asianTheme.colors.grey.dark,
    marginVertical: asianTheme.spacing.md,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: asianTheme.spacing.md,
  },
  reservationCard: {
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    marginBottom: asianTheme.spacing.md,
    ...asianTheme.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: asianTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.text.dark,
  },
  timeText: {
    marginLeft: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },
  statusBadge: {
    paddingVertical: asianTheme.spacing.xs,
    paddingHorizontal: asianTheme.spacing.sm,
    borderRadius: asianTheme.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: asianTheme.spacing.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.sm,
  },
  clientName: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 16,
    fontWeight: '600',
    color: asianTheme.colors.text.dark,
  },
  reservationDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.xs,
  },
  detailText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.grey.dark,
  },
  specialRequests: {
    padding: asianTheme.spacing.md,
    backgroundColor: asianTheme.colors.secondary.pearl,
    borderTopWidth: 1,
    borderTopColor: asianTheme.colors.grey.light,
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },
  specialRequestsText: {
    fontSize: 14,
    color: asianTheme.colors.text.dark,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: asianTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: asianTheme.colors.grey.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: asianTheme.spacing.sm,
    marginLeft: asianTheme.spacing.sm,
  },
  actionText: {
    marginLeft: asianTheme.spacing.xs,
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },
});

export default ManageReservationsScreen;