import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';
import AsianButton from '../../components/common/AsianButton';
import AsianInput from '../../components/common/AsianInput';
import adminService from '../../services/api/adminService';
import { formatError } from '../../utils/helpers';
import * as ImagePicker from 'expo-image-picker';

const RestaurantSettingsScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    phone: '',
    email: '',
    opening_hours: '',
    closing_hours: '',
    image_url: '',
    website: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Cargar datos del restaurante cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadRestaurantData();
    }, [])
  );

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getRestaurantInfo();

      if (response.success && response.data) {
        const restaurantData = response.data;
        setRestaurant(restaurantData);
        
        // Inicializar el formulario con los datos del restaurante
        setFormData({
          name: restaurantData.name || '',
          description: restaurantData.description || '',
          cuisine_type: restaurantData.cuisine_type || '',
          address: restaurantData.address || '',
          phone: restaurantData.phone || '',
          email: restaurantData.email || '',
          opening_hours: restaurantData.opening_hours || '',
          closing_hours: restaurantData.closing_hours || '',
          image_url: restaurantData.image_url || '',
          website: restaurantData.website || '',
        });
        
        // Establecer imagen de vista previa
        if (restaurantData.image_url) {
          setImagePreview(restaurantData.image_url);
        }
        
        console.log('✅ Datos del restaurante cargados');
      } else {
        throw new Error(response.message || 'Error al cargar información del restaurante');
      }
    } catch (error) {
      console.error('❌ Error loading restaurant data:', error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Reintentar', onPress: loadRestaurantData },
          { text: 'Volver', style: 'cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'El nombre del restaurante debe tener al menos 3 caracteres';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      errors.address = 'La dirección debe tener al menos 5 caracteres';
    }

    if (formData.phone && !/^\+?[0-9\s]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Ingresa un número de teléfono válido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(formData.website.trim())) {
      errors.website = 'Ingresa una URL de sitio web válida';
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

  const pickImage = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tus fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImagePreview(selectedAsset.uri);
        setNewImage(selectedAsset);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Primero subir la nueva imagen si existe
      let updatedImageUrl = formData.image_url;
      
      if (newImage) {
        // Crear un FormData para enviar la imagen
        const imageFormData = new FormData();
        
        // Añadir el archivo de imagen
        const uriParts = newImage.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        imageFormData.append('image', {
          uri: newImage.uri,
          name: `restaurant_image.${fileType}`,
          type: `image/${fileType}`,
        });
        
        // Subir imagen al servidor
        const imageUploadResponse = await adminService.uploadRestaurantImage(imageFormData);
        
        if (imageUploadResponse.success && imageUploadResponse.data?.image_url) {
          updatedImageUrl = imageUploadResponse.data.image_url;
        } else {
          throw new Error('Error al subir la imagen');
        }
      }
      
      // Preparar datos actualizados del restaurante
      const restaurantData = {
        ...formData,
        image_url: updatedImageUrl,
      };
      
      // Enviar actualización al servidor
      const response = await adminService.updateRestaurant(restaurantData);
      
      if (response.success) {
        Alert.alert(
          '¡Configuración Guardada! 🎉',
          'Los datos del restaurante han sido actualizados correctamente.',
          [{ text: 'Aceptar', style: 'default' }]
        );
        
        // Actualizar la vista con los nuevos datos
        setRestaurant(response.data);
        setNewImage(null);
      } else {
        throw new Error(response.message || 'Error al actualizar el restaurante');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      Alert.alert(
        'Error',
        formatError(error),
        [{ text: 'Entendido', style: 'default' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const getCuisineEmoji = (cuisineType) => {
    switch (cuisineType?.toLowerCase()) {
      case 'japonesa':
        return '🍣';
      case 'china':
        return '🥟';
      case 'tailandesa':
        return '🍜';
      case 'coreana':
        return '🍲';
      case 'vietnamita':
        return '🍲';
      case 'india':
        return '🍛';
      default:
        return ASIAN_EMOJIS.FOOD;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={asianTheme.colors.primary.red} />
        <Text style={styles.loadingText}>
          Cargando configuración...
        </Text>
      </View>
    );
  }

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
              name="settings-outline" 
              size={32} 
              color={asianTheme.colors.primary.red} 
            />
            <Text style={styles.headerTitle}>
              Configuración del Restaurante
            </Text>
            
            <Text style={styles.headerSubtitle}>
              Personaliza la información de tu restaurante
            </Text>
          </View>

          {/* Imagen del restaurante */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {imagePreview ? (
                <Image
                  source={{ uri: imagePreview }}
                  style={styles.restaurantImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons
                    name="restaurant-outline"
                    size={48}
                    color={asianTheme.colors.grey.medium}
                  />
                  <Text style={styles.placeholderText}>
                    Sin imagen
                  </Text>
                </View>
              )}
              
              <View style={styles.editImageButton}>
                <Ionicons
                  name="camera"
                  size={18}
                  color={asianTheme.colors.white}
                />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.imageHelperText}>
              Toca la imagen para cambiarla
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Información Básica */}
            <View style={styles.sectionTitle}>
              <Ionicons name="information-circle" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.sectionTitleText}>Información Básica</Text>
            </View>
            
            {/* Nombre */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Nombre del Restaurante *</Text>
              <AsianInput
                placeholder="Nombre de tu restaurante"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                error={formErrors.name}
                leftIcon="restaurant"
              />
            </View>

            {/* Tipo de cocina */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Tipo de Cocina</Text>
              <AsianInput
                placeholder="Japonesa, China, Tailandesa, etc."
                value={formData.cuisine_type}
                onChangeText={(text) => handleInputChange('cuisine_type', text)}
                error={formErrors.cuisine_type}
                leftIcon="restaurant"
              />
              <View style={styles.cuisinePreview}>
                <Text style={styles.cuisineEmoji}>
                  {getCuisineEmoji(formData.cuisine_type)}
                </Text>
                <Text style={styles.cuisineText}>
                  {formData.cuisine_type || 'Tipo de cocina no especificado'}
                </Text>
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <AsianInput
                placeholder="Describe tu restaurante..."
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                error={formErrors.description}
                leftIcon="document-text"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Contacto y Ubicación */}
            <View style={styles.sectionTitle}>
              <Ionicons name="location" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.sectionTitleText}>Contacto y Ubicación</Text>
            </View>
            
            {/* Dirección */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Dirección *</Text>
              <AsianInput
                placeholder="Dirección completa"
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                error={formErrors.address}
                leftIcon="location"
              />
            </View>

            {/* Teléfono */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <AsianInput
                placeholder="+34 000 000 000"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                error={formErrors.phone}
                leftIcon="call"
                keyboardType="phone-pad"
              />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <AsianInput
                placeholder="restaurante@ejemplo.com"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                error={formErrors.email}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Sitio web */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Sitio Web</Text>
              <AsianInput
                placeholder="https://www.turestaurante.com"
                value={formData.website}
                onChangeText={(text) => handleInputChange('website', text)}
                error={formErrors.website}
                leftIcon="globe"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Horarios */}
            <View style={styles.sectionTitle}>
              <Ionicons name="time" size={20} color={asianTheme.colors.primary.red} />
              <Text style={styles.sectionTitleText}>Horario de Atención</Text>
            </View>
            
            {/* Hora de apertura */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Hora de Apertura</Text>
              <AsianInput
                placeholder="09:00"
                value={formData.opening_hours}
                onChangeText={(text) => handleInputChange('opening_hours', text)}
                error={formErrors.opening_hours}
                leftIcon="time"
              />
            </View>

            {/* Hora de cierre */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Hora de Cierre</Text>
              <AsianInput
                placeholder="22:00"
                value={formData.closing_hours}
                onChangeText={(text) => handleInputChange('closing_hours', text)}
                error={formErrors.closing_hours}
                leftIcon="time"
              />
            </View>
          </View>

          <View style={styles.actionButtons}>
            <AsianButton
              title="Guardar Cambios"
              onPress={handleSaveChanges}
              loading={saving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.secondary.pearl,
  },
  loadingText: {
    marginTop: asianTheme.spacing.md,
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginTop: asianTheme.spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.xs,
    textAlign: 'center',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: asianTheme.spacing.lg,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: asianTheme.colors.white,
    ...asianTheme.shadow.md,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: asianTheme.colors.grey.light,
  },
  placeholderText: {
    marginTop: asianTheme.spacing.xs,
    color: asianTheme.colors.grey.medium,
    fontSize: 14,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: asianTheme.colors.primary.red,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...asianTheme.shadow.sm,
  },
  imageHelperText: {
    marginTop: asianTheme.spacing.sm,
    fontSize: 14,
    color: asianTheme.colors.grey.medium,
  },
  formSection: {
    marginBottom: asianTheme.spacing.lg,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.lg,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginLeft: asianTheme.spacing.sm,
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
  cuisinePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: asianTheme.spacing.xs,
  },
  cuisineEmoji: {
    fontSize: 18,
    marginRight: asianTheme.spacing.sm,
  },
  cuisineText: {
    fontSize: 14,
    color: asianTheme.colors.grey.medium,
  },
  actionButtons: {
    gap: asianTheme.spacing.md,
    marginTop: asianTheme.spacing.md,
  },
});

export default RestaurantSettingsScreen;