import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';
import adminService from '../../services/api/adminService';
import { formatError } from '../../utils/helpers';

const EditTableScreen = ({ route, navigation }) => {
  const { table } = route.params;
  
  const [formData, setFormData] = useState({
    number: table.number?.toString() || '',
    capacity: table.capacity?.toString() || '2',
    location: table.location || '',
    active: table.active !== undefined ? table.active : true,
  });
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: `Editar Mesa #${table.number}`,
    });
  }, [navigation, table]);

  const validateForm = () => {
    const errors = {};

    // Validar número de mesa
    if (!formData.number || isNaN(parseInt(formData.number))) {
      errors.number = 'Ingresa un número de mesa válido';
    }

    // Validar capacidad
    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1 || capacity > 20) {
      errors.capacity = 'La capacidad debe estar entre 1 y 20 personas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const handleUpdateTable = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const tableData = {
        number: parseInt(formData.number),
        capacity: parseInt(formData.capacity),
        location: formData.location,
        active: formData.active,
      };
      
      const response = await adminService.updateTable(table.id, tableData);
      
      if (response.success) {
        Alert.alert(
          '¡Mesa Actualizada! 🎉',
          'Los datos de la mesa han sido actualizados correctamente.',
          [
            { 
              text: 'Ver Mesas', 
              onPress: () => navigation.goBack()
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Error al actualizar la mesa');
      }
    } catch (error) {
      console.error('Error al actualizar mesa:', error);
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
            <Ionicons 
              name="restaurant-outline" 
              size={32} 
              color={asianTheme.colors.primary.red} 
            />
            <Text style={styles.headerTitle}>
              Editar Mesa #{table.number}
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Número de mesa */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Número de Mesa *</Text>
              <AsianInput
                placeholder="1"
                value={formData.number}
                onChangeText={(text) => handleInputChange('number', text)}
                error={formErrors.number}
                leftIcon="keypad"
                keyboardType="numeric"
              />
            </View>

            {/* Capacidad */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Capacidad *</Text>
              <AsianInput
                placeholder="2"
                value={formData.capacity}
                onChangeText={(text) => handleInputChange('capacity', text)}
                error={formErrors.capacity}
                leftIcon="people"
                keyboardType="numeric"
                hint="Entre 1 y 20 personas"
              />
            </View>

            {/* Ubicación */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Ubicación</Text>
              <AsianInput
                placeholder="Terraza, Salón principal, etc."
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                error={formErrors.location}
                leftIcon="location"
                hint="Opcional: Ubicación específica de la mesa"
              />
            </View>

            {/* Estado (Activa/Inactiva) */}
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Mesa Activa</Text>
                <Switch
                  value={formData.active}
                  onValueChange={(value) => handleInputChange('active', value)}
                  trackColor={{ 
                    false: asianTheme.colors.grey.light, 
                    true: asianTheme.colors.primary.light 
                  }}
                  thumbColor={formData.active ? asianTheme.colors.primary.red : asianTheme.colors.grey.medium}
                />
              </View>
              <Text style={styles.switchDescription}>
                Las mesas inactivas no aparecerán disponibles para reservas
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <AsianButton
              title="Guardar Cambios"
              onPress={handleUpdateTable}
              loading={loading}
              loadingText="Actualizando..."
              icon="checkmark-circle-outline"
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginVertical: asianTheme.spacing.sm,
    textAlign: 'center',
  },
  formSection: {
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: asianTheme.spacing.sm,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: asianTheme.colors.secondary.bamboo,
  },
  switchDescription: {
    fontSize: 14,
    color: asianTheme.colors.grey.medium,
    marginTop: asianTheme.spacing.xs,
  },
  actionButtons: {
    gap: asianTheme.spacing.md,
  },
});

export default EditTableScreen;