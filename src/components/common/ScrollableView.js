import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { getBackgroundColor, getSpacing } from '../../styles/themeUtils';

const ScrollableView = ({ children, style, contentContainerStyle, showScrollIndicator = true }) => {
  // En web, usamos un enfoque diferente para manejar el scroll
  if (Platform.OS === 'web') {
    return (
      <View 
        style={[styles.webContainer, style]}
        className="scrollable-container"
      >
        <View style={[styles.webContent, contentContainerStyle]}>
          {children}
        </View>
        
        {/* Inyectar estilos CSS específicos para web */}
        <style jsx global>{`
          .scrollable-container {
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #C41E3A #F9F6F0;
          }
          
          .scrollable-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .scrollable-container::-webkit-scrollbar-track {
            background: #F9F6F0;
          }
          
          .scrollable-container::-webkit-scrollbar-thumb {
            background-color: #C41E3A;
            border-radius: 4px;
            border: 2px solid #F9F6F0;
          }
        `}</style>
      </View>
    );
  }
  
  // En dispositivos móviles, usamos ScrollView normal
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={showScrollIndicator}
      showsHorizontalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getBackgroundColor('default'),
  },
  content: {
    padding: getSpacing('md'),
    paddingBottom: getSpacing('xxl'),
  },
  webContainer: {
    flex: 1,
    backgroundColor: getBackgroundColor('default'),
    height: '100vh',
    overflow: 'auto',
  },
  webContent: {
    padding: getSpacing('md'),
    paddingBottom: getSpacing('xxl'),
    minHeight: '100%',
  }
});

export default ScrollableView;