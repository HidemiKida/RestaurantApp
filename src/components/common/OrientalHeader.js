import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';
import { Ionicons } from '@expo/vector-icons';

const OrientalHeader = ({ title, subtitle, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.decorationLine} />
      
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={28} color={asianTheme.colors.primary.red} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.decorationLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: asianTheme.spacing.lg,
    paddingHorizontal: asianTheme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: asianTheme.spacing.md,
  },
  iconContainer: {
    marginRight: asianTheme.spacing.md,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: asianTheme.typography.sizes.xl,
    fontWeight: asianTheme.typography.weights.bold,
    color: asianTheme.colors.primary.red,
    textAlign: 'center',
    // Estilo de fuente oriental en web
    ...(Platform.OS === 'web' ? {
      fontFamily: asianTheme.typography.fontFamily.decorative,
    } : {}),
  },
  subtitle: {
    fontSize: asianTheme.typography.sizes.md,
    color: asianTheme.colors.secondary.bamboo,
    textAlign: 'center',
    marginTop: asianTheme.spacing.xs,
  },
  decorationLine: {
    height: 2,
    backgroundColor: asianTheme.colors.primary.gold,
    width: '100%',
    marginVertical: asianTheme.spacing.xs,
  },
});

export default OrientalHeader;