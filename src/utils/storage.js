import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

class StorageService {
  // Token de autenticación
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  }

  // Datos del usuario
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async removeUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  }

  // Limpiar todo el storage
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.PREFERENCES,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Preferencias de usuario
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  async getPreferences() {
    try {
      const prefs = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }
}

export default new StorageService();