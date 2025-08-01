import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/main/ProfileScreen';
import EditProfileScreen from '../../screens/main/EditProfileScreen';
import SettingsScreen from '../../screens/main/SettingsScreen';
import { asianTheme } from '../../styles/asianTheme';

const Stack = createStackNavigator();

const ProfileStack = () => {
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
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil 👤' }}
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
    </Stack.Navigator>
  );
};

export default ProfileStack;