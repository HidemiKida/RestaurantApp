import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth/AuthContext';
import { asianTheme } from '../../styles/asianTheme';
import { 
  getColor, 
  getSpacing, 
  getBorderRadius, 
  getShadow, 
  getTextColor, 
  getBackgroundColor 
} from '../../styles/themeUtils';
import { ASIAN_EMOJIS, USER_ROLES } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';
import { formatError, validators } from '../../utils/helpers';
import adminService from '../../services/api/adminService';

const AdminProfileScreen = ({ navigation }) => {
  const { user, updateUserInfo, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notifications_enabled: user?.notifications_enabled !== false,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const getRoleText = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador 👑';
      case USER_ROLES.SUPER_ADMIN:
        return 'Super Administrador 🎖️';
      default:
        return 'Usuario 👤';
    }
  };

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

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
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

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.current_password) {
      errors.current_password = 'Ingresa tu contraseña actual';
    }

    if (!validators.password(passwordForm.new_password)) {
      errors.new_password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = 'Las contraseñas no coinciden';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await adminService.updateProfile(formData);
      
      if (response.success) {
        // Actualizar la información de usuario en el contexto
        updateUserInfo(response.data);
        
        Alert.alert(
          '¡Perfil Actualizado! 🎉',
          'Tu información ha sido actualizada correctamente.',
          [{ text: 'Aceptar' }]
        );
        
        setIsEditing(false);
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert(
        'Error',
        formatError(error),
        [{ text: 'Entendido', style: 'default' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await adminService.changePassword({
        current_password: passwordForm.current_password,
        password: passwordForm.new_password,
        password_confirmation: passwordForm.confirm_password,
      });
      
      if (response.success) {
        Alert.alert(
          '¡Contraseña Cambiada! 🎉',
          'Tu contraseña ha sido actualizada correctamente. Por favor, inicia sesión nuevamente.',
          [{ 
            text: 'Aceptar', 
            onPress: () => {
              // Cerrar sesión y volver a la pantalla de login
              logout();
            }
          }]
        );
      } else {
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert(
        'Error',
        formatError(error),
        [{ text: 'Entendido', style: 'default' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Si estamos en modo edición, preguntamos si quiere descartar los cambios
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro que deseas descartar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Descartar', 
            style: 'destructive',
            onPress: () => {
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                notifications_enabled: user?.notifications_enabled !== false,
              });
              setFormErrors({});
              setIsEditing(false);
            }
          },
        ]
      );
    } else {
      setIsEditing(true);
    }
  };

  const renderProfileView = () => (
    <>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color={getColor('secondary.bamboo')} />
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={getColor('secondary.bamboo')} />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        
        {user?.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={getColor('secondary.bamboo')} />
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color={getColor('secondary.bamboo')} />
          <Text style={styles.infoLabel}>Rol:</Text>
          <Text style={styles.infoValue}>{getRoleText(user?.role)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons 
            name={user?.notifications_enabled ? "notifications" : "notifications-off"} 
            size={20} 
            color={getColor('secondary.bamboo')}
          />
          <Text style={styles.infoLabel}>Notificaciones:</Text>
          <Text style={styles.infoValue}>
            {user?.notifications_enabled !== false ? 'Activadas' : 'Desactivadas'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <AsianButton
          title="Editar Perfil"
          onPress={toggleEdit}
          variant="primary"
          icon={<Ionicons name="pencil" size={20} color="white" />}
        />
        
        <AsianButton
          title="Cambiar Contraseña"
          onPress={() => setShowPasswordSection(true)}
          variant="secondary"
          icon={<Ionicons name="lock-closed" size={20} color={getColor('primary.black')} />}
        />
      </View>
    </>
  );

  const renderEditForm = () => (
    <>
      <View style={styles.formCard}>
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <AsianInput
            placeholder="Tu nombre completo"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            error={formErrors.name}
            leftIcon={<Ionicons name="person" size={20} color={getColor('secondary.bamboo')} />}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Email</Text>
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
        
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
          <AsianInput
            placeholder="Tu número de teléfono"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            error={formErrors.phone}
            leftIcon={<Ionicons name="call" size={20} color={getColor('secondary.bamboo')} />}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Activar Notificaciones</Text>
            <Switch
              value={formData.notifications_enabled}
              onValueChange={(value) => handleInputChange('notifications_enabled', value)}
              trackColor={{ 
                false: getColor('grey.light'), 
                true: getColor('primary.light') 
              }}
              thumbColor={
                formData.notifications_enabled 
                  ? getColor('primary.red') 
                  : getColor('grey.medium')
              }
            />
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <AsianButton
          title="Guardar Cambios"
          onPress={handleSaveProfile}
          variant="primary"
          icon={<Ionicons name="save" size={20} color="white" />}
          loading={saving}
          loadingText="Guardando..."
        />
        
        <AsianButton
          title="Cancelar"
          onPress={toggleEdit}
          variant="secondary"
          icon={<Ionicons name="close" size={20} color={getColor('primary.black')} />}
        />
      </View>
    </>
  );

  const renderPasswordForm = () => (
    <>
      <View style={styles.formCard}>
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Contraseña Actual</Text>
          <AsianInput
            placeholder="Ingresa tu contraseña actual"
            value={passwordForm.current_password}
            onChangeText={(text) => handlePasswordChange('current_password', text)}
            error={passwordErrors.current_password}
            leftIcon={<Ionicons name="lock-closed" size={20} color={getColor('secondary.bamboo')} />}
            secureTextEntry
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nueva Contraseña</Text>
          <AsianInput
            placeholder="Mínimo 8 caracteres"
            value={passwordForm.new_password}
            onChangeText={(text) => handlePasswordChange('new_password', text)}
            error={passwordErrors.new_password}
            leftIcon={<Ionicons name="key" size={20} color={getColor('secondary.bamboo')} />}
            secureTextEntry
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
          <AsianInput
            placeholder="Repite la nueva contraseña"
            value={passwordForm.confirm_password}
            onChangeText={(text) => handlePasswordChange('confirm_password', text)}
            error={passwordErrors.confirm_password}
            leftIcon={<Ionicons name="key" size={20} color={getColor('secondary.bamboo')} />}
            secureTextEntry
          />
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <AsianButton
          title="Cambiar Contraseña"
          onPress={handleChangePassword}
          variant="primary"
          icon={<Ionicons name="key" size={20} color="white" />}
          loading={saving}
          loadingText="Cambiando..."
        />
        
        <AsianButton
          title="Cancelar"
          onPress={() => {
            setShowPasswordSection(false);
            setPasswordForm({
              current_password: '',
              new_password: '',
              confirm_password: '',
            });
            setPasswordErrors({});
          }}
          variant="secondary"
          icon={<Ionicons name="close" size={20} color={getColor('primary.black')} />}
        />
      </View>
    </>
  );

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
          {/* Header con información del usuario */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{getRoleText(user?.role)}</Text>
            </View>
          </View>

          {/* Contenido principal (vista o formularios) */}
          {showPasswordSection ? (
            renderPasswordForm()
          ) : isEditing ? (
            renderEditForm()
          ) : (
            renderProfileView()
          )}

          {/* Botón de cerrar sesión */}
          <View style={styles.logoutContainer}>
            <AsianButton
              title="Cerrar Sesión"
              onPress={handleLogout}
              variant="outline" // Cambiado de "type" a "variant"
              style={{ borderColor: getColor('error') }} // En lugar de "danger"
              textStyle={{ color: getColor('error') }}
              icon={<Ionicons name="log-out" size={20} color={getColor('error')} />}
              fullWidth
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
  header: {
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
    ...getShadow('medium'), // Cambiado de asianTheme.shadow.md
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: getTextColor('dark'),
    marginBottom: getSpacing('xs'),
  },
  userEmail: {
    fontSize: 16,
    color: getColor('grey.dark'),
    marginBottom: getSpacing('sm'),
  },
  roleBadge: {
    backgroundColor: getColor('primary.light'),
    paddingVertical: getSpacing('xs'),
    paddingHorizontal: getSpacing('md'),
    borderRadius: getBorderRadius('sm'),
  },
  roleText: {
    color: getColor('primary.red'),
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('lg'),
    ...getShadow('medium'), // Cambiado de asianTheme.shadow.md
    marginBottom: getSpacing('lg'),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing('md'),
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
    color: getColor('secondary.bamboo'),
    marginLeft: getSpacing('sm'),
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: getTextColor('dark'),
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: getBorderRadius('md'),
    padding: getSpacing('lg'),
    ...getShadow('medium'), // Cambiado de asianTheme.shadow.md
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getSpacing('sm'),
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor('secondary.bamboo'),
  },
  actionsContainer: {
    gap: getSpacing('md'),
    marginBottom: getSpacing('xl'),
  },
  logoutContainer: {
    marginTop: getSpacing('lg'),
  },
});

export default AdminProfileScreen;