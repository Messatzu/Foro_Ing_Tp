import type { Post } from '../types/post';

export type EstadoPosts = {
  posts: Post[];
  creados: number[];
  editados: number[];
  eliminados: number[];
};

export type AccionPosts =
  | { tipo: 'cargar'; posts: Post[] }
  | { tipo: 'crear'; post: Post }
  | { tipo: 'editar'; post: Post }
  | { tipo: 'eliminar'; id: number };

export const estadoInicial: EstadoPosts = { posts: [], creados: [], editados: [], eliminados: [] };

let ultimoId = 0;
export function crearIdLocal(): number {
  // También es único si se crean dos publicaciones en el mismo milisegundo.
  ultimoId = Math.max(Date.now(), ultimoId + 1);
  return ultimoId;
}

// Superpone las escrituras de la sesión a cualquier respuesta del servidor.
// Se usa tanto al cargar el feed como al combinar el perfil con sus posts.
export function aplicarCambios(remotos: Post[], estado: EstadoPosts): Post[] {
  const resultado = new Map(remotos.map(post => [post.id, post]));
  for (const post of estado.posts) {
    if (estado.creados.includes(post.id) || estado.editados.includes(post.id)) {
      resultado.set(post.id, post);
    }
  }
  for (const id of estado.eliminados) resultado.delete(id);
  const nuevos = estado.posts.filter(post => estado.creados.includes(post.id) && resultado.has(post.id));
  return [...nuevos, ...Array.from(resultado.values()).filter(post => !estado.creados.includes(post.id))];
}

export function postsReducer(estado: EstadoPosts, accion: AccionPosts): EstadoPosts {
  switch (accion.tipo) {
    case 'cargar':
      return { ...estado, posts: aplicarCambios(accion.posts, estado) };
    case 'crear':
      return {
        ...estado,
        posts: [accion.post, ...estado.posts],
        creados: [accion.post.id, ...estado.creados],
      };
    case 'editar':
      return {
        ...estado,
        posts: [accion.post, ...estado.posts.filter(post => post.id !== accion.post.id)],
        editados: [...new Set([...estado.editados, accion.post.id])],
      };
    case 'eliminar':
      return {
        ...estado,
        posts: estado.posts.filter(post => post.id !== accion.id),
        eliminados: [...new Set([...estado.eliminados, accion.id])],
      };
  }
}
