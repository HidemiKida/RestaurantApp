import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import axios from 'axios';
import { API_URL } from '../config/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from '../components/EmptyState';
import ReservationStatusBadge from '../components/ReservationStatusBadge';

const ManageReservationsScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterStatus, setFilterStatus] = useState(4); // 4 = Todos los estados
  
  // Paginación
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const statusOptions = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada', 'Todas'];
  
  const fetchReservations = async (pageNum = 1, shouldRefresh = false) => {
    if (shouldRefresh) setRefreshing(true);
    if (pageNum === 1) setLoading(true);
    if (pageNum > 1) setLoadingMore(true);
    
    try {
      setError(null);
      
      // Preparamos los parámetros para el filtrado
      const formattedDate = format(filterDate, 'yyyy-MM-dd');
      const statusValue = filterStatus < 4 ? filterStatus : '';
      
      const response = await axios.get(`${API_URL}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${authState.userToken}`,
        },
        params: {
          page: pageNum,
          search: searchQuery,
          date: formattedDate,
          status: statusValue,
        },
      });
      
      const newReservations = response.data.data;
      
      if (pageNum === 1) {
        setReservations(newReservations);
      } else {
        setReservations([...reservations, ...newReservations]);
      }
      
      setHasMorePages(response.data.meta.current_page < response.data.meta.last_page);
      
    } catch (err) {
      console.error('Error al obtener reservas:', err);
      setError('Error al cargar las reservas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [filterDate, filterStatus, searchQuery])
  );

  const onRefresh = () => {
    setPage(1);
    fetchReservations(1, true);
  };

  const loadMoreReservations = () => {
    if (!loadingMore && hasMorePages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReservations(nextPage);
    }
  };

  const handleDeleteReservation = (id) => {
    Alert.alert(
      'Eliminar Reserva',
      '¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/reservations/${id}`, {
                headers: {
                  Authorization: `Bearer ${authState.userToken}`,
                },
              });
              
              // Actualizamos la lista eliminando la reserva
              setReservations(reservations.filter(r => r.id !== id));
              Alert.alert('Éxito', 'La reserva ha sido eliminada.');
              
            } catch (error) {
              console.error('Error al eliminar la reserva:', error);
              Alert.alert('Error', 'No se pudo eliminar la reserva.');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/reservations/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authState.userToken}`,
          },
        }
      );
      
      // Actualizamos el estado localmente
      setReservations(reservations.map(reservation => 
        reservation.id === id 
          ? {...reservation, status: newStatus} 
          : reservation
      ));
      
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la reserva.');
    }
  };

  const renderReservationItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.reservationCard}
        onPress={() => navigation.navigate('ReservationDetail', { reservationId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>{item.client_name}</Text>
          <ReservationStatusBadge status={item.status} />
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {format(new Date(item.reservation_date), 'dd/MM/yyyy')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {format(new Date(`2000-01-01T${item.reservation_time}`), 'HH:mm')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.guests} personas</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditReservation', { reservationId: item.id })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <View style={styles.statusActions}>
            {item.status !== 1 && (
              <TouchableOpacity 
                style={[styles.statusButton, styles.confirmButton]}
                onPress={() => handleStatusChange(item.id, 1)}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
              </TouchableOpacity>
            )}
            
            {item.status !== 2 && (
              <TouchableOpacity 
                style={[styles.statusButton, styles.cancelButton]}
                onPress={() => handleStatusChange(item.id, 2)}
              >
                <Ionicons name="close-circle" size={18} color="#fff" />
              </TouchableOpacity>
            )}
            
            {item.status !== 3 && (
              <TouchableOpacity 
                style={[styles.statusButton, styles.completeButton]}
                onPress={() => handleStatusChange(item.id, 3)}
              >
                <Ionicons name="flag" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteReservation(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.screenTitle}>Gestión de Reservas</Text>
      
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o teléfono"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#333" />
          <Text style={styles.dateText}>
            {format(filterDate, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={filterDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFilterDate(selectedDate);
              }
            }}
          />
        )}
      </View>
      
      <SegmentedControl
        values={statusOptions}
        selectedIndex={filterStatus}
        onChange={(event) => {
          setFilterStatus(event.nativeEvent.selectedSegmentIndex);
        }}
        style={styles.segmentedControl}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateReservation')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Nueva Reserva</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6347"]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No hay reservas"
            message={
              error 
                ? error 
                : "No se encontraron reservas que coincidan con los filtros aplicados."
            }
            actionLabel={error ? "Reintentar" : null}
            onAction={error ? onRefresh : null}
          />
        }
        onEndReached={loadMoreReservations}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#FF6347" />
              <Text style={styles.loadingMoreText}>Cargando más reservas...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
  },
  segmentedControl: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6347',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#4a90e2',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  statusActions: {
    flexDirection: 'row',
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  completeButton: {
    backgroundColor: '#f39c12',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default ManageReservationsScreen;