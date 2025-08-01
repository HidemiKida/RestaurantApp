import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';
import { useAuth } from '../../context/auth/AuthContext';
import { asianTheme } from '../../styles/asianTheme';
import { validators } from '../../utils/helpers';
import { ASIAN_EMOJIS, APP_CONFIG } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  const isWeb = Platform.OS === 'web';

  // Limpiar errores al cambiar de pantalla
  useEffect(() => {
    clearError();
  }, []);

  // Mostrar errores del contexto
  useEffect(() => {
    if (error) {
      Alert.alert('Error de Autenticación', error);
    }
  }, [error]);

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!validators.email(formData.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!validators.password(formData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Limpiar error del contexto
    if (error) {
      clearError();
    }
  };

  // Manejar login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // La navegación se maneja automáticamente por el contexto
      console.log('Login exitoso');
    }
  };

  // Manejar Enter en web
  const handleKeyPress = (event) => {
    if (isWeb && event.nativeEvent.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor={asianTheme.colors.secondary.pearl} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ResponsiveContainer style={styles.responsiveContainer}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, styles[deviceType]]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header con logo y bienvenida */}
            <View style={[styles.header, styles[`${deviceType}Header`]]}>
              <Text style={[styles.logo, styles[`${deviceType}Logo`]]}>
                {ASIAN_EMOJIS.LANTERN} {APP_CONFIG.NAME}
              </Text>
              
              <Text style={[styles.welcome, styles[`${deviceType}Welcome`]]}>
                Bienvenido de vuelta {ASIAN_EMOJIS.CHERRY}
              </Text>
              
              <Text style={[styles.subtitle, styles[`${deviceType}Subtitle`]]}>
                Inicia sesión para continuar tu experiencia culinaria
              </Text>
            </View>

            {/* Formulario */}
            <View style={[styles.form, styles[`${deviceType}Form`]]}>
              <AsianInput
                label="Correo Electrónico"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={formErrors.email}
                icon={
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={asianTheme.colors.primary.red} 
                  />
                }
                onKeyPress={handleKeyPress}
              />

              <AsianInput
                label="Contraseña"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Tu contraseña segura"
                secureTextEntry={!showPassword}
                error={formErrors.password}
                icon={
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={asianTheme.colors.primary.red} 
                  />
                }
                onKeyPress={handleKeyPress}
              />

              {/* Botón de login */}
              <AsianButton
                title={`Iniciar Sesión ${ASIAN_EMOJIS.TEMPLE}`}
                onPress={handleLogin}
                loading={isLoading}
                variant="primary"
                size={deviceType === 'mobile' ? 'medium' : 'large'}
                style={styles.loginButton}
              />

              {/* Separador */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>o</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Link para registro */}
              <AsianButton
                title={`Crear Cuenta Nueva ${ASIAN_EMOJIS.BAMBOO}`}
                onPress={() => navigation.navigate('Register')}
                variant="outline"
                size={deviceType === 'mobile' ? 'medium' : 'large'}
                disabled={isLoading}
              />
            </View>

            {/* Footer */}
            <View style={[styles.footer, styles[`${deviceType}Footer`]]}>
              <Text style={styles.footerText}>
                {APP_CONFIG.VERSION} • Hecho con {ASIAN_EMOJIS.CHERRY} para amantes de la comida asiática
              </Text>
            </View>
          </ScrollView>
        </ResponsiveContainer>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  
  responsiveContainer: {
    justifyContent: 'center',
    minHeight: height,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: asianTheme.spacing.xl,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xxl,
  },
  
  logo: {
    ...asianTheme.typography.styles.h1,
    fontWeight: asianTheme.typography.weights.bold,
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.md,
  },
  
  welcome: {
    ...asianTheme.typography.styles.h2,
    color: asianTheme.colors.primary.black,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.sm,
  },
  
  subtitle: {
    ...asianTheme.typography.styles.body,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Form
  form: {
    marginBottom: asianTheme.spacing.xl,
  },
  
  loginButton: {
    marginTop: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
  },
  
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: asianTheme.spacing.lg,
  },
  
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: asianTheme.colors.grey.medium,
  },
  
  separatorText: {
    ...asianTheme.typography.styles.caption,
    color: asianTheme.colors.secondary.bamboo,
    marginHorizontal: asianTheme.spacing.md,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: asianTheme.spacing.xl,
  },
  
  footerText: {
    ...asianTheme.typography.styles.caption,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Responsive Styles
  
  // Mobile
  mobile: {
    paddingHorizontal: asianTheme.spacing.md,
  },
  
  mobileHeader: {
    marginBottom: asianTheme.spacing.xl,
  },
  
  mobileLogo: {
    fontSize: 28,
  },
  
  mobileWelcome: {
    fontSize: 20,
  },
  
  mobileSubtitle: {
    fontSize: 14,
    paddingHorizontal: asianTheme.spacing.sm,
  },
  
  mobileForm: {
    marginHorizontal: 0,
  },
  
  mobileFooter: {
    marginTop: asianTheme.spacing.lg,
  },
  
  // Tablet
  tablet: {
    paddingHorizontal: asianTheme.spacing.xl,
    maxWidth: 500,
    alignSelf: 'center',
  },
  
  tabletHeader: {
    marginBottom: asianTheme.spacing.xxl,
  },
  
  tabletLogo: {
    fontSize: 36,
  },
  
  tabletWelcome: {
    fontSize: 24,
  },
  
  tabletSubtitle: {
    fontSize: 16,
  },
  
  tabletForm: {
    marginHorizontal: asianTheme.spacing.md,
  },
  
  tabletFooter: {
    marginTop: asianTheme.spacing.xl,
  },
  
  // Desktop
  desktop: {
    paddingHorizontal: asianTheme.spacing.xxl,
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  desktopHeader: {
    marginBottom: asianTheme.spacing.xxl * 1.5,
  },
  
  desktopLogo: {
    fontSize: 42,
  },
  
  desktopWelcome: {
    fontSize: 28,
  },
  
  desktopSubtitle: {
    fontSize: 18,
  },
  
  desktopForm: {
    marginHorizontal: asianTheme.spacing.lg,
  },
  
  desktopFooter: {
    marginTop: asianTheme.spacing.xxl,
  },
});

export default LoginScreen;