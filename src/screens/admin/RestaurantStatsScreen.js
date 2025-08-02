import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import adminService from '../../services/api/adminService';
import { formatError } from '../../utils/helpers';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

const RestaurantStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Cargar estadísticas cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [selectedPeriod])
  );

  const loadStats = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await adminService.getRestaurantStats(selectedPeriod);

      if (response.success && response.data) {
        setStats(response.data);
        console.log('✅ Estadísticas cargadas:', response.data);
      } else {
        throw new Error(response.message || 'Error al cargar estadísticas');
      }
    } catch (error) {
      console.error('❌ Error loading stats:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadStats() },
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
    loadStats(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Preparar datos para los gráficos
  const prepareChartData = () => {
    if (!stats) return null;

    // Datos para el gráfico de ocupación
    const occupancyData = {
      labels: stats.occupancy_data?.labels || ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: stats.occupancy_data?.data || [0, 0, 0, 0, 0, 0, 0],
          color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Ocupación %'],
    };

    // Datos para el gráfico de reservaciones por estado
    const reservationStatusData = {
      labels: ['Pendientes', 'Confirmadas', 'Canceladas', 'Completadas'],
      data: [
        stats.pending_reservations / stats.total_reservations || 0,
        stats.confirmed_reservations / stats.total_reservations || 0,
        stats.cancelled_reservations / stats.total_reservations || 0,
        stats.completed_reservations / stats.total_reservations || 0,
      ],
    };

    // Datos para el gráfico de ingreso por día
    const revenueData = {
      labels: stats.revenue_data?.labels || ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: stats.revenue_data?.data || [0, 0, 0, 0, 0, 0, 0],
          color: (opacity = 1) => `rgba(46, 134, 193, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Ingresos'],
    };

    // Datos para el gráfico de número de comensales
    const guestCountData = {
      labels: stats.guest_count_data?.labels || ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          data: stats.guest_count_data?.data || [0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };

    return {
      occupancyData,
      reservationStatusData,
      revenueData,
      guestCountData,
    };
  };

  const chartData = prepareChartData();

  // Elementos de resumen con indicadores
  const renderSummaryItems = () => {
    if (!stats) return null;

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="calendar" size={32} color={asianTheme.colors.primary.red} />
          <Text style={styles.summaryValue}>{stats.total_reservations || 0}</Text>
          <Text style={styles.summaryLabel}>Reservas</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="people" size={32} color={asianTheme.colors.primary.red} />
          <Text style={styles.summaryValue}>{stats.total_guests || 0}</Text>
          <Text style={styles.summaryLabel}>Comensales</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="cash" size={32} color={asianTheme.colors.primary.red} />
          <Text style={styles.summaryValue}>{formatCurrency(stats.total_revenue || 0)}</Text>
          <Text style={styles.summaryLabel}>Ingresos</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="stats-chart" size={32} color={asianTheme.colors.primary.red} />
          <Text style={styles.summaryValue}>{formatPercent(stats.occupancy_rate || 0)}</Text>
          <Text style={styles.summaryLabel}>Ocupación</Text>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[asianTheme.colors.primary.red]}
              tintColor={asianTheme.colors.primary.red}
            />
          }
        >
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
              {ASIAN_EMOJIS.LANTERN} Estadísticas del Restaurante
            </Text>
            <Text style={styles.headerSubtitle}>
              Análisis de rendimiento y reservaciones
            </Text>
          </View>

          {/* Selector de período */}
          <View style={styles.periodSelector}>
            <AsianButton
              title="Semana"
              onPress={() => handlePeriodChange('week')}
              type={selectedPeriod === 'week' ? 'primary' : 'outline'}
              size="small"
            />
            <AsianButton
              title="Mes"
              onPress={() => handlePeriodChange('month')}
              type={selectedPeriod === 'month' ? 'primary' : 'outline'}
              size="small"
            />
            <AsianButton
              title="Año"
              onPress={() => handlePeriodChange('year')}
              type={selectedPeriod === 'year' ? 'primary' : 'outline'}
              size="small"
            />
          </View>

          {/* Tarjetas de resumen */}
          {renderSummaryItems()}

          {/* Sección de gráficos */}
          {chartData && (
            <View style={styles.chartsContainer}>
              {/* Gráfico de ocupación */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Tasa de Ocupación</Text>
                <LineChart
                  data={chartData.occupancyData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
                  }}
                  style={styles.chart}
                  bezier
                />
              </View>

              {/* Gráfico de estado de reservaciones */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Estado de Reservaciones</Text>
                <ProgressChart
                  data={chartData.reservationStatusData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(46, 134, 193, ${opacity})`,
                  }}
                  style={styles.chart}
                />
                
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(46, 134, 193, 0.8)' }]} />
                    <Text style={styles.legendText}>Pendientes: {stats.pending_reservations || 0}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(46, 204, 113, 0.8)' }]} />
                    <Text style={styles.legendText}>Confirmadas: {stats.confirmed_reservations || 0}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(231, 76, 60, 0.8)' }]} />
                    <Text style={styles.legendText}>Canceladas: {stats.cancelled_reservations || 0}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(155, 89, 182, 0.8)' }]} />
                    <Text style={styles.legendText}>Completadas: {stats.completed_reservations || 0}</Text>
                  </View>
                </View>
              </View>

              {/* Gráfico de ingresos */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Ingresos {selectedPeriod === 'week' ? 'Semanales' : selectedPeriod === 'month' ? 'Mensuales' : 'Anuales'}</Text>
                <BarChart
                  data={chartData.revenueData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(46, 134, 193, ${opacity})`,
                  }}
                  style={styles.chart}
                  verticalLabelRotation={30}
                />
              </View>

              {/* Gráfico de comensales */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Número de Comensales</Text>
                <BarChart
                  data={chartData.guestCountData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                  }}
                  style={styles.chart}
                  verticalLabelRotation={30}
                />
              </View>
            </View>
          )}

          {/* Más estadísticas en formato texto */}
          {stats && (
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Detalles Adicionales</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tiempo promedio entre reserva y visita:</Text>
                <Text style={styles.detailValue}>{stats.avg_time_before_visit || '0'} horas</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tamaño promedio de grupo:</Text>
                <Text style={styles.detailValue}>{stats.avg_party_size?.toFixed(1) || '0'} personas</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tasa de cancelación:</Text>
                <Text style={styles.detailValue}>{formatPercent(stats.cancellation_rate || 0)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ingreso promedio por reserva:</Text>
                <Text style={styles.detailValue}>{formatCurrency(stats.avg_revenue_per_reservation || 0)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mesa más solicitada:</Text>
                <Text style={styles.detailValue}>Mesa #{stats.most_requested_table || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Día más ocupado:</Text>
                <Text style={styles.detailValue}>{stats.busiest_day || 'N/A'}</Text>
              </View>
            </View>
          )}
        </ScrollView>
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
  scrollContent: {
    padding: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.xxl,
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
  headerSection: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.xs,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.lg,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: asianTheme.spacing.lg,
  },
  summaryCard: {
    width: isTablet ? '24%' : '48%',
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    padding: asianTheme.spacing.md,
    alignItems: 'center',
    marginBottom: asianTheme.spacing.md,
    ...asianTheme.shadow.sm,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.text.dark,
    marginVertical: asianTheme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: asianTheme.colors.grey.dark,
  },
  chartsContainer: {
    marginBottom: asianTheme.spacing.lg,
  },
  chartCard: {
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    padding: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.lg,
    ...asianTheme.shadow.md,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.md,
    textAlign: 'center',
  },
  chart: {
    borderRadius: asianTheme.borderRadius.sm,
    marginVertical: asianTheme.spacing.sm,
  },
  chartLegend: {
    marginTop: asianTheme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: asianTheme.spacing.xs,
    minWidth: '40%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: asianTheme.spacing.xs,
  },
  legendText: {
    fontSize: 12,
    color: asianTheme.colors.grey.dark,
  },
  detailsCard: {
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    padding: asianTheme.spacing.lg,
    ...asianTheme.shadow.md,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: asianTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    fontWeight: '600',
    flex: isTablet ? 2 : 1,
  },
  detailValue: {
    fontSize: 14,
    color: asianTheme.colors.text.dark,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: isTablet ? 1 : 1,
  },
});

export default RestaurantStatsScreen;