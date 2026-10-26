import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/avatar';
import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { colores } from '@/constants/colores';
import { usePosts } from '@/context/posts-context';

export default function Usuarios() {
  const { usuarios, cargandoUsuarios, errorUsuarios, cargarUsuarios } = usePosts();
  if (cargandoUsuarios) return <EstadoCarga mensaje="Cargando usuarios…" />;
  if (errorUsuarios) return <EstadoError mensaje={errorUsuarios} onRetry={() => { void cargarUsuarios(); }} />;
  return <SafeAreaView style={styles.pantalla} edges={['top']}>
    <FlatList data={usuarios} keyExtractor={usuario => String(usuario.id)} contentContainerStyle={styles.lista}
      ListHeaderComponent={<View style={styles.cabecera}>
        <Text style={styles.antetitulo}>LA COMUNIDAD</Text>
        <Text style={styles.titulo}>Usuarios</Text>
        <Text style={styles.subtitulo}>Conocé a quienes comparten sus ideas.</Text>
      </View>}
      ListEmptyComponent={<Text style={styles.subtitulo}>No hay usuarios disponibles.</Text>}
      renderItem={({ item }) => <Pressable style={styles.tarjeta} accessibilityRole="button"
        accessibilityLabel={`Ver perfil de ${item.name}`}
        onPress={() => router.push({ pathname: '/usuario/[id]', params: { id: String(item.id) } })}>
        <Avatar nombre={item.name} />
        <View style={styles.datos}>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.empresa}>{item.company.name}</Text>
        </View>
        <Text style={styles.flecha}>›</Text>
      </Pressable>} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { padding: 24, width: '100%', maxWidth: 640, alignSelf: 'center' },
  cabecera: { gap: 10, marginBottom: 26 },
  antetitulo: { color: colores.secundario, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  titulo: { color: colores.texto, fontSize: 34, fontWeight: '800', letterSpacing: -0.8 },
  subtitulo: { color: colores.secundario, fontSize: 14, lineHeight: 22 },
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18,
    backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde, marginBottom: 12 },
  datos: { flex: 1, gap: 5 },
  nombre: { color: colores.texto, fontSize: 16, fontWeight: '700' },
  username: { color: colores.secundario, fontSize: 13 },
  empresa: { color: colores.secundario, fontSize: 12, lineHeight: 18 },
  flecha: { color: colores.secundario, fontSize: 25 },
});
