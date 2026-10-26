import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';
import { usePosts } from '@/context/posts-context';

export function Aviso() {
  const { aviso, cerrarAviso } = usePosts();
  if (!aviso) return null;
  return <View style={styles.aviso} accessibilityLiveRegion="polite" role="status">
    <Text style={styles.marca}>✓</Text>
    <Text style={styles.texto}>{aviso}</Text>
    <Pressable onPress={cerrarAviso} accessibilityRole="button" accessibilityLabel="Cerrar aviso" style={styles.cerrar}>
      <Text style={styles.cruz}>×</Text>
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  aviso: { position: 'absolute', bottom: 90, left: 20, right: 20, maxWidth: 600, alignSelf: 'center',
    backgroundColor: colores.exito, borderRadius: 16, borderWidth: 1, borderColor: colores.borde,
    flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 6, gap: 10, minHeight: 56 },
  marca: { color: colores.texto, fontSize: 20 },
  texto: { color: colores.texto, fontSize: 14, fontWeight: '600', flex: 1 },
  cerrar: { height: 44, width: 44, alignItems: 'center', justifyContent: 'center' },
  cruz: { color: colores.texto, fontSize: 25 },
});
