import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Animated,
  Easing,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { asianTheme } from '../styles/asianTheme';
import { ASIAN_EMOJIS, APP_CONFIG } from '../utils/constants';

const LoadingScreen = ({ message, showLogo = true }) => {
  // Estados para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [loadingText, setLoadingText] = useState('Preparando tu experiencia asiática');
  const [dotsCount, setDotsCount] = useState(0);
  
  // Efecto para la animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      })
    ]).start();
    
    // Animación de puntos suspensivos
    const dotsInterval = setInterval(() => {
      setDotsCount((prevCount) => (prevCount + 1) % 4);
    }, 500);
    
    return () => clearInterval(dotsInterval);
  }, []);
  
  // Generar puntos suspensivos animados
  useEffect(() => {
    const dots = '.'.repeat(dotsCount);
    setLoadingText(`${message || 'Preparando tu experiencia asiática'}${dots}`);
  }, [dotsCount, message]);
  
  // Seleccionar emoji aleatorio para la carga
  const loadingEmojis = [
    ASIAN_EMOJIS.LANTERN,
    ASIAN_EMOJIS.CHERRY,
    ASIAN_EMOJIS.BAMBOO,
    ASIAN_EMOJIS.DRAGON
  ];
  
  const randomEmoji = loadingEmojis[Math.floor(Math.random() * loadingEmojis.length)];
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {showLogo && (
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={styles.logo}>
            {ASIAN_EMOJIS.LANTERN} {APP_CONFIG.NAME}
          </Text>
        </Animated.View>
      )}
      
      <Animated.View 
        style={[
          styles.loaderContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {Platform.OS === 'ios' ? (
          <ActivityIndicator
            size="large"
            color={asianTheme.colors.primary.red}
            style={styles.loader}
          />
        ) : (
          <View style={styles.customLoader}>
            <Text style={styles.loadingEmoji}>
              {randomEmoji}
            </Text>
          </View>
        )}
        
        <Text style={styles.text} accessible={true} accessibilityLabel="Cargando">
          {loadingText}
        </Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>
          {APP_CONFIG.VERSION}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.secondary.pearl,
    paddingHorizontal: asianTheme.spacing.xl,
  },
  
  logoContainer: {
    marginBottom: asianTheme.spacing.xxl,
  },
  
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
  },
  
  loaderContainer: {
    alignItems: 'center',
  },
  
  loader: {
    marginBottom: asianTheme.spacing.lg,
  },
  
  customLoader: {
    marginBottom: asianTheme.spacing.lg,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingEmoji: {
    fontSize: 36,
    transform: [{ rotateY: '180deg' }],
  },
  
  text: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    minHeight: 20, // Para evitar saltos cuando cambia el texto
  },
  
  footer: {
    position: 'absolute',
    bottom: asianTheme.spacing.xl,
    alignItems: 'center',
  },
  
  version: {
    fontSize: 12,
    color: asianTheme.colors.text.light,
    marginTop: asianTheme.spacing.sm,
  },
});

export default LoadingScreen;