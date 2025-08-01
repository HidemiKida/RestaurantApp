import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RestaurantsScreen from '../../screens/main/RestaurantsScreen';
import RestaurantDetailScreen from '../../screens/main/RestaurantDetailScreen';
import BookingScreen from '../../screens/main/BookingScreen';
import { asianTheme } from '../../styles/asianTheme';

const Stack = createStackNavigator();

const RestaurantStack = () => {
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
        name="RestaurantsList" 
        component={RestaurantsScreen}
        options={{ title: 'Restaurantes 🏮' }}
      />
      
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetailScreen}
        options={{ title: 'Detalles del Restaurante' }}
      />
      
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Hacer Reserva' }}
      />
    </Stack.Navigator>
  );
};

export default RestaurantStack;