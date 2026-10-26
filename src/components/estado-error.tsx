import { StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';
import { Boton } from './boton';

type Props = { mensaje: string; onRetry: () => void; compacto?: boolean };

export function EstadoError({ mensaje, onRetry, compacto = false }: Props) {
  return <View style={[styles.contenedor, compacto ? styles.compacto : styles.pantalla]} accessibilityLiveRegion="polite">
    <Text style={styles.titulo}>No pudimos completar la acción</Text>
    <Text style={styles.mensaje}>{mensaje}</Text>
    <Boton titulo="Reintentar" onPress={onRetry} />
  </View>;
}

const styles = StyleSheet.create({
  contenedor: { justifyContent: 'center', alignItems: 'stretch', padding: 24, gap: 16,
    backgroundColor: colores.fondo },
  pantalla: { flex: 1 },
  compacto: { flexGrow: 0, flexShrink: 0, borderWidth: 1, borderColor: colores.acento, borderRadius: 14, padding: 18 },
  titulo: { color: colores.texto, fontSize: 19, fontWeight: '700' },
  mensaje: { color: colores.secundario, fontSize: 15, lineHeight: 23 },
});
