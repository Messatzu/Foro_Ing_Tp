import type { DatosPost, Post } from '../types/post';
import { solicitar } from './http';

export function listarPosts(): Promise<Post[]> {
  return solicitar<Post[]>('/posts');
}

export function obtenerPost(id: number): Promise<Post> {
  return solicitar<Post>(`/posts/${id}`);
}

export function listarPostsUsuario(id: number): Promise<Post[]> {
  return solicitar<Post[]>(`/users/${id}/posts`);
}

export function crearPost(datos: DatosPost): Promise<Post> {
  return solicitar<Post>('/posts', { method: 'POST', body: JSON.stringify(datos) });
}

export function actualizarPost(id: number, datos: DatosPost): Promise<Post> {
  return solicitar<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...datos, id }),
  });
}

export async function eliminarPost(id: number): Promise<void> {
  await solicitar<Record<string, never>>(`/posts/${id}`, { method: 'DELETE' });
}
