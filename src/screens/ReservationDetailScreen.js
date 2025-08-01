import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import ReservationStatusBadge from '../components/ReservationStatusBadge';

const ReservationDetailScreen = ({ route, navigation }) => {
  const { reservationId } = route.params;
  const { authState } = useAuth();
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId]);

  const fetchReservationDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${authState.userToken}`,
        },
      });
      setReservation(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener detalles de la reserva:', err);
      setError('No se pudo cargar la información de la reserva.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/reservations/${reservationId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authState.userToken}`,
          },
        }
      );
      
      // Actualizamos el estado localmente
      setReservation({
        ...reservation,
        status: newStatus
      });
      
      Alert.alert('Éxito', 'El estado de la reserva ha sido actualizado.');
      
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la reserva.');
    }
  };

  const handleDeleteReservation = () => {
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
              await axios.delete(`${API_URL}/api/reservations/${reservationId}`, {
                headers: {
                  Authorization: `Bearer ${authState.userToken}`,
                },
              });
              
              Alert.alert('Éxito', 'La reserva ha sido eliminada.');
              navigation.goBack();
              
            } catch (error) {
              console.error('Error al eliminar la reserva:', error);
              Alert.alert('Error', 'No se pudo eliminar la reserva.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Cargando detalles de la reserva...</Text>
      </View>
    );
  }

  if (error || !reservation) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error || 'No se encontró la reserva'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchReservationDetails}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Reserva #{reservationId}</Text>
          <ReservationStatusBadge status={reservation.status} />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{reservation.client_name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{reservation.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{reservation.email || 'No especificado'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles de la Reserva</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(reservation.reservation_date), 'dd/MM/yyyy')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(`2000-01-01T${reservation.reservation_time}`), 'HH:mm')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Personas:</Text>
            <Text style={styles.infoValue}>{reservation.guests}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="restaurant-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Mesa:</Text>
            <Text style={styles.infoValue}>
              {reservation.table_id ? `#${reservation.table_id}` : 'Sin asignar'}
            </Text>
          </View>
        </View>
      </View>
      
      {reservation.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{reservation.notes}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Acciones</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditReservation', { reservationId })}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteReservation}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Cambiar Estado</Text>
        
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.statusButton,
              styles.pendingButton,
              reservation.status === 0 && styles.activeStatusButton
            ]}
            disabled={reservation.status === 0}
            onPress={() => handleStatusChange(0)}
          >
            <Ionicons 
              name={reservation.status === 0 ? "time" : "time-outline"} 
              size={24} 
              color={reservation.status === 0 ? "#fff" : "#FFC107"} 
            />
            <Text 
              style={[
                styles.statusButtonText, 
                reservation.status === 0 && styles.activeStatusText
              ]}
            >
              Pendiente
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              styles.confirmedButton,
              reservation.status === 1 && styles.activeStatusButton
            ]}
            disabled={reservation.status === 1}
            onPress={() => handleStatusChange(1)}
          >
            <Ionicons 
              name={reservation.status === 1 ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={24} 
              color={reservation.status === 1 ? "#fff" : "#4CAF50"} 
            />
            <Text 
              style={[
                styles.statusButtonText, 
                reservation.status === 1 && styles.activeStatusText
              ]}
            >
              Confirmada
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              styles.cancelledButton,
              reservation.status === 2 && styles.activeStatusButton
            ]}
            disabled={reservation.status === 2}
            onPress={() => handleStatusChange(2)}
          >
            <Ionicons 
              name={reservation.status === 2 ? "close-circle" : "close-circle-outline"} 
              size={24} 
              color={reservation.status === 2 ? "#fff" : "#F44336"} 
            />
            <Text 
              style={[
                styles.statusButtonText, 
                reservation.status === 2 && styles.activeStatusText
              ]}
            >
              Cancelada
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusButton,
              styles.completedButton,
              reservation.status === 3 && styles.activeStatusButton
            ]}
            disabled={reservation.status === 3}
            onPress={() => handleStatusChange(3)}
          >
            <Ionicons 
              name={reservation.status === 3 ? "checkmark-done-circle" : "checkmark-done-circle-outline"} 
              size={24} 
              color={reservation.status === 3 ? "#fff" : "#9E9E9E"} 
            />
            <Text 
              style={[
                styles.statusButtonText, 
                reservation.status === 3 && styles.activeStatusText
              ]}
            >
              Completada
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  notesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  notesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionsSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#4a90e2',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    width: '48%',
    marginBottom: 12,
  },
  pendingButton: {
    borderColor: '#FFC107',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  confirmedButton: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  cancelledButton: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  completedButton: {
    borderColor: '#9E9E9E',
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  activeStatusButton: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  activeStatusText: {
    color: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationDetailScreen;