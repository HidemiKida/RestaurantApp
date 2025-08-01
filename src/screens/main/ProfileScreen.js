import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth/AuthContext';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS, USER_ROLES } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

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

  const getRoleText = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrador 👑';
      case USER_ROLES.SUPER_ADMIN:
        return 'Super Administrador 🎖️';
      default:
        return 'Cliente 👤';
    }
  };

  const profileOptions = [
    {
      id: 'edit',
      title: 'Editar Perfil',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Ayuda', 'Funcionalidad próximamente'),
    },
    {
      id: 'about',
      title: 'Acerca de',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Acerca de', 'Asian Restaurant App v1.0.0'),
    },
  ];

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container}>
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
          
          {user?.phone && (
            <Text style={styles.userPhone}>{user.phone}</Text>
          )}
        </View>

        {/* Opciones del perfil */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={asianTheme.colors.primary.red}
                />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              
              <Ionicons
                name="chevron-forward"
                size={20}
                color={asianTheme.colors.grey.medium}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {ASIAN_EMOJIS.TEMPLE} Miembro desde
          </Text>
          <Text style={styles.infoText}>
            {new Date(user?.created_at || Date.now()).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Botón de cerrar sesión */}
        <View style={styles.logoutContainer}>
          <AsianButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={asianTheme.colors.error}
              />
            }
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {ASIAN_EMOJIS.CHERRY} Gracias por ser parte de nuestra familia asiática
          </Text>
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: asianTheme.colors.secondary.pearl,
  },

  header: {
    alignItems: 'center',
    padding: asianTheme.spacing.xl,
    backgroundColor: 'white',
    marginBottom: asianTheme.spacing.md,
  },

  avatarContainer: {
    marginBottom: asianTheme.spacing.lg,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: asianTheme.colors.primary.red,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.xs,
  },

  userEmail: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    marginBottom: asianTheme.spacing.sm,
  },

  roleBadge: {
    backgroundColor: asianTheme.colors.accent.gold,
    paddingHorizontal: asianTheme.spacing.md,
    paddingVertical: asianTheme.spacing.xs,
    borderRadius: 20,
    marginBottom: asianTheme.spacing.sm,
  },

  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },

  userPhone: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  optionsContainer: {
    backgroundColor: 'white',
    marginBottom: asianTheme.spacing.md,
  },

  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: asianTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: asianTheme.colors.grey.light,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionText: {
    fontSize: 16,
    color: asianTheme.colors.primary.black,
    marginLeft: asianTheme.spacing.md,
  },

  infoContainer: {
    backgroundColor: 'white',
    padding: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.md,
    alignItems: 'center',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.sm,
  },

  infoText: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
  },

  logoutContainer: {
    padding: asianTheme.spacing.lg,
  },

  logoutButton: {
    borderColor: asianTheme.colors.error,
  },

  logoutText: {
    color: asianTheme.colors.error,
  },

  footer: {
    padding: asianTheme.spacing.xl,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProfileScreen;