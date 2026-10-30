import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores } from '@/constants/colores';
import type { Post } from '@/types/post';
import { Avatar } from './avatar';

type Props = { post: Post; autor: string; onPress: () => void };

export function TarjetaPost({ post, autor, onPress }: Props) {
  return <Pressable style={styles.tarjeta} onPress={onPress} testID={`post-${post.id}`}
    accessibilityRole="button" accessibilityLabel={`Abrir publicación: ${post.title}`}>
    <View style={styles.fila}>
      <Avatar nombre={autor} />
      <Text style={styles.autor}>{autor}</Text>
      <Text style={styles.flecha} accessibilityElementsHidden>›</Text>
    </View>
    <Text style={styles.titulo}>{post.title}</Text>
    <Text style={styles.extracto} numberOfLines={2}>{post.body.replace(/\s+/g, ' ')}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  tarjeta: { padding: 20, gap: 14, borderRadius: 20, borderWidth: 1, borderColor: colores.borde,
    backgroundColor: colores.superficie, marginBottom: 14 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  autor: { color: colores.secundario, fontSize: 13, fontWeight: '600', flex: 1 },
  flecha: { fontSize: 26, color: colores.secundario },
  titulo: { color: colores.texto, fontSize: 18, lineHeight: 25, fontWeight: '700' },
  extracto: { color: colores.secundario, fontSize: 14, lineHeight: 22 },
});
