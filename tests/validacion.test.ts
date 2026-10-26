import assert from 'node:assert/strict';
import test from 'node:test';
import type { Usuario } from '../src/types/usuario';
import { validarPost } from '../src/validaciones/post';

const usuarios: Usuario[] = [{
  id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442', website: 'hildegard.org',
  address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: { lat: '-37.3159', lng: '81.1496' } },
  company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets' },
}];

test('valida los límites 4/5 del título y 19/20 del cuerpo', () => {
  const errores = validarPost({ title: 'a'.repeat(4), body: 'b'.repeat(19), userId: 1 }, usuarios);
  assert.ok(errores.title);
  assert.ok(errores.body);
  assert.deepEqual(validarPost({ title: 'a'.repeat(5), body: 'b'.repeat(20), userId: 1 }, usuarios), {});
});

test('los campos de espacios y el autor sin elegir no son válidos', () => {
  const errores = validarPost({ title: '     ', body: '                    ', userId: 0 }, usuarios);
  assert.ok(errores.title);
  assert.ok(errores.body);
  assert.ok(errores.userId);
});

test('rechaza autor negativo, decimal, NaN, texto o fuera de la lista', () => {
  for (const userId of [-1, 1.5, NaN, '1' as unknown as number, 999]) {
    assert.ok(validarPost({ title: 'Título válido', body: 'Un mensaje suficientemente largo.', userId }, usuarios).userId);
  }
});
