import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/avatar';
import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { TarjetaPost } from '@/components/tarjeta-post';
import { colores } from '@/constants/colores';
import { usePosts } from '@/context/posts-context';
import { aplicarCambios } from '@/context/posts-state';
import { listarPostsUsuario } from '@/services/posts';
import { obtenerUsuario } from '@/services/usuarios';
import type { Post } from '@/types/post';
import type { Usuario } from '@/types/usuario';
import { mensajeError } from '@/utils/errores';
import { leerId } from '@/utils/navegacion';

export default function PerfilUsuario() {
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = leerId(parametro);
  const { estado } = usePosts();
  const [resultado, setResultado] = useState<{
    clave: string; usuario: Usuario | null; posts: Post[]; error: string | null;
  } | null>(null);
  const [intento, setIntento] = useState(0);
  const clave = `${id}:${intento}`;

  useEffect(() => {
    let activo = true;
    if (id === null) return;
    Promise.all([obtenerUsuario(id), listarPostsUsuario(id)])
      .then(([usuario, posts]) => {
        if (activo) setResultado({ clave, usuario, posts, error: null });
      })
      .catch(causa => {
        if (activo) setResultado({ clave, usuario: null, posts: [], error: mensajeError(causa) });
      });
    return () => { activo = false; };
  }, [id, clave]);

  const actual = resultado?.clave === clave ? resultado : null;
  const usuario = actual?.usuario;
  const error = id === null ? 'El identificador del usuario no es válido.' : actual?.error;
  if (!actual && !error) return <EstadoCarga mensaje="Cargando perfil…" />;
  if (error || !usuario) return <EstadoError mensaje={error ?? 'No encontramos al usuario.'}
    onRetry={() => setIntento(valor => valor + 1)} />;
  const publicaciones = aplicarCambios(actual?.posts ?? [], estado).filter(post => post.userId === usuario.id);

  return <FlatList style={styles.pantalla} contentContainerStyle={styles.contenido}
    data={publicaciones} keyExtractor={post => String(post.id)}
    ListHeaderComponent={<View style={styles.cabecera}>
      <Avatar nombre={usuario.name} grande />
      <View style={styles.identidad}>
        <Text style={styles.nombre}>{usuario.name}</Text>
        <Text style={styles.username}>@{usuario.username}</Text>
      </View>
      <View style={styles.contacto}>
        <Dato etiqueta="EMAIL" valor={usuario.email} />
        <Dato etiqueta="TELÉFONO" valor={usuario.phone} />
        <Dato etiqueta="SITIO WEB" valor={usuario.website} />
        <Dato etiqueta="EMPRESA" valor={usuario.company.name} />
      </View>
      <Text style={styles.seccion}>Publicaciones</Text>
    </View>}
    ListEmptyComponent={<Text style={styles.vacio}>Este usuario todavía no tiene publicaciones.</Text>}
    renderItem={({ item }) => <TarjetaPost post={item} autor={usuario.name}
      onPress={() => router.push({ pathname: '/post/[id]', params: { id: String(item.id) } })} />} />;
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return <View style={styles.dato}>
    <Text style={styles.etiqueta}>{etiqueta}</Text>
    <Text style={styles.valor}>{valor}</Text>
  </View>;
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 24, paddingBottom: 48, width: '100%', maxWidth: 640, alignSelf: 'center' },
  cabecera: { gap: 22 },
  identidad: { gap: 7 },
  nombre: { color: colores.texto, fontSize: 28, lineHeight: 35, fontWeight: '800', letterSpacing: -0.6 },
  username: { color: colores.secundario, fontSize: 15 },
  contacto: { padding: 20, gap: 20, backgroundColor: colores.superficie, borderRadius: 20,
    borderWidth: 1, borderColor: colores.borde },
  dato: { gap: 6 },
  etiqueta: { color: colores.secundario, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  valor: { color: colores.texto, fontSize: 14, lineHeight: 21 },
  seccion: { color: colores.texto, fontSize: 22, fontWeight: '700', marginTop: 6, marginBottom: 18 },
  vacio: { color: colores.secundario, fontSize: 15, lineHeight: 23 },
});
