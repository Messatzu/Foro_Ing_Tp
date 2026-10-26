const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Único lugar que usa fetch: todas las operaciones comprueban res.ok aquí.
export async function solicitar<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
      headers: { 'Content-Type': 'application/json; charset=UTF-8', ...opciones?.headers },
    });
    if (!res.ok) {
      throw new Error(`No se pudo completar la solicitud (HTTP ${res.status}). Intentá nuevamente.`);
    }
    return (await res.json()) as T;
  } catch (error) {
    if (controlador.signal.aborted) {
      throw new Error('La conexión tardó demasiado. Revisá tu conexión e intentá nuevamente.');
    }
    if (error instanceof TypeError) {
      throw new Error('No pudimos conectar. Revisá tu conexión a internet e intentá nuevamente.');
    }
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}
