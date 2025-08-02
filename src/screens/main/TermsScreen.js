import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { asianTheme } from '../../styles/asianTheme';
import ResponsiveContainer from '../../components/common/ResponsiveContainer';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <ResponsiveContainer style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Términos de Servicio</Text>
          
          <Text style={styles.date}>Última actualización: 02 de agosto de 2023</Text>
          
          <Text style={styles.paragraph}>
            Bienvenido a Restaurant App. Al acceder o utilizar nuestra aplicación, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con estos términos, por favor no utilice nuestra aplicación.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Uso del Servicio</Text>
          <Text style={styles.paragraph}>
            Usted acepta utilizar este servicio únicamente para los fines permitidos por estos Términos y cualquier ley, regulación o prácticas o directrices generalmente aceptadas en las jurisdicciones relevantes.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Reservas y Cancelaciones</Text>
          <Text style={styles.paragraph}>
            Al realizar una reserva a través de nuestra aplicación, usted se compromete a asistir en la fecha y hora reservada. La política de cancelación puede variar según el restaurante, pero generalmente permitimos cancelaciones hasta 2 horas antes de la hora de reserva sin cargo.
          </Text>
          
          <Text style={styles.sectionTitle}>3. Cuenta de Usuario</Text>
          <Text style={styles.paragraph}>
            Para utilizar ciertas funciones de la aplicación, puede ser necesario registrarse y mantener una cuenta activa. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Limitación de Responsabilidad</Text>
          <Text style={styles.paragraph}>
            No somos responsables de los problemas o pérdidas técnicas de cualquier teléfono o red, conexiones de computadora en línea, servidores o proveedores, hardware de computadora, software, falla de cualquier correo electrónico debido a problemas técnicos o congestión de tráfico en Internet.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Cambios en los Términos</Text>
          <Text style={styles.paragraph}>
            Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento a nuestra sola discreción. Si una revisión es material, proporcionaremos al menos 30 días de aviso antes de que los nuevos términos entren en vigor.
          </Text>
          
          <Text style={styles.paragraph}>
            Al continuar accediendo o utilizando nuestro Servicio después de que esas revisiones entren en vigor, usted acepta estar sujeto a los términos revisados.
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
});

export default TermsScreen;