import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';

const { width } = Dimensions.get('window');

const AsianInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  disabled = false,
  icon,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  
  const containerStyle = [
    styles.container,
    styles[deviceType],
    style,
  ];
  
  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
  ];
  
  const textInputStyle = [
    styles.input,
    styles[`${deviceType}Input`],
    multiline && styles.multilineInput,
    inputStyle,
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={inputContainerStyle}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={asianTheme.colors.grey.medium}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={asianTheme.colors.grey.medium}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: asianTheme.spacing.md,
  },
  
  label: {
    ...asianTheme.typography.styles.caption,
    fontWeight: asianTheme.typography.weights.medium,
    marginBottom: asianTheme.spacing.sm,
    color: asianTheme.colors.primary.black,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.secondary.pearl,
    borderWidth: 1,
    borderColor: asianTheme.colors.grey.medium,
    borderRadius: asianTheme.borders.radius.medium,
    paddingHorizontal: asianTheme.spacing.md,
    minHeight: 48,
  },
  
  focused: {
    borderColor: asianTheme.colors.primary.red,
    ...asianTheme.shadows.small,
  },
  
  error: {
    borderColor: asianTheme.colors.error,
  },
  
  disabled: {
    backgroundColor: asianTheme.colors.grey.light,
    opacity: 0.6,
  },
  
  iconContainer: {
    marginRight: asianTheme.spacing.sm,
  },
  
  input: {
    flex: 1,
    fontSize: asianTheme.typography.sizes.md,
    color: asianTheme.colors.primary.black,
    paddingVertical: asianTheme.spacing.sm,
  },
  
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  
  passwordToggle: {
    padding: asianTheme.spacing.sm,
    marginLeft: asianTheme.spacing.sm,
  },
  
  errorText: {
    ...asianTheme.typography.styles.caption,
    color: asianTheme.colors.error,
    marginTop: asianTheme.spacing.xs,
  },
  
  // Responsivo
  mobile: {
    width: '100%',
  },
  tablet: {
    maxWidth: 400,
  },
  desktop: {
    maxWidth: 500,
  },
  
  mobileInput: {
    fontSize: asianTheme.typography.sizes.md,
  },
  tabletInput: {
    fontSize: asianTheme.typography.sizes.md,
  },
  desktopInput: {
    fontSize: asianTheme.typography.sizes.lg,
  },
});

export default AsianInput;