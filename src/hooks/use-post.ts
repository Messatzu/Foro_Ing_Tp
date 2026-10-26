import { useEffect, useState } from 'react';
import { usePosts } from '@/context/posts-context';
import { listarComentarios } from '@/services/comentarios';
import { obtenerPost } from '@/services/posts';
import type { Comentario } from '@/types/comentario';
import type { Post } from '@/types/post';
import { mensajeError } from '@/utils/errores';

export function usePost(id: number | null, conComentarios = false) {
  const { estado } = usePosts();
  const [resultado, setResultado] = useState<{
    clave: string; post: Post | null; comentarios: Comentario[]; error: string | null;
  } | null>(null);
  const [intento, setIntento] = useState(0);
  const esLocal = id !== null && estado.creados.includes(id);
  const eliminado = id !== null && estado.eliminados.includes(id);
  const clave = `${id}:${conComentarios}:${intento}`;

  useEffect(() => {
    let activo = true;
    if (id === null || eliminado || esLocal) return;
    Promise.all([obtenerPost(id), conComentarios ? listarComentarios(id) : Promise.resolve([])])
      .then(([post, comentarios]) => {
        if (activo) setResultado({ clave, post, comentarios, error: null });
      })
      .catch(causa => {
        if (activo) setResultado({ clave, post: null, comentarios: [], error: mensajeError(causa) });
      });
    return () => { activo = false; };
  }, [id, esLocal, eliminado, conComentarios, clave]);

  // Una respuesta de otra ruta o de un intento anterior nunca se muestra.
  const actual = resultado?.clave === clave ? resultado : null;
  const modificado = id !== null && (esLocal || estado.editados.includes(id));
  const post = eliminado ? undefined : modificado
    ? estado.posts.find(p => p.id === id)
    : actual?.post ?? undefined;
  const errorVisible = id === null ? 'El identificador de la publicación no es válido.'
    : eliminado ? 'Esta publicación ya se eliminó.' : actual?.error ?? null;

  return { post, comentarios: esLocal ? [] : actual?.comentarios ?? [],
    cargando: !esLocal && !actual && !errorVisible,
    error: errorVisible, reintentar: () => setIntento(valor => valor + 1) };
}
