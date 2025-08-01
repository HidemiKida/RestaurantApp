import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../../services/api/authService';
import { formatError } from '../../utils/helpers';

// Estados del contexto
const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

// Tipos de acciones
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer para manejar el estado
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar estado de autenticación al iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const { isAuthenticated, user } = await authService.checkAuthStatus();
      
      if (isAuthenticated && user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.login(credentials);
      
      if (response.success && response.data?.user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.data.user });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.register(userData);
      
      if (response.success && response.data?.user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.data.user });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      await authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error en logout:', error);
      // Forzar logout local aunque falle el servidor
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Actualizar perfil
  const updateProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data?.user) {
        dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: response.data.user });
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    }
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // Estado
    ...state,
    // Acciones
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;