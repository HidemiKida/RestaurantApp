import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';

const PrivacyScreen = () => {
  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Política de Privacidad</Text>
          
          <Text style={styles.date}>Última actualización: 02 de agosto de 2023</Text>
          
          <Text style={styles.paragraph}>
            Esta Política de Privacidad describe cómo Restaurant App recopila, usa y comparte su información personal cuando utiliza nuestra aplicación móvil.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Información que Recopilamos</Text>
          <Text style={styles.paragraph}>
            Recopilamos varios tipos de información, incluyendo:
          </Text>
          <Text style={styles.bulletPoint}>• Información personal: nombre, dirección de correo electrónico, número de teléfono.</Text>
          <Text style={styles.bulletPoint}>• Información de uso: datos sobre cómo interactúa con nuestra aplicación.</Text>
          <Text style={styles.bulletPoint}>• Información de reserva: fechas, horas, número de invitados, preferencias de comida.</Text>
          
          <Text style={styles.sectionTitle}>2. Cómo Usamos Su Información</Text>
          <Text style={styles.paragraph}>
            Utilizamos la información recopilada para:
          </Text>
          <Text style={styles.bulletPoint}>• Procesar y gestionar sus reservas.</Text>
          <Text style={styles.bulletPoint}>• Comunicarnos con usted sobre sus reservas y servicios.</Text>
          <Text style={styles.bulletPoint}>• Mejorar y personalizar nuestra aplicación y servicios.</Text>
          <Text style={styles.bulletPoint}>• Enviarle notificaciones sobre ofertas especiales y eventos (si lo ha consentido).</Text>
          
          <Text style={styles.sectionTitle}>3. Compartir su Información</Text>
          <Text style={styles.paragraph}>
            Podemos compartir su información personal con:
          </Text>
          <Text style={styles.bulletPoint}>• Restaurantes donde ha realizado una reserva.</Text>
          <Text style={styles.bulletPoint}>• Proveedores de servicios que nos ayudan con nuestra operación.</Text>
          <Text style={styles.bulletPoint}>• Autoridades legales cuando sea requerido por ley.</Text>
          
          <Text style={styles.sectionTitle}>4. Seguridad de Datos</Text>
          <Text style={styles.paragraph}>
            Implementamos medidas de seguridad para proteger su información personal. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Sus Derechos</Text>
          <Text style={styles.paragraph}>
            Dependiendo de su ubicación, puede tener ciertos derechos respecto a sus datos personales, como el derecho a acceder, rectificar, eliminar u objetar el procesamiento de su información.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Cambios a Esta Política</Text>
          <Text style={styles.paragraph}>
            Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha en la parte superior.
          </Text>
          
          <Text style={styles.paragraph}>
            Si continúa utilizando nuestra aplicación después de que se realicen cambios en esta Política de Privacidad, usted acepta las políticas revisadas.
          </Text>
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
    padding: asianTheme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: asianTheme.colors.primary.red,
    marginBottom: asianTheme.spacing.md,
  },
  date: {
    fontSize: 14,
    color: asianTheme.colors.grey.medium,
    fontStyle: 'italic',
    marginBottom: asianTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: asianTheme.colors.secondary.bamboo,
    marginTop: asianTheme.spacing.lg,
    marginBottom: asianTheme.spacing.sm,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: asianTheme.colors.text.dark,
    marginBottom: asianTheme.spacing.md,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: asianTheme.colors.text.dark,
    marginLeft: asianTheme.spacing.md,
    marginBottom: asianTheme.spacing.xs,
  },
});

export default PrivacyScreen;