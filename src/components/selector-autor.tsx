import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';
import type { Usuario } from '@/types/usuario';
import { Avatar } from './avatar';

type Props = { usuarios: Usuario[]; valor: number; onChange: (id: number) => void; deshabilitado: boolean; error?: string };

export function SelectorAutor({ usuarios, valor, onChange, deshabilitado, error }: Props) {
  const [abierto, setAbierto] = useState(false);
  const seleccionado = usuarios.find(u => u.id === valor);
  return <View style={styles.campo}>
    <Text style={styles.etiqueta}>Autor</Text>
    <Pressable style={[styles.selector, error && styles.bordeError]} onPress={() => setAbierto(true)}
      disabled={deshabilitado} accessibilityRole="button" accessibilityLabel="Seleccionar autor"
      accessibilityState={{ expanded: abierto, disabled: deshabilitado }}>
      <Text style={seleccionado ? styles.valor : styles.placeholder}>{seleccionado?.name ?? 'Elegí un autor'}</Text>
      <Text style={styles.flecha}>⌄</Text>
    </Pressable>
    {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
    <Modal visible={abierto} transparent animationType="fade" onRequestClose={() => setAbierto(false)}>
      <View style={styles.fondoModal}>
        <Pressable style={styles.fondoTocable} onPress={() => setAbierto(false)} accessibilityLabel="Cerrar selector" />
        <View style={styles.modal} accessibilityViewIsModal>
          <View style={styles.cabecera}>
            <Text style={styles.titulo}>Seleccionar autor</Text>
            <Pressable onPress={() => setAbierto(false)} accessibilityRole="button" accessibilityLabel="Cerrar" style={styles.cerrar}>
              <Text style={styles.cruz}>×</Text>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            {usuarios.map(usuario => <Pressable key={usuario.id}
              style={[styles.opcion, usuario.id === valor && styles.seleccionada]}
              accessibilityRole="button" accessibilityLabel={usuario.name}
              onPress={() => { onChange(usuario.id); setAbierto(false); }}>
              <Avatar nombre={usuario.name} />
              <View style={styles.datos}>
                <Text style={styles.nombre}>{usuario.name}</Text>
                <Text style={styles.username}>@{usuario.username}</Text>
              </View>
              {usuario.id === valor ? <Text style={styles.marca}>✓</Text> : null}
            </Pressable>)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  campo: { gap: 8 },
  etiqueta: { color: colores.texto, fontSize: 15, fontWeight: '600' },
  selector: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colores.superficie, borderColor: colores.borde, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
  valor: { color: colores.texto, fontSize: 15, flex: 1 },
  placeholder: { color: colores.secundario, fontSize: 15, flex: 1 },
  flecha: { color: colores.secundario, fontSize: 24 },
  bordeError: { borderColor: colores.acento },
  error: { color: colores.texto, fontSize: 13 },
  fondoModal: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colores.fondo },
  fondoTocable: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  modal: { maxHeight: '75%', width: '100%', maxWidth: 560, alignSelf: 'center', borderRadius: 22,
    backgroundColor: colores.superficie, borderColor: colores.borde, borderWidth: 1, padding: 16 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  titulo: { color: colores.texto, fontSize: 20, fontWeight: '700' },
  cerrar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cruz: { color: colores.texto, fontSize: 28 },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14 },
  seleccionada: { backgroundColor: colores.primario },
  datos: { flex: 1, gap: 4 },
  nombre: { color: colores.texto, fontSize: 15, fontWeight: '600' },
  username: { color: colores.secundario, fontSize: 13 },
  marca: { color: colores.texto, fontSize: 20 },
});
