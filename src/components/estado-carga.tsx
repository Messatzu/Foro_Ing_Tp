import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';

export function EstadoCarga({ mensaje = 'Cargando…' }: { mensaje?: string }) {
  return <View style={styles.contenedor} accessibilityLiveRegion="polite">
    <ActivityIndicator size="large" color={colores.acento} />
    <Text style={styles.texto}>{mensaje}</Text>
  </View>;
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 16,
    backgroundColor: colores.fondo, padding: 24 },
  texto: { color: colores.secundario, fontSize: 15 },
});
