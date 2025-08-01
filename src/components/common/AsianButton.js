import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';

const { width } = Dimensions.get('window');

const AsianButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    styles[deviceType],
    disabled && styles.disabled,
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
        <ActivityIndicator 
          color={variant === 'primary' ? asianTheme.colors.secondary.pearl : asianTheme.colors.primary.red} 
          size="small"
        />
      ) : (
        <>
          {icon && icon}
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
    borderRadius: asianTheme.borders.radius.medium,
    ...asianTheme.shadows.small,
  },
  
  // Variantes
  primary: {
    backgroundColor: asianTheme.colors.primary.red,
  },
  secondary: {
    backgroundColor: asianTheme.colors.primary.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: asianTheme.colors.primary.red,
  },
  
  // Tamaños
  small: {
    paddingHorizontal: asianTheme.spacing.md,
    paddingVertical: asianTheme.spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: asianTheme.spacing.lg,
    paddingVertical: asianTheme.spacing.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: asianTheme.spacing.xl,
    paddingVertical: asianTheme.spacing.lg,
    minHeight: 56,
  },
  
  // Responsivo
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
    backgroundColor: asianTheme.colors.grey.medium,
    opacity: 0.6,
  },
  
  // Estilos de texto
  text: {
    fontWeight: asianTheme.typography.weights.semiBold,
    textAlign: 'center',
  },
  
  primaryText: {
    color: asianTheme.colors.secondary.pearl,
    fontSize: asianTheme.typography.sizes.md,
  },
  secondaryText: {
    color: asianTheme.colors.primary.black,
    fontSize: asianTheme.typography.sizes.md,
  },
  outlineText: {
    color: asianTheme.colors.primary.red,
    fontSize: asianTheme.typography.sizes.md,
  },
  
  smallText: {
    fontSize: asianTheme.typography.sizes.sm,
  },
  mediumText: {
    fontSize: asianTheme.typography.sizes.md,
  },
  largeText: {
    fontSize: asianTheme.typography.sizes.lg,
  },
  
  disabledText: {
    color: asianTheme.colors.grey.dark,
  },
});

export default AsianButton;