import assert from 'node:assert/strict';
import test from 'node:test';
import { aplicarCambios, crearIdLocal, estadoInicial, postsReducer } from '../src/context/posts-state';
import type { Post } from '../src/types/post';

const original: Post = { id: 1, userId: 1, title: 'Título original', body: 'Mensaje original con más de veinte caracteres.' };

test('dos altas en el mismo milisegundo tienen IDs diferentes y no usan 101', () => {
  const reloj = Date.now;
  Date.now = () => 1792960000000;
  try {
    const primero = crearIdLocal();
    const segundo = crearIdLocal();
    assert.notEqual(primero, segundo);
    assert.notEqual(primero, 101);
    assert.ok(segundo > primero);
  } finally { Date.now = reloj; }
});

test('una respuesta tardía del feed conserva altas, ediciones y bajas de la sesión', () => {
  const otro = { ...original, id: 2 };
  const local = { ...original, id: crearIdLocal(), title: 'Publicación local' };
  const editado = { ...original, title: 'Título modificado' };
  let estado = postsReducer(estadoInicial, { tipo: 'cargar', posts: [original, otro] });
  estado = postsReducer(estado, { tipo: 'crear', post: local });
  estado = postsReducer(estado, { tipo: 'editar', post: editado });
  estado = postsReducer(estado, { tipo: 'eliminar', id: otro.id });
  estado = postsReducer(estado, { tipo: 'cargar', posts: [original, otro] });
  assert.deepEqual(estado.posts, [local, editado]);
});

test('el perfil refleja cambio de autor y no recupera publicaciones eliminadas', () => {
  const editado = { ...original, userId: 2, title: 'Ahora tiene otro autor' };
  let estado = postsReducer(estadoInicial, { tipo: 'cargar', posts: [original] });
  estado = postsReducer(estado, { tipo: 'editar', post: editado });
  assert.equal(aplicarCambios([original], estado).filter(p => p.userId === 1).length, 0);
  assert.deepEqual(aplicarCambios([], estado).filter(p => p.userId === 2), [editado]);
  estado = postsReducer(estado, { tipo: 'eliminar', id: original.id });
  assert.deepEqual(aplicarCambios([original], estado), []);
});

test('se puede editar y borrar un alta local manteniendo su ID', () => {
  const local = { ...original, id: crearIdLocal() };
  let estado = postsReducer(estadoInicial, { tipo: 'crear', post: local });
  estado = postsReducer(estado, { tipo: 'editar', post: { ...local, title: 'Alta editada' } });
  assert.equal(estado.posts[0].id, local.id);
  assert.equal(estado.posts[0].title, 'Alta editada');
  estado = postsReducer(estado, { tipo: 'eliminar', id: local.id });
  assert.deepEqual(aplicarCambios([], estado), []);
});
