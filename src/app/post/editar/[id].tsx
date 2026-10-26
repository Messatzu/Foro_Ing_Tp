import { useLocalSearchParams } from 'expo-router';
import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { FormularioPost } from '@/components/formulario-post';
import { usePosts } from '@/context/posts-context';
import { usePost } from '@/hooks/use-post';
import { leerId, volver } from '@/utils/navegacion';

export default function EditarPost() {
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = leerId(parametro);
  const { usuarios, cargandoUsuarios, errorUsuarios, cargarUsuarios, editar } = usePosts();
  const { post, cargando, error, reintentar } = usePost(id);
  if (cargando || cargandoUsuarios) return <EstadoCarga mensaje="Cargando publicación…" />;
  if (error || errorUsuarios || !post) return <EstadoError mensaje={error ?? errorUsuarios ?? 'No encontramos la publicación.'}
    onRetry={() => { reintentar(); if (errorUsuarios) void cargarUsuarios(); }} />;
  return <FormularioPost key={post.id} usuarios={usuarios} inicial={post} modo="editar" onGuardar={async datos => {
    await editar(post.id, datos);
    volver();
  }} />;
}
