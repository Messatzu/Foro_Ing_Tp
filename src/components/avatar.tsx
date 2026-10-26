import { StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';

export function Avatar({ nombre, grande = false }: { nombre: string; grande?: boolean }) {
  const iniciales = nombre.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('').toUpperCase();
  return <View style={[styles.avatar, grande && styles.grande]}>
    <Text style={[styles.iniciales, grande && styles.inicialesGrandes]}>{iniciales}</Text>
  </View>;
}

const styles = StyleSheet.create({
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: colores.resaltado,
    justifyContent: 'center', alignItems: 'center' },
  grande: { width: 68, height: 68, borderRadius: 23, backgroundColor: colores.primario },
  iniciales: { color: colores.texto, fontWeight: '700', fontSize: 13 },
  inicialesGrandes: { fontSize: 23 },
});
