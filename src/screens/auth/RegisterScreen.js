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

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    phone: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  const isWeb = Platform.OS === 'web';

  // Limpiar errores al cambiar de pantalla
  useEffect(() => {
    clearError();
  }, []);

  // Mostrar errores del contexto
  useEffect(() => {
    if (error) {
      Alert.alert('Error de Registro', error);
    }
  }, [error]);

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!validators.name(formData.name)) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validators.email(formData.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (!validators.password(formData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Las contraseñas no coinciden';
    }

    if (formData.phone && !validators.phone(formData.phone)) {
      errors.phone = 'Ingresa un número de teléfono válido';
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

  // Manejar registro
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await register(formData);

    if (result.success) {
      Alert.alert(
        '¡Registro Exitoso! 🎌',
        'Tu cuenta ha sido creada. ¡Bienvenido a nuestra familia asiática!',
        [{ text: 'Continuar', style: 'default' }]
      );
    }
  };

  // Manejar Enter en web
  const handleKeyPress = (event) => {
    if (isWeb && event.nativeEvent.key === 'Enter') {
      handleRegister();
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
            {/* Header */}
            <View style={[styles.header, styles[`${deviceType}Header`]]}>
              <Text style={[styles.logo, styles[`${deviceType}Logo`]]}>
                {ASIAN_EMOJIS.BAMBOO} Únete a Nosotros
              </Text>
              
              <Text style={[styles.subtitle, styles[`${deviceType}Subtitle`]]}>
                Crea tu cuenta y descubre la mejor experiencia gastronómica asiática
              </Text>
            </View>

            {/* Formulario */}
            <View style={[styles.form, styles[`${deviceType}Form`]]}>
              <AsianInput
                label="Nombre Completo"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Tu nombre completo"
                error={formErrors.name}
                icon={
                  <Ionicons 
                    name="person-outline" 
                    size={20} 
                    color={asianTheme.colors.primary.red} 
                  />
                }
                onKeyPress={handleKeyPress}
              />

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
                label="Teléfono (Opcional)"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="+1 234 567 8900"
                keyboardType="phone-pad"
                error={formErrors.phone}
                icon={
                  <Ionicons 
                    name="call-outline" 
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
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
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

              <AsianInput
                label="Confirmar Contraseña"
                value={formData.passwordConfirmation}
                onChangeText={(value) => handleInputChange('passwordConfirmation', value)}
                placeholder="Repite tu contraseña"
                secureTextEntry
                error={formErrors.passwordConfirmation}
                icon={
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={20} 
                    color={asianTheme.colors.primary.red} 
                  />
                }
                onKeyPress={handleKeyPress}
              />

              {/* Botón de registro */}
              <AsianButton
                title={`Crear Cuenta ${ASIAN_EMOJIS.CHERRY}`}
                onPress={handleRegister}
                loading={isLoading}
                variant="primary"
                size={deviceType === 'mobile' ? 'medium' : 'large'}
                style={styles.registerButton}
              />

              {/* Separador */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>¿Ya tienes cuenta?</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Link para login */}
              <AsianButton
                title={`Iniciar Sesión ${ASIAN_EMOJIS.TEMPLE}`}
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                size={deviceType === 'mobile' ? 'medium' : 'large'}
                disabled={isLoading}
              />
            </View>

            {/* Footer */}
            <View style={[styles.footer, styles[`${deviceType}Footer`]]}>
              <Text style={styles.footerText}>
                Al registrarte, aceptas nuestros términos de servicio y política de privacidad
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
    paddingVertical: asianTheme.spacing.lg,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.xl,
  },
  
  logo: {
    ...asianTheme.typography.styles.h1,
    fontWeight: asianTheme.typography.weights.bold,
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.md,
  },
  
  subtitle: {
    ...asianTheme.typography.styles.body,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Form
  form: {
    marginBottom: asianTheme.spacing.lg,
  },
  
  registerButton: {
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
    marginTop: asianTheme.spacing.lg,
  },
  
  footerText: {
    ...asianTheme.typography.styles.caption,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },
  
  // Responsive Styles - Mismo patrón que LoginScreen
  mobile: {
    paddingHorizontal: asianTheme.spacing.md,
  },
  
  mobileHeader: {
    marginBottom: asianTheme.spacing.lg,
  },
  
  mobileLogo: {
    fontSize: 24,
  },
  
  mobileSubtitle: {
    fontSize: 14,
    paddingHorizontal: asianTheme.spacing.sm,
  },
  
  mobileForm: {
    marginHorizontal: 0,
  },
  
  mobileFooter: {
    marginTop: asianTheme.spacing.md,
  },
  
  // Tablet
  tablet: {
    paddingHorizontal: asianTheme.spacing.xl,
    maxWidth: 500,
    alignSelf: 'center',
  },
  
  tabletHeader: {
    marginBottom: asianTheme.spacing.xl,
  },
  
  tabletLogo: {
    fontSize: 30,
  },
  
  tabletSubtitle: {
    fontSize: 16,
  },
  
  tabletForm: {
    marginHorizontal: asianTheme.spacing.md,
  },
  
  tabletFooter: {
    marginTop: asianTheme.spacing.lg,
  },
  
  // Desktop
  desktop: {
    paddingHorizontal: asianTheme.spacing.xxl,
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  desktopHeader: {
    marginBottom: asianTheme.spacing.xxl,
  },
  
  desktopLogo: {
    fontSize: 36,
  },
  
  desktopSubtitle: {
    fontSize: 18,
  },
  
  desktopForm: {
    marginHorizontal: asianTheme.spacing.lg,
  },
  
  desktopFooter: {
    marginTop: asianTheme.spacing.xl,
  },
});

export default RegisterScreen;