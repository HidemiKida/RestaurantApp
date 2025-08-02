import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { asianTheme } from '../../styles/asianTheme';

// Importar las pantallas de administrador
import AdminDashboardScreen from '../../screens/admin/AdminDashboardScreen';
import TableManagementScreen from '../../screens/admin/TableManagementScreen';
import CreateTableScreen from '../../screens/admin/CreateTableScreen';
import EditTableScreen from '../../screens/admin/EditTableScreen';
import RestaurantSettingsScreen from '../../screens/admin/RestaurantSettingsScreen';
import ReservationCalendarScreen from '../../screens/admin/ReservationCalendarScreen';
import AdminProfileScreen from '../../screens/admin/AdminProfileScreen';
import RestaurantStatsScreen from '../../screens/admin/RestaurantStatsScreen';
import ManageReservationsScreen from '../../screens/ManageReservationsScreen';
import ReservationDetailScreen from '../../screens/main/ReservationDetailScreen';
import EditReservationScreen from '../../screens/main/EditReservationScreen';

const Stack = createStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: asianTheme.colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: asianTheme.colors.grey.light,
        },
        headerTitleStyle: {
          color: asianTheme.colors.primary.red,
          fontWeight: 'bold',
        },
        headerTintColor: asianTheme.colors.primary.red,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="TableManagement" 
        component={TableManagementScreen}
        options={{ title: 'Gestión de Mesas' }}
      />
      <Stack.Screen 
        name="CreateTable" 
        component={CreateTableScreen}
        options={{ title: 'Nueva Mesa' }}
      />
      <Stack.Screen 
        name="EditTable" 
        component={EditTableScreen}
        options={{ title: 'Editar Mesa' }}
      />
      <Stack.Screen 
        name="RestaurantSettings" 
        component={RestaurantSettingsScreen}
        options={{ title: 'Configuración del Restaurante' }}
      />
      <Stack.Screen 
        name="ReservationCalendar" 
        component={ReservationCalendarScreen}
        options={{ title: 'Calendario de Reservas' }}
      />
      <Stack.Screen 
        name="AdminProfile" 
        component={AdminProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      <Stack.Screen 
        name="RestaurantStats" 
        component={RestaurantStatsScreen}
        options={{ title: 'Estadísticas' }}
      />
      <Stack.Screen 
        name="ManageReservations" 
        component={ManageReservationsScreen}
        options={{ title: 'Gestión de Reservas' }}
      />
      <Stack.Screen 
        name="ReservationDetail" 
        component={ReservationDetailScreen}
        options={{ title: 'Detalle de Reserva' }}
      />
      <Stack.Screen 
        name="EditReservation" 
        component={EditReservationScreen}
        options={{ title: 'Editar Reserva' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack;