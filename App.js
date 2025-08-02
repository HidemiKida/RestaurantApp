import React, { useEffect } from 'react';
import { Platform, StyleSheet, LogBox, UIManager, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/auth/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
]);

// Habilitar animaciones de diseño en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  // Mover el useEffect dentro del cuerpo del componente App
  useEffect(() => {
    // Solamente ejecutar el código relacionado con web dentro de la condición
    if (Platform.OS === 'web') {
      // Agregar fuentes de Google para el estilo oriental
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@300;400;500;700&display=swap';
      document.head.appendChild(link);
      
      // Agregar estilos globales para mejorar el scroll y la experiencia general
      const style = document.createElement('style');
      style.textContent = `
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background-color: #F9F6F0;
        }
        
        #root {
          height: 100%;
          overflow: auto;
        }
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Estilos de scroll personalizados */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F9F6F0;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: #C41E3A;
          border-radius: 4px;
          border: 2px solid #F9F6F0;
        }
      `;
      document.head.appendChild(style);
      
      // Función de limpieza
      return () => {
        // Limpiar si el componente se desmonta
        document.head.removeChild(link);
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer
          fallback={
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          }
        >
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F6F0',
  },
  loadingText: {
    fontSize: 18,
    color: '#C41E3A',
  },
});