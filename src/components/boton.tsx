import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '@/constants/colores';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario';
  ocupado?: boolean;
  deshabilitado?: boolean;
};

export function Boton({ titulo, onPress, variante = 'principal', ocupado = false, deshabilitado = false }: Props) {
  const inactivo = ocupado || deshabilitado;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={titulo}
      accessibilityState={{ disabled: inactivo, busy: ocupado }} disabled={inactivo}
      onPress={onPress} style={[styles.boton, variante === 'secundario' && styles.secundario, inactivo && styles.inactivo]}>
      {ocupado ? <ActivityIndicator color={colores.texto} /> : <Text style={styles.texto}>{titulo}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: { minHeight: 50, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 13,
    backgroundColor: colores.primario, alignItems: 'center', justifyContent: 'center' },
  secundario: { backgroundColor: colores.resaltado, borderWidth: 1, borderColor: colores.borde },
  inactivo: { opacity: 0.55 },
  texto: { color: colores.texto, fontSize: 15, fontWeight: '700' },
});
