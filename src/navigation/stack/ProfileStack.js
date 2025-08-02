import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { asianTheme } from '../../styles/asianTheme';

// Importar pantallas
import ProfileScreen from '../../screens/main/ProfileScreen';
import EditProfileScreen from '../../screens/main/EditProfileScreen'; // Asegúrate de tener este archivo
import SettingsScreen from '../../screens/main/SettingsScreen'; // Ahora tenemos este archivo creado
import TermsScreen from '../../screens/main/TermsScreen'; // Debes crear este archivo o eliminar la referencia
import PrivacyScreen from '../../screens/main/PrivacyScreen'; // Debes crear este archivo o eliminar la referencia

const Stack = createStackNavigator();

const ProfileStack = () => {
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
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
      <Stack.Screen 
        name="Terms" 
        component={TermsScreen}
        options={{ title: 'Términos de Servicio' }}
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{ title: 'Política de Privacidad' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;