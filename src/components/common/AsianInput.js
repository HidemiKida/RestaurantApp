import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';
import { 
  getColor, 
  getSpacing, 
  getBorderRadius 
} from '../../styles/themeUtils';

const AsianInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  error,
  icon,
  leftIcon, // Para mantener compatibilidad con el código anterior
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Usar icon o leftIcon (para compatibilidad)
  const iconToDisplay = icon || leftIcon;
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
        ]}
      >
        {iconToDisplay && (
          <View style={styles.iconContainer}>
            {iconToDisplay}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Propiedades importantes para prevenir bugs en móviles
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholderTextColor={getColor ? getColor('grey.medium') : asianTheme.colors.grey.medium}
          selectionColor={getColor ? getColor('primary.red') : asianTheme.colors.primary.red}
          // Asegurar compatibilidad web
          {...(Platform.OS === 'web' ? {
            outlineWidth: 0,
            outlineStyle: 'none',
          } : {})}
          {...props}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: asianTheme.spacing.md,
  },
  label: {
    fontSize: asianTheme.typography.sizes.md,
    fontWeight: asianTheme.typography.weights.medium,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: asianTheme.colors.grey.light,
    borderRadius: asianTheme.borderRadius.md,
    backgroundColor: asianTheme.colors.white,
    overflow: 'hidden',
    // Tamaño mínimo para mejorar la interacción táctil
    minHeight: 48,
    // Ajuste para web
    ...(Platform.OS === 'web' ? {
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    } : {}),
  },
  iconContainer: {
    padding: asianTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    padding: asianTheme.spacing.md,
    color: asianTheme.colors.primary.black,
    fontSize: asianTheme.typography.sizes.md,
    // Ajustes específicos por plataforma
    ...Platform.select({
      ios: {
        paddingVertical: asianTheme.spacing.sm,
      },
      android: {
        paddingVertical: 0,
      },
      web: {
        outlineWidth: 0,
        outlineStyle: 'none',
      },
    }),
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: asianTheme.spacing.md,
  },
  focused: {
    borderColor: asianTheme.colors.primary.red,
    // Sombra suave cuando está enfocado
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(196, 30, 58, 0.1)',
      },
      default: {
        shadowColor: asianTheme.colors.primary.red,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
      },
    }),
  },
  error: {
    borderColor: asianTheme.colors.error,
  },
  errorText: {
    color: asianTheme.colors.error,
    fontSize: asianTheme.typography.sizes.xs,
    marginTop: asianTheme.spacing.xs,
    marginLeft: asianTheme.spacing.sm,
  },
});

export default AsianInput;