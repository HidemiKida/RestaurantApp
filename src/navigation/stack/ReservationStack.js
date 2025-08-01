import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReservationsScreen from '../../screens/main/ReservationsScreen';
import ReservationDetailScreen from '../../screens/main/ReservationDetailScreen';
import { asianTheme } from '../../styles/asianTheme';

const Stack = createStackNavigator();

const ReservationStack = () => {
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
        name="ReservationsList" 
        component={ReservationsScreen}
        options={{ title: 'Mis Reservas 📅' }}
      />
      
      <Stack.Screen 
        name="ReservationDetail" 
        component={ReservationDetailScreen}
        options={{ title: 'Detalle de Reserva' }}
      />
    </Stack.Navigator>
  );
};

export default ReservationStack;