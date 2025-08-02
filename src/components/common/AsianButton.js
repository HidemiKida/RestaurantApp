import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  View,
  Platform
} from 'react-native';
import { getColor, getBorderRadius, getSpacing, getShadow } from '../../styles/themeUtils';

const { width } = Dimensions.get('window');

const AsianButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
  loadingText,
  ...props
}) => {
  const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    !fullWidth && styles[deviceType],
    disabled && styles.disabled,
    getShadow('small'),
    // Añadir estilo especial para web
    Platform.OS === 'web' && styles.webButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    // Añadir estilo especial para web
    Platform.OS === 'web' && styles.webButtonText,
    textStyle,
  ];

  // Efecto hover para web
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Props específicos para web
  const webProps = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        isHovered && styles.hoverEffect,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      pressRetentionOffset={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...webProps}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            color={variant === 'primary' ? 'white' : getColor('primary.red')} 
            size="small"
            style={styles.loadingIndicator}
          />
          {loadingText && <Text style={textStyles}>{loadingText}</Text>}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
      
      {/* Decoración oriental */}
      {variant === 'primary' && !disabled && (
        <View style={styles.decoration}/>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: getBorderRadius('md'),
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Contenedor para alinear contenido
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variantes
  primary: {
    backgroundColor: getColor('primary.red'),
  },
  secondary: {
    backgroundColor: getColor('primary.gold'),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: getColor('primary.red'),
  },
  
  // Tamaños
  small: {
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('sm'),
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('md'),
    minHeight: 48,
  },
  large: {
    paddingHorizontal: getSpacing('xl'),
    paddingVertical: getSpacing('lg'),
    minHeight: 56,
  },
  
  // Responsivo
  fullWidth: {
    width: '100%',
  },
  mobile: {
    width: '100%',
  },
  tablet: {
    minWidth: 200,
    maxWidth: 300,
  },
  desktop: {
    minWidth: 250,
    maxWidth: 400,
  },
  
  // Estado deshabilitado
  disabled: {
    backgroundColor: getColor('grey.medium'),
    opacity: 0.6,
  },
  
  // Estilos de texto
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  primaryText: {
    color: 'white',
    fontSize: 16,
  },
  secondaryText: {
    color: getColor('primary.black'),
    fontSize: 16,
  },
  outlineText: {
    color: getColor('primary.red'),
    fontSize: 16,
  },
  
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabledText: {
    color: getColor('grey.dark'),
  },
  
  // Indicadores de carga
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: getSpacing('sm'),
  },
  
  iconContainer: {
    marginRight: getSpacing('sm'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Estilos específicos para web
  webButton: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  
  webButtonText: {
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  
  hoverEffect: {
    opacity: 0.9,
    transform: [{translateY: -2}],
  },
  
  // Decoración oriental (bordes estilo chino)
  decoration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: getColor('primary.gold'),
    opacity: 0.8,
  }
});

export default AsianButton;