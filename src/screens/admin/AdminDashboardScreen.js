import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { useAuth } from '../../context/auth/AuthContext';
import { formatError, getGreeting } from '../../utils/helpers';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [todayReservations, setTodayReservations] = useState([]);
  const [error, setError] = useState(null);

  // Recargar datos cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      // Cargar estadísticas, info del restaurante y reservas de hoy en paralelo
      const [statsResponse, restaurantResponse, reservationsResponse] = await Promise.all([
        adminService.getRestaurantStats(),
        adminService.getRestaurantInfo(),
        adminService.getReservations({ 
          date: new Date().toISOString().split('T')[0], // Fecha de hoy
          per_page: 10 
        })
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (restaurantResponse.success) {
        setRestaurant(restaurantResponse.data);
      }

      if (reservationsResponse.success) {
        setTodayReservations(reservationsResponse.data?.data || []);
      }

    } catch (error) {
      console.error('❌ Error cargando dashboard:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadDashboardData() },
          { text: 'Cerrar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
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

  const quickActions = [
    {
      id: 'reservations',
      title: 'Gestionar Reservas',
      subtitle: 'Ver y administrar reservas',
      icon: 'calendar',
      color: asianTheme.colors.primary.red,
      onPress: () => navigation.navigate('ManageReservations'),
    },
    {
      id: 'tables',
      title: 'Gestionar Mesas',
      subtitle: 'Configurar mesas y disponibilidad',
      icon: 'restaurant',
      color: asianTheme.colors.accent.gold,
      onPress: () => navigation.navigate('ManageTables'),
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Ajustes del restaurante',
      icon: 'settings',
      color: asianTheme.colors.secondary.bamboo,
      onPress: () => navigation.navigate('RestaurantSettings'),
    },
  ];

  const renderStatCard = (title, value, icon, color, subtitle) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
        <Ionicons name={action.icon} size={28} color={action.color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={asianTheme.colors.grey.medium} />
    </TouchableOpacity>
  );

  const renderReservationItem = (reservation) => (
    <TouchableOpacity
      key={reservation.id}
      style={styles.reservationItem}
      onPress={() => navigation.navigate('ManageReservations', { 
        reservationId: reservation.id 
      })}
    >
      <View style={styles.reservationLeft}>
        <View style={[
          styles.reservationStatus,
          { backgroundColor: getStatusColor(reservation.status) }
        ]} />
        <View style={styles.reservationInfo}>
          <Text style={styles.reservationTime}>
            {new Date(reservation.reservation_date).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          <Text style={styles.reservationDetails}>
            Mesa {reservation.table?.table_number} • {reservation.party_size} personas
          </Text>
          <Text style={styles.reservationClient}>{reservation.client?.name}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={asianTheme.colors.grey.medium} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando panel de administración...</Text>
      </View>
    );
  }

  return (
    <ResponsiveContainer>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[asianTheme.colors.primary.red]}
            tintColor={asianTheme.colors.primary.red}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header de bienvenida */}
        <View style={styles.welcomeCard}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.welcomeText}>
            {ASIAN_EMOJIS.LANTERN} Bienvenido, {user?.name}
          </Text>
          <Text style={styles.restaurantName}>
            Panel de {restaurant?.name || 'Administración'}
          </Text>
        </View>

        {/* Estadísticas principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.DRAGON} Resumen de hoy
          </Text>
          
          <View style={styles.statsContainer}>
            {renderStatCard(
              'Reservas Hoy',
              stats?.reservations_today || 0,
              'calendar',
              asianTheme.colors.primary.red,
              'Total del día'
            )}
            
            {renderStatCard(
              'Mesas Ocupadas',
              `${stats?.occupied_tables || 0}/${stats?.total_tables || 0}`,
              'restaurant',
              asianTheme.colors.warning,
              'En este momento'
            )}
            
            {renderStatCard(
              'Ingresos Hoy',
              formatCurrency(stats?.revenue_today),
              'card',
              asianTheme.colors.success,
              'Estimado'
            )}
            
            {renderStatCard(
              'Ocupación',
              `${stats?.occupancy_rate || 0}%`,
              'pie-chart',
              asianTheme.colors.accent.gold,
              'Promedio del día'
            )}
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.BAMBOO} Acciones rápidas
          </Text>
          
          <View style={styles.actionsContainer}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Reservas de hoy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {ASIAN_EMOJIS.CALENDAR} Reservas de hoy
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ManageReservations')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {todayReservations.length > 0 ? (
            <View style={styles.reservationsContainer}>
              {todayReservations.slice(0, 5).map(renderReservationItem)}
            </View>
          ) : (
            <View style={styles.emptyReservations}>
              <Text style={styles.emptyEmoji}>{ASIAN_EMOJIS.CHERRY}</Text>
              <Text style={styles.emptyText}>No hay reservas para hoy</Text>
              <Text style={styles.emptySubtext}>¡Qué tranquilo está el día!</Text>
            </View>
          )}
        </View>

        {/* Información del sistema */}
        <View style={styles.section}>
          <View style={styles.systemInfo}>
            <View style={styles.systemInfoItem}>
              <Ionicons name="time-outline" size={16} color={asianTheme.colors.secondary.bamboo} />
              <Text style={styles.systemInfoText}>
                Última actualización: {new Date().toLocaleTimeString('es-ES')}
              </Text>
            </View>
            
            <View style={styles.systemInfoItem}>
              <Ionicons name="wifi-outline" size={16} color={asianTheme.colors.success} />
              <Text style={styles.systemInfoText}>Sistema conectado</Text>
            </View>
          </View>
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

  welcomeCard: {
    backgroundColor: 'white',
    margin: asianTheme.spacing.md,
    padding: asianTheme.spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  greeting: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  restaurantName: {
    fontSize: 16,
    color: asianTheme.colors.primary.red,
    fontWeight: '600',
  },

  section: {
    marginBottom: asianTheme.spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.md,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginHorizontal: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.md,
  },

  seeAllText: {
    fontSize: 14,
    color: asianTheme.colors.primary.red,
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: asianTheme.spacing.md,
    gap: asianTheme.spacing.md,
  },

  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: asianTheme.spacing.md,
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: asianTheme.spacing.md,
  },

  statContent: {
    flex: 1,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
  },

  statTitle: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    fontWeight: '600',
  },

  statSubtitle: {
    fontSize: 12,
    color: asianTheme.colors.grey.medium,
    marginTop: asianTheme.spacing.xs,
  },

  actionsContainer: {
    marginHorizontal: asianTheme.spacing.md,
    gap: asianTheme.spacing.sm,
  },

  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: asianTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: asianTheme.spacing.md,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  actionSubtitle: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  reservationsContainer: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: asianTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },

  reservationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  reservationStatus: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: asianTheme.spacing.md,
  },

  reservationInfo: {
    flex: 1,
  },

  reservationTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
  },

  reservationDetails: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.xs,
  },

  reservationClient: {
    fontSize: 12,
    color: asianTheme.colors.grey.medium,
    marginTop: asianTheme.spacing.xs,
  },

  emptyReservations: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.xl,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: asianTheme.spacing.md,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  emptySubtext: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
  },

  systemInfo: {
    backgroundColor: 'white',
    marginHorizontal: asianTheme.spacing.md,
    borderRadius: 12,
    padding: asianTheme.spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  systemInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xs,
  },

  systemInfoText: {
    fontSize: 12,
    color: asianTheme.colors.secondary.bamboo,
    marginLeft: asianTheme.spacing.sm,
  },
});

export default AdminDashboardScreen;