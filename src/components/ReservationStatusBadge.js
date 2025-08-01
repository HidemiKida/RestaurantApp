import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReservationStatusBadge = ({ status }) => {
  let backgroundColor, textColor, label;
  
  switch (status) {
    case 0:
      backgroundColor = '#FFC107';
      textColor = '#333';
      label = 'Pendiente';
      break;
    case 1:
      backgroundColor = '#4CAF50';
      textColor = '#FFF';
      label = 'Confirmada';
      break;
    case 2:
      backgroundColor = '#F44336';
      textColor = '#FFF';
      label = 'Cancelada';
      break;
    case 3:
      backgroundColor = '#9E9E9E';
      textColor = '#FFF';
      label = 'Completada';
      break;
    default:
      backgroundColor = '#E0E0E0';
      textColor = '#666';
      label = 'Desconocido';
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default ReservationStatusBadge;