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

const TableManagementScreen = ({ navigation }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Recargar mesas cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadTables();
    }, [])
  );

  const loadTables = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await adminService.getTables();

      if (response.success && response.data) {
        setTables(response.data);
        console.log('✅ Mesas cargadas:', response.data.length);
      } else {
        throw new Error(response.message || 'Error al cargar las mesas');
      }
    } catch (error) {
      console.error('❌ Error loading tables:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => loadTables() },
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
    loadTables(false);
  };

  const handleCreateTable = () => {
    navigation.navigate('CreateTable');
  };

  const handleEditTable = (table) => {
    navigation.navigate('EditTable', { table });
  };

  const handleDeleteTable = (tableId) => {
    Alert.alert(
      'Eliminar Mesa',
      '¿Estás seguro de que quieres eliminar esta mesa? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const response = await adminService.deleteTable(tableId);
              
              if (response.success) {
                // Actualizar la lista eliminando la mesa
                setTables(tables.filter(table => table.id !== tableId));
                Alert.alert('Éxito', 'Mesa eliminada correctamente');
              } else {
                throw new Error(response.message || 'Error al eliminar la mesa');
              }
            } catch (error) {
              Alert.alert('Error', formatError(error));
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const renderTableItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tableCard}
      onPress={() => handleEditTable(item)}
      activeOpacity={0.7}
    >
      <View style={styles.tableHeader}>
        <View style={[styles.tableStatus, { backgroundColor: item.active ? getColor('success') : getColor('error') }]}>
          <Text style={styles.tableStatusText}>
            {item.active ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
        
        <Text style={styles.tableNumber}>Mesa #{item.number}</Text>
      </View>
      
      <View style={styles.tableDetails}>
        <View style={styles.tableDetail}>
          <Ionicons name="people" size={18} color={getColor('secondary.bamboo')} />
          <Text style={styles.tableDetailText}>
            Capacidad: {item.capacity} {item.capacity === 1 ? 'persona' : 'personas'}
          </Text>
        </View>
        
        <View style={styles.tableDetail}>
          <Ionicons name="location" size={18} color={getColor('secondary.bamboo')} />
          <Text style={styles.tableDetailText}>
            {item.location || 'Ubicación no especificada'}
          </Text>
        </View>
      </View>
      
      <View style={styles.tableActions}>
        <TouchableOpacity
          style={[styles.tableAction, styles.editAction]}
          onPress={() => handleEditTable(item)}
        >
          <Ionicons name="pencil" size={16} color={getColor('secondary.bamboo')} />
          <Text style={styles.tableActionText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tableAction, styles.deleteAction]}
          onPress={() => handleDeleteTable(item.id)}
        >
          <Ionicons name="trash-bin" size={16} color={getColor('error')} />
          <Text style={[styles.tableActionText, { color: getColor('error') }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        {/* Header con título y botón de agregar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {ASIAN_EMOJIS.TABLE} Gestión de Mesas
          </Text>
          
          <AsianButton
            title="Nueva Mesa"
            onPress={handleCreateTable}
            variant="primary"
            size="small"
            icon={<Ionicons name="add-circle-outline" size={18} color="white" />}
          />
        </View>
        
        {/* Lista de mesas */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={getColor('primary.red')} />
            <Text style={styles.loadingText}>Cargando mesas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={getColor('error')} />
            <Text style={styles.errorText}>{error}</Text>
            <AsianButton
              title="Reintentar"
              onPress={loadTables}
              variant="secondary"
              size="small"
              icon={<Ionicons name="refresh" size={18} color={getColor('primary.black')} />}
            />
          </View>
        ) : (
          <FlatList
            data={tables}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTableItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tablesList}
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
                <Ionicons name="restaurant" size={64} color={getColor('grey.light')} />
                <Text style={styles.emptyText}>
                  No hay mesas configuradas
                </Text>
                <Text style={styles.emptySubText}>
                  Agrega una nueva mesa para comenzar
                </Text>
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
    padding: getSpacing('md'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('lg'),
  },
  headerTitle: {
    fontSize: 24,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing('lg'),
  },
  errorText: {
    marginVertical: getSpacing('md'),
    color: getColor('error'),
    fontSize: 16,
    textAlign: 'center',
  },
  tablesList: {
    paddingBottom: getSpacing('xl'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing('xl'),
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor('grey.dark'),
    marginTop: getSpacing('md'),
  },
  emptySubText: {
    fontSize: 14,
    color: getColor('grey.medium'),
    marginTop: getSpacing('sm'),
    textAlign: 'center',
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('md'),
    marginBottom: getSpacing('md'),
    ...getShadow('medium'),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('sm'),
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColor('primary.red'),
  },
  tableStatus: {
    paddingVertical: getSpacing('xs'),
    paddingHorizontal: getSpacing('sm'),
    borderRadius: getBorderRadius('sm'),
  },
  tableStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableDetails: {
    marginVertical: getSpacing('sm'),
  },
  tableDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing('xs'),
  },
  tableDetailText: {
    fontSize: 14,
    color: getColor('grey.dark'),
    marginLeft: getSpacing('xs'),
  },
  tableActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: getSpacing('sm'),
    borderTopWidth: 1,
    borderTopColor: getColor('grey.light'),
    paddingTop: getSpacing('sm'),
  },
  tableAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing('sm'),
    borderRadius: getBorderRadius('sm'),
    marginLeft: getSpacing('sm'),
  },
  tableActionText: {
    fontSize: 14,
    marginLeft: getSpacing('xs'),
    color: getColor('secondary.bamboo'),
  },
  editAction: {
    backgroundColor: getColor('secondary.pearl'),
  },
  deleteAction: {
    backgroundColor: '#FEE8E8',
  },
});

export default TableManagementScreen;