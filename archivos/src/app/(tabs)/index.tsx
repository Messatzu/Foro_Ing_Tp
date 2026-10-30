import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Boton } from '@/components/boton';
import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { TarjetaPost } from '@/components/tarjeta-post';
import { colores } from '@/constants/colores';
import { usePosts } from '@/context/posts-context';

export default function Feed() {
  const { estado, usuariosPorId, cargandoPosts, cargandoUsuarios, errorPosts, errorUsuarios,
    cargarPosts, cargarUsuarios } = usePosts();
  const [busqueda, setBusqueda] = useState('');
  if (cargandoPosts || cargandoUsuarios) return <EstadoCarga mensaje="Cargando publicaciones…" />;
  if (errorPosts || errorUsuarios) return <EstadoError mensaje={errorPosts ?? errorUsuarios!}
    onRetry={() => { if (errorPosts) void cargarPosts(); if (errorUsuarios) void cargarUsuarios(); }} />;

  const visibles = estado.posts.filter(post => post.title.toLowerCase().includes(busqueda.trim().toLowerCase()));
  return <SafeAreaView style={styles.pantalla} edges={['top']}>
    <View style={styles.contenido}>
      <View style={styles.cabecera}>
        <View style={styles.marca}>
          <View style={styles.punto} />
          <Text style={styles.instituto}>IES SANTA FE</Text>
        </View>
        <Text style={styles.titulo}>Foro de la comunidad</Text>
        <Text style={styles.subtitulo}>Un espacio para compartir y conversar.</Text>
        <View style={styles.buscador}>
          <Ionicons name="search-outline" color={colores.secundario} size={20} />
          <TextInput value={busqueda} onChangeText={setBusqueda} style={styles.input}
            placeholder="Buscar por título" placeholderTextColor={colores.secundario}
            accessibilityLabel="Buscar por título" autoCapitalize="none" />
        </View>
        <Boton titulo="+ Nueva publicación" onPress={() => router.push('/post/nuevo')} />
      </View>
      <FlatList data={visibles} keyExtractor={post => String(post.id)} contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <TarjetaPost post={item} autor={usuariosPorId[item.userId]?.name ?? 'Autor desconocido'}
          onPress={() => router.push({ pathname: '/post/[id]', params: { id: String(item.id) } })} />}
        ListEmptyComponent={<Text style={styles.vacio}>{busqueda.trim() ? 'No hay publicaciones con ese título.' : 'Todavía no hay publicaciones.'}</Text>} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  cabecera: { padding: 24, gap: 16 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  punto: { width: 7, height: 7, borderRadius: 4, backgroundColor: colores.acento },
  instituto: { color: colores.secundario, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  titulo: { color: colores.texto, fontSize: 33, lineHeight: 38, fontWeight: '800', letterSpacing: -1 },
  subtitulo: { color: colores.secundario, fontSize: 14, lineHeight: 21, marginTop: -6 },
  buscador: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colores.superficie,
    borderColor: colores.borde, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, minHeight: 52 },
  input: { flex: 1, color: colores.texto, fontSize: 14, paddingVertical: 14 },
  lista: { paddingHorizontal: 24, paddingBottom: 24 },
  vacio: { color: colores.secundario, fontSize: 15, textAlign: 'center', paddingVertical: 32 },
});
