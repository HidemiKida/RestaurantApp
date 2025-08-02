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
import { 
  getColor, 
  getSpacing, 
  getBorderRadius, 
  getShadow, 
  getTextColor, 
  getBackgroundColor 
} from '../../styles/themeUtils';
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
                leftIcon={<Ionicons name="person" size={20} color={getColor('secondary.bamboo')} />}
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
                leftIcon={<Ionicons name="mail" size={20} color={getColor('secondary.bamboo')} />}
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
                leftIcon={<Ionicons name="call" size={20} color={getColor('secondary.bamboo')} />}
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
              icon={<Ionicons name="save-outline" size={20} color="white" />}
              variant="primary"
            />
            
            <AsianButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="secondary"
              icon={<Ionicons name="close-circle-outline" size={20} color={getColor('primary.black')} />}
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
    backgroundColor: getBackgroundColor('default'),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: getSpacing('md'),
    paddingBottom: getSpacing('xxl'),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getSpacing('lg'),
  },
  avatarContainer: {
    marginBottom: getSpacing('md'),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: getColor('primary.red'),
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadow('medium'),
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: getColor('primary.red'),
    marginBottom: getSpacing('sm'),
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('lg'),
    ...getShadow('medium'),
    marginBottom: getSpacing('lg'),
  },
  formGroup: {
    marginBottom: getSpacing('md'),
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor('secondary.bamboo'),
    marginBottom: getSpacing('xs'),
  },
  actionsContainer: {
    gap: getSpacing('md'),
  },
});

export default EditProfileScreen;