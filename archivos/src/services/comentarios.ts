import type { Comentario } from '../types/comentario';
import { solicitar } from './http';

export function listarComentarios(postId: number): Promise<Comentario[]> {
  return solicitar<Comentario[]>(`/posts/${postId}/comments`);
}
