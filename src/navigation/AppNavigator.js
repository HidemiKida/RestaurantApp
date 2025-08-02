import React from 'react';
import { useAuth } from '../context/auth/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  
  // Si está cargando, podríamos mostrar un splash screen o indicador de carga
  if (isLoading) {
    return null; // O un componente de carga
  }
  
  // Si el usuario está autenticado, mostrar la navegación principal, si no, mostrar la navegación de autenticación
  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;