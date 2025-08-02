import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';

// Obtener dimensiones de la ventana
const { width } = Dimensions.get('window');

const ResponsiveContainer = ({ children, style, ...props }) => {
  // Determinar tipo de dispositivo
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  let containerStyle = [styles.container];
  
  if (isTablet) {
    containerStyle.push(styles.tabletContainer);
  } else if (isDesktop) {
    containerStyle.push(styles.desktopContainer);
  }
  
  if (style) {
    containerStyle.push(style);
  }
  
  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabletContainer: {
    maxWidth: 768,
    alignSelf: 'center',
    ...(Platform.OS === 'web' ? {
      shadowColor: asianTheme.colors.primary.red,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      boxShadow: '0 0 20px rgba(196, 30, 58, 0.1)',
      backgroundColor: 'white',
      height: '100%',
    } : {}),
  },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    ...(Platform.OS === 'web' ? {
      shadowColor: asianTheme.colors.primary.red,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      boxShadow: '0 0 20px rgba(196, 30, 58, 0.1)',
      backgroundColor: 'white',
      height: '100%',
    } : {}),
  },
});

export default ResponsiveContainer;