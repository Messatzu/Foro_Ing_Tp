import type { DatosPost } from '../types/post';
import type { Usuario } from '../types/usuario';

export type ErroresPost = Partial<Record<keyof DatosPost, string>>;

export function validarPost(datos: DatosPost, usuarios: Usuario[]): ErroresPost {
  const errores: ErroresPost = {};
  if (!datos.title.trim()) errores.title = 'El título es obligatorio.';
  else if (datos.title.trim().length < 5) errores.title = 'Escribí al menos 5 caracteres.';
  if (!datos.body.trim()) errores.body = 'El cuerpo es obligatorio.';
  else if (datos.body.trim().length < 20) errores.body = 'Escribí al menos 20 caracteres.';
  if (!Number.isSafeInteger(datos.userId) || datos.userId <= 0 || !usuarios.some(u => u.id === datos.userId)) {
    errores.userId = 'Seleccioná un autor de la lista.';
  }
  return errores;
}
