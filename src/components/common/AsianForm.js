import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getColor, getSpacing, getBorderRadius } from '../../styles/themeUtils';

const AsianForm = ({ children, title, onSubmit, style }) => {
  // Detectar si estamos en iOS para usar KeyboardAvoidingView correctamente
  const isIOS = Platform.OS === 'ios';
  
  // En dispositivos móviles, necesitamos manejar el teclado
  if (Platform.OS !== 'web') {
    return (
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={[styles.container, style]}
        keyboardVerticalOffset={isIOS ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
  
  // En web, usamos un formulario HTML normal
  return (
    <View
      style={[styles.container, style]}
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('lg'),
    // Sombra adaptada a cada plataforma
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(196, 30, 58, 0.15)',
      },
      default: {
        shadowColor: getColor('primary.red'),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
    // Bordes con estilo oriental (sutil)
    borderLeftWidth: 4,
    borderLeftColor: getColor('primary.red'),
  },
  inner: {
    padding: getSpacing('sm'),
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: getColor('primary.red'),
    marginBottom: getSpacing('lg'),
    textAlign: 'center',
    // Fuente oriental en web
    ...(Platform.OS === 'web' ? {
      fontFamily: "'Noto Serif JP', serif",
    } : {}),
  },
});

export default AsianForm;