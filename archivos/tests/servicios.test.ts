import assert from 'node:assert/strict';
import test from 'node:test';
import { listarComentarios } from '../src/services/comentarios';
import { actualizarPost, crearPost, eliminarPost, listarPosts, listarPostsUsuario, obtenerPost } from '../src/services/posts';
import { listarUsuarios, obtenerUsuario } from '../src/services/usuarios';

test('las operaciones usan los endpoints, métodos y cuerpos requeridos', async () => {
  const fetchOriginal = globalThis.fetch;
  const pedidos: { url: string; metodo: string; cuerpo?: string }[] = [];
  globalThis.fetch = async (url, opciones) => {
    pedidos.push({ url: String(url), metodo: opciones?.method ?? 'GET', cuerpo: opciones?.body as string | undefined });
    return new Response(JSON.stringify({ id: 101, title: 'Título', body: 'Mensaje largo para prueba.', userId: 1 }), { status: 200 });
  };
  try {
    await listarPosts(); await obtenerPost(1); await listarPostsUsuario(2);
    await listarUsuarios(); await obtenerUsuario(2); await listarComentarios(1);
    const datos = { title: 'Título', body: 'Mensaje largo para prueba.', userId: 1 };
    await crearPost(datos); await actualizarPost(1, datos); await eliminarPost(1);
    assert.deepEqual(pedidos.map(p => [p.metodo, new URL(p.url).pathname]), [
      ['GET', '/posts'], ['GET', '/posts/1'], ['GET', '/users/2/posts'],
      ['GET', '/users'], ['GET', '/users/2'], ['GET', '/posts/1/comments'],
      ['POST', '/posts'], ['PUT', '/posts/1'], ['DELETE', '/posts/1'],
    ]);
    assert.deepEqual(JSON.parse(pedidos[6].cuerpo!), datos);
    assert.deepEqual(JSON.parse(pedidos[7].cuerpo!), { ...datos, id: 1 });
  } finally { globalThis.fetch = fetchOriginal; }
});

test('los HTTP no exitosos se rechazan también en las escrituras', async () => {
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = async () => new Response('{}', { status: 500 });
  try {
    await assert.rejects(listarPosts(), /HTTP 500/);
    await assert.rejects(crearPost({ title: 'Título', body: 'Mensaje largo para prueba.', userId: 1 }), /HTTP 500/);
    await assert.rejects(actualizarPost(1, { title: 'Título', body: 'Mensaje largo para prueba.', userId: 1 }), /HTTP 500/);
    await assert.rejects(eliminarPost(1), /HTTP 500/);
  } finally { globalThis.fetch = fetchOriginal; }
});

test('un fallo de red devuelve un mensaje entendible', async () => {
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  try { await assert.rejects(listarUsuarios(), /Revisá tu conexión/); }
  finally { globalThis.fetch = fetchOriginal; }
});
