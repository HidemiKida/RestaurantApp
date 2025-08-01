import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/auth/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import ManageReservationsScreen from '../screens/ManageReservationsScreen';
import ReservationDetailScreen from '../screens/ReservationDetailScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const ReservationStack = createStackNavigator({
  ManageReservations: {
    screen: ManageReservationsScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ReservationDetail: {
    screen: ReservationDetailScreen,
    navigationOptions: {
      title: 'Detalles de Reserva',
    }
  },
  // También deberás agregar las pantallas de edición y creación de reservas
});

export default AppNavigator;