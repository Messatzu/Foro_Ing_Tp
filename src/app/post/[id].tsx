import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/avatar';
import { Boton } from '@/components/boton';
import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { colores } from '@/constants/colores';
import { usePosts } from '@/context/posts-context';
import { usePost } from '@/hooks/use-post';
import { mensajeError } from '@/utils/errores';
import { leerId, volver } from '@/utils/navegacion';

export default function DetallePost() {
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = leerId(parametro);
  const { usuariosPorId, cargandoUsuarios, errorUsuarios, cargarUsuarios, eliminar } = usePosts();
  const { post, comentarios, cargando, error, reintentar } = usePost(id, true);
  const [eliminando, setEliminando] = useState(false);
  const [errorBaja, setErrorBaja] = useState<string | null>(null);

  async function borrar() {
    if (id === null || eliminando) return;
    setEliminando(true);
    setErrorBaja(null);
    try { await eliminar(id); volver(); }
    catch (causa) { setErrorBaja(mensajeError(causa)); }
    finally { setEliminando(false); }
  }

  function confirmarBaja() {
    if (eliminando) return;
    const titulo = 'Eliminar publicación';
    const mensaje = '¿Querés eliminar esta publicación? Esta acción no se puede deshacer.';
    // Alert.alert es la confirmación nativa requerida; el navegador usa su equivalente.
    if (Platform.OS === 'web') {
      if (window.confirm(`${titulo}\n\n${mensaje}`)) void borrar();
    } else {
      Alert.alert(titulo, mensaje, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { void borrar(); } },
      ]);
    }
  }

  if (cargando || cargandoUsuarios) return <EstadoCarga mensaje="Cargando publicación y comentarios…" />;
  if (error || errorUsuarios || !post) return <EstadoError mensaje={error ?? errorUsuarios ?? 'No encontramos la publicación.'}
    onRetry={() => { reintentar(); if (errorUsuarios) void cargarUsuarios(); }} />;
  const autor = usuariosPorId[post.userId];

  return <FlatList style={styles.pantalla} contentContainerStyle={styles.contenido}
    data={comentarios} keyExtractor={comentario => String(comentario.id)}
    ListHeaderComponent={<View style={styles.cabecera}>
      <Pressable style={styles.autor} accessibilityRole="button" accessibilityLabel={`Ver perfil de ${autor?.name ?? 'autor'}`}
        onPress={() => router.push({ pathname: '/usuario/[id]', params: { id: String(post.userId) } })}>
        <Avatar nombre={autor?.name ?? '?'} />
        <View style={styles.autorDatos}>
          <Text style={styles.nombre}>{autor?.name ?? 'Autor desconocido'}</Text>
          <Text style={styles.verPerfil}>Ver perfil ›</Text>
        </View>
      </Pressable>
      <Text style={styles.titulo}>{post.title}</Text>
      <Text style={styles.cuerpo}>{post.body}</Text>
      <View style={styles.acciones}>
        <View style={styles.accion}><Boton titulo="Editar" variante="secundario" deshabilitado={eliminando}
          onPress={() => router.push({ pathname: '/post/editar/[id]', params: { id: String(post.id) } })} /></View>
        <View style={styles.accion}><Boton titulo="Eliminar" ocupado={eliminando} onPress={confirmarBaja} /></View>
      </View>
      {errorBaja ? <EstadoError compacto mensaje={errorBaja} onRetry={confirmarBaja} /> : null}
      <Text style={styles.seccion}>Comentarios ({comentarios.length})</Text>
    </View>}
    ListEmptyComponent={<Text style={styles.vacio}>Todavía no hay comentarios.</Text>}
    renderItem={({ item }) => <View style={styles.comentario}>
      <Text style={styles.comentarioNombre}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.comentarioCuerpo}>{item.body}</Text>
    </View>} />;
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 24, paddingBottom: 48, width: '100%', maxWidth: 640, alignSelf: 'center' },
  cabecera: { gap: 24 },
  autor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  autorDatos: { flex: 1, gap: 5 },
  nombre: { color: colores.texto, fontSize: 14, fontWeight: '600' },
  verPerfil: { color: colores.secundario, fontSize: 12 },
  titulo: { color: colores.texto, fontSize: 27, lineHeight: 35, fontWeight: '800', letterSpacing: -0.5 },
  cuerpo: { color: colores.secundario, fontSize: 16, lineHeight: 27 },
  acciones: { flexDirection: 'row', gap: 12 },
  accion: { flex: 1 },
  seccion: { color: colores.texto, fontSize: 21, fontWeight: '700', paddingTop: 12, paddingBottom: 18,
    borderTopWidth: 1, borderTopColor: colores.borde },
  comentario: { padding: 18, backgroundColor: colores.superficie, borderRadius: 16, borderWidth: 1,
    borderColor: colores.borde, marginBottom: 12, gap: 9 },
  comentarioNombre: { color: colores.texto, fontSize: 14, lineHeight: 21, fontWeight: '700' },
  email: { color: colores.secundario, fontSize: 12 },
  comentarioCuerpo: { color: colores.secundario, fontSize: 14, lineHeight: 23 },
  vacio: { color: colores.secundario, fontSize: 14, paddingVertical: 10 },
});
