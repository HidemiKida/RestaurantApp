import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';

const { width } = Dimensions.get('window');

// Detectar tipo de dispositivo
const getDeviceType = () => {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const ResponsiveContainer = ({ children, style, ...props }) => {
  const deviceType = getDeviceType();
  
  const containerStyle = [
    styles.container,
    styles[deviceType],
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  
  // Estilos para móvil
  mobile: {
    paddingHorizontal: asianTheme.spacing.md,
    paddingVertical: asianTheme.spacing.sm,
  },
  
  // Estilos para tablet
  tablet: {
    paddingHorizontal: asianTheme.spacing.xl,
    paddingVertical: asianTheme.spacing.md,
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  // Estilos para desktop
  desktop: {
    paddingHorizontal: asianTheme.spacing.xxl,
    paddingVertical: asianTheme.spacing.lg,
    maxWidth: 800,
    alignSelf: 'center',
  },
});

export default ResponsiveContainer;