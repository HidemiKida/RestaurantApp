import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { useAuth } from '../../context/auth/AuthContext';
import { validators, formatError } from '../../utils/helpers';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUserInfo } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validators.name(formData.name)) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validators.email(formData.email)) {
      errors.email = 'Ingresa un email válido';
    }

    if (formData.phone && !validators.phone(formData.phone)) {
      errors.phone = 'Ingresa un número de teléfono válido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Aquí deberías tener una función en tu servicio de API para actualizar el perfil
      // Por ahora solo actualizamos el contexto local
      updateUserInfo({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      
      Alert.alert(
        '¡Perfil Actualizado!',
        'Tu información ha sido actualizada correctamente.',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert(
        'Error',
        formatError(error),
        [{ text: 'Entendido', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ResponsiveContainer style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {formData.name?.charAt(0)?.toUpperCase() || '👤'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.headerTitle}>
              Editar Perfil
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Nombre */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <AsianInput
                placeholder="Tu nombre"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                error={formErrors.name}
                leftIcon="person"
              />
            </View>
            
            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <AsianInput
                placeholder="tu@email.com"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                error={formErrors.email}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Teléfono */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
              <AsianInput
                placeholder="+34 000 000 000"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                error={formErrors.phone}
                leftIcon="call"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <AsianButton
              title="Guardar Cambios"
              onPress={handleUpdateProfile}
              loading={loading}
              loadingText="Guardando..."
              icon="save-outline"
            />
            
            <AsianButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              type="secondary"
              icon="close-circle-outline"
            />
          </View>
        </ScrollView>
      </ResponsiveContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: asianTheme.spacing.md,
    paddingBottom: asianTheme.spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: asianTheme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: asianTheme.colors.primary.red,
    justifyContent: 'center',
    alignItems: 'center',
    ...asianTheme.shadow.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: asianTheme.colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.sm,
  },
  formSection: {
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    padding: asianTheme.spacing.lg,
    ...asianTheme.shadow.md,
    marginBottom: asianTheme.spacing.lg,
  },
  formGroup: {
    marginBottom: asianTheme.spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.xs,
  },
  actionsContainer: {
    gap: asianTheme.spacing.md,
  },
});

export default EditProfileScreen;