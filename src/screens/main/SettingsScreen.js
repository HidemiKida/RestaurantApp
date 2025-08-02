import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import { useAuth } from '../../context/auth/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user, updateUserInfo } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: user?.notifications_enabled !== false,
    darkMode: false,
    language: 'es', // 'es' para español, 'en' para inglés
    emailUpdates: true,
  });

  const handleToggleSetting = (key) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      
      // Aquí podrías guardar el cambio en la API/backend
      if (key === 'notifications') {
        updateUserSettings({ notifications_enabled: newSettings[key] });
      }
      
      return newSettings;
    });
  };

  const updateUserSettings = async (settingsToUpdate) => {
    try {
      // Aquí implementarías la llamada a la API para guardar las configuraciones
      // Por ahora solo actualiza el estado local del usuario en el contexto
      updateUserInfo({ ...user, ...settingsToUpdate });
      console.log('✅ Configuraciones actualizadas:', settingsToUpdate);
    } catch (error) {
      console.error('Error al actualizar configuraciones:', error);
      Alert.alert('Error', 'No se pudieron guardar las configuraciones');
    }
  };

  const handleLanguageChange = (language) => {
    setSettings(prev => ({ ...prev, language }));
    // Aquí implementarías el cambio de idioma
    Alert.alert(
      'Cambio de Idioma',
      `La aplicación cambiará a ${language === 'es' ? 'Español' : 'Inglés'}`,
      [{ text: 'Aceptar' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          onPress: () => {
            // Suponiendo que tienes una función logout en tu contexto de autenticación
            const { logout } = useAuth();
            logout();
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de',
      'Restaurant App v1.0.0\n\nDesarrollada con ❤️\n© 2023 Asian Restaurant',
      [{ text: 'Cerrar' }]
    );
  };

  const handleTerms = () => {
    navigation.navigate('Terms');
  };

  const handlePrivacy = () => {
    navigation.navigate('Privacy');
  };

  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Ionicons 
              name="settings-outline" 
              size={32} 
              color={asianTheme.colors.primary.red} 
            />
            <Text style={styles.headerTitle}>
              Configuración
            </Text>
            <Text style={styles.headerSubtitle}>
              Personaliza tu experiencia
            </Text>
          </View>

          {/* Sección de Preferencias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferencias</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
                <Text style={styles.settingLabel}>Notificaciones</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggleSetting('notifications')}
                trackColor={{ 
                  false: asianTheme.colors.grey.light, 
                  true: asianTheme.colors.primary.light 
                }}
                thumbColor={settings.notifications ? asianTheme.colors.primary.red : asianTheme.colors.grey.medium}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
                <Text style={styles.settingLabel}>Modo Oscuro</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                trackColor={{ 
                  false: asianTheme.colors.grey.light, 
                  true: asianTheme.colors.primary.light 
                }}
                thumbColor={settings.darkMode ? asianTheme.colors.primary.red : asianTheme.colors.grey.medium}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
                <Text style={styles.settingLabel}>Actualizaciones por Email</Text>
              </View>
              <Switch
                value={settings.emailUpdates}
                onValueChange={() => handleToggleSetting('emailUpdates')}
                trackColor={{ 
                  false: asianTheme.colors.grey.light, 
                  true: asianTheme.colors.primary.light 
                }}
                thumbColor={settings.emailUpdates ? asianTheme.colors.primary.red : asianTheme.colors.grey.medium}
              />
            </View>
          </View>

          {/* Sección de Idioma */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Idioma</Text>
            
            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  settings.language === 'es' && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange('es')}
              >
                <Text style={[
                  styles.languageText,
                  settings.language === 'es' && styles.selectedLanguageText
                ]}>
                  Español 🇪🇸
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  settings.language === 'en' && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageText,
                  settings.language === 'en' && styles.selectedLanguageText
                ]}>
                  English 🇺🇸
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección de Información Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleTerms}
            >
              <Ionicons name="document-text-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
              <Text style={styles.legalItemText}>Términos de Servicio</Text>
              <Ionicons name="chevron-forward" size={20} color={asianTheme.colors.grey.medium} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handlePrivacy}
            >
              <Ionicons name="shield-checkmark-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
              <Text style={styles.legalItemText}>Política de Privacidad</Text>
              <Ionicons name="chevron-forward" size={20} color={asianTheme.colors.grey.medium} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleAbout}
            >
              <Ionicons name="information-circle-outline" size={24} color={asianTheme.colors.secondary.bamboo} />
              <Text style={styles.legalItemText}>Acerca de</Text>
              <Ionicons name="chevron-forward" size={20} color={asianTheme.colors.grey.medium} />
            </TouchableOpacity>
          </View>

          {/* Botón de Cerrar Sesión */}
          <View style={styles.logoutSection}>
            <AsianButton
              title="Cerrar Sesión"
              onPress={handleLogout}
              type="danger"
              icon="log-out"
              fullWidth
            />
          </View>
        </ScrollView>
      </ResponsiveContainer>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginVertical: asianTheme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
  },
  section: {
    backgroundColor: asianTheme.colors.white,
    borderRadius: asianTheme.borderRadius.md,
    marginBottom: asianTheme.spacing.lg,
    padding: asianTheme.spacing.md,
    ...asianTheme.shadow.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: asianTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
    marginBottom: asianTheme.spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: asianTheme.colors.text.dark,
    marginLeft: asianTheme.spacing.md,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: asianTheme.spacing.sm,
  },
  languageOption: {
    paddingVertical: asianTheme.spacing.sm,
    paddingHorizontal: asianTheme.spacing.lg,
    borderRadius: asianTheme.borderRadius.sm,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  selectedLanguage: {
    backgroundColor: asianTheme.colors.primary.light,
  },
  languageText: {
    fontSize: 16,
    color: asianTheme.colors.text.dark,
  },
  selectedLanguageText: {
    color: asianTheme.colors.primary.red,
    fontWeight: 'bold',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: asianTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },
  legalItemText: {
    flex: 1,
    fontSize: 16,
    color: asianTheme.colors.text.dark,
    marginLeft: asianTheme.spacing.md,
  },
  logoutSection: {
    marginVertical: asianTheme.spacing.lg,
  },
});

export default SettingsScreen;