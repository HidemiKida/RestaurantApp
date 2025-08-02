import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../styles/asianTheme';

// Pantallas
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ReservationCalendarScreen from '../screens/admin/ReservationCalendarScreen';
import TableManagementScreen from '../screens/admin/TableManagementScreen';
import CreateTableScreen from '../screens/admin/CreateTableScreen';
import EditTableScreen from '../screens/admin/EditTableScreen';
import RestaurantSettingsScreen from '../screens/admin/RestaurantSettingsScreen';
import EditReservationScreen from '../screens/main/EditReservationScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import RestaurantStatsScreen from '../screens/admin/RestaurantStatsScreen';
import ReservationDetailScreen from '../screens/main/ReservationDetailScreen';

// Creamos los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Opciones compartidas para el Stack Navigator
const stackScreenOptions = {
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
    fontSize: 20,
  },
  headerTintColor: asianTheme.colors.primary.red,
  headerBackTitleVisible: false,
};

// Navegador de Dashboard
const DashboardStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ title: 'Dashboard' }}
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

// Navegador de Calendario
const CalendarStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="ReservationCalendar"
      component={ReservationCalendarScreen}
      options={{ title: 'Calendario' }}
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

// Navegador de Mesas
const TablesStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
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
  </Stack.Navigator>
);

// Navegador de Estadísticas
const StatsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="RestaurantStats"
      component={RestaurantStatsScreen}
      options={{ title: 'Estadísticas' }}
    />
  </Stack.Navigator>
);

// Navegador de Perfil y Configuración
const SettingsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="AdminProfile"
      component={AdminProfileScreen}
      options={{ title: 'Mi Perfil' }}
    />
    <Stack.Screen
      name="RestaurantSettings"
      component={RestaurantSettingsScreen}
      options={{ title: 'Configuración del Restaurante' }}
    />
  </Stack.Navigator>
);

// Navegador principal de pestañas
const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Calendar') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Tables') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'Stats') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: asianTheme.colors.primary.red,
      tabBarInactiveTintColor: asianTheme.colors.grey.medium,
      tabBarStyle: {
        backgroundColor: asianTheme.colors.white,
        borderTopColor: asianTheme.colors.grey.light,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 3,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen
      name="Calendar"
      component={CalendarStack}
      options={{ title: 'Calendario' }}
    />
    <Tab.Screen
      name="Tables"
      component={TablesStack}
      options={{ title: 'Mesas' }}
    />
    <Tab.Screen
      name="Stats"
      component={StatsStack}
      options={{ title: 'Estadísticas' }}
    />
    <Tab.Screen
      name="Profile"
      component={SettingsStack}
      options={{ title: 'Perfil' }}
    />
  </Tab.Navigator>
);

export default AdminNavigator;