import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { asianTheme } from '../styles/asianTheme';
import { ASIAN_EMOJIS, APP_CONFIG } from '../utils/constants';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        {ASIAN_EMOJIS.LANTERN} {APP_CONFIG.NAME}
      </Text>
      
      <ActivityIndicator 
        size="large" 
        color={asianTheme.colors.primary.red} 
        style={styles.loader}
      />
      
      <Text style={styles.text}>
        Preparando tu experiencia asiática...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.xl,
  },
  
  loader: {
    marginBottom: asianTheme.spacing.lg,
  },
  
  text: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
  },
});

export default LoadingScreen;