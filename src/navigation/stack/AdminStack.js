import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../../screens/admin/AdminDashboardScreen';
import ManageTablesScreen from '../../screens/admin/ManageTablesScreen';
import ManageReservationsScreen from '../../screens/admin/ManageReservationsScreen';
import RestaurantSettingsScreen from '../../screens/admin/RestaurantSettingsScreen';
import { asianTheme } from '../../styles/asianTheme';

const Stack = createStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: asianTheme.colors.primary.red,
        },
        headerTintColor: asianTheme.colors.secondary.pearl,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Panel Admin 🛠️' }}
      />
      
      <Stack.Screen 
        name="ManageTables" 
        component={ManageTablesScreen}
        options={{ title: 'Gestionar Mesas' }}
      />
      
      <Stack.Screen 
        name="ManageReservations" 
        component={ManageReservationsScreen}
        options={{ title: 'Gestionar Reservas' }}
      />
      
      <Stack.Screen 
        name="RestaurantSettings" 
        component={RestaurantSettingsScreen}
        options={{ title: 'Configuración Restaurante' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack;