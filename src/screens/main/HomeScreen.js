import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth/AuthContext';
import { asianTheme } from '../../styles/asianTheme';
import { ASIAN_EMOJIS } from '../../utils/constants';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>
            ¡Bienvenido, {user?.name}! {ASIAN_EMOJIS.CHERRY}
          </Text>
          
          <Text style={styles.subtitle}>
            Descubre los mejores sabores asiáticos
          </Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {ASIAN_EMOJIS.RESTAURANT} Panel Principal
          </Text>
          
          <Text style={styles.description}>
            Desde aquí podrás explorar restaurantes, gestionar tus reservas 
            y disfrutar de la mejor experiencia gastronómica asiática.
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
    padding: asianTheme.spacing.lg,
    alignItems: 'center',
  },
  
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
    marginBottom: asianTheme.spacing.sm,
  },
  
  subtitle: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
  },
  
  content: {
    padding: asianTheme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.black,
    marginBottom: asianTheme.spacing.md,
  },
  
  description: {
    fontSize: 16,
    color: asianTheme.colors.secondary.bamboo,
    lineHeight: 24,
  },
});

export default HomeScreen;