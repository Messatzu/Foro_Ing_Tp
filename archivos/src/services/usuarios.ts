import type { Usuario } from '../types/usuario';
import { solicitar } from './http';

export function listarUsuarios(): Promise<Usuario[]> {
  return solicitar<Usuario[]>('/users');
}

export function obtenerUsuario(id: number): Promise<Usuario> {
  return solicitar<Usuario>(`/users/${id}`);
}
