import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { asianTheme } from '../../styles/asianTheme';

// Importar las pantallas necesarias
import ReservationsScreen from '../../screens/main/ReservationsScreen';
import ReservationDetailScreen from '../../screens/main/ReservationDetailScreen';
import EditReservationScreen from '../../screens/main/EditReservationScreen';
import ManageReservationsScreen from '../../screens/ManageReservationsScreen';

const Stack = createStackNavigator();

const ReservationStack = () => {
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
        name="Reservations" 
        component={ReservationsScreen}
        options={{ title: 'Mis Reservas' }}
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
      <Stack.Screen 
        name="ManageReservations" 
        component={ManageReservationsScreen}
        options={{ title: 'Gestión de Reservas' }}
      />
    </Stack.Navigator>
  );
};

export default ReservationStack;