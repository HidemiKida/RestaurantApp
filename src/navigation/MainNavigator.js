import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/auth/AuthContext';
import { asianTheme } from '../styles/asianTheme';
import { USER_ROLES } from '../utils/constants';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import RestaurantsScreen from '../screens/main/RestaurantsScreen';
import ReservationsScreen from '../screens/main/ReservationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

// Stack Navigators
import RestaurantStack from './stacks/RestaurantStack';
import ReservationStack from './stacks/ReservationStack';
import ProfileStack from './stacks/ProfileStack';
import AdminStack from './stacks/AdminStack';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Restaurants':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'Reservations':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Admin':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: asianTheme.colors.primary.red,
        tabBarInactiveTintColor: asianTheme.colors.grey.medium,
        tabBarStyle: {
          backgroundColor: asianTheme.colors.secondary.pearl,
          borderTopColor: asianTheme.colors.grey.light,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      
      <Tab.Screen 
        name="Restaurants" 
        component={RestaurantStack}
        options={{ title: 'Restaurantes' }}
      />
      
      <Tab.Screen 
        name="Reservations" 
        component={ReservationStack}
        options={{ title: 'Reservas' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ title: 'Perfil' }}
      />
      
      {isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminStack}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator;