import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { 
  getThemeProperty, 
  getColor, 
  getBorderRadius, 
  getSpacing, 
  getShadow 
} from '../../styles/themeUtils';

const { width } = Dimensions.get('window');

const AsianButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
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
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <>
          <ActivityIndicator 
            color={variant === 'primary' ? getColor('white') : getColor('primary.red')} 
            size="small"
            style={styles.loadingIndicator}
          />
          {loadingText && <Text style={textStyles}>{loadingText}</Text>}
        </>
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </>
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
    color: getColor('white'),
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
  
  loadingIndicator: {
    marginRight: getSpacing('sm'),
  },
  
  iconContainer: {
    marginRight: getSpacing('sm'),
  },
});

export default AsianButton;