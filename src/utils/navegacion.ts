import { router } from 'expo-router';

export function leerId(valor: string | string[] | undefined): number | null {
  if (typeof valor !== 'string' || !/^\d+$/.test(valor)) return null;
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function volver(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
