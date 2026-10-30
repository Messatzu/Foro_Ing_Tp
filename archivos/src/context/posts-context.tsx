import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { actualizarPost, crearPost, eliminarPost, listarPosts } from '@/services/posts';
import { listarUsuarios } from '@/services/usuarios';
import type { DatosPost, Post } from '@/types/post';
import type { Usuario } from '@/types/usuario';
import { mensajeError } from '@/utils/errores';
import { crearIdLocal, estadoInicial, postsReducer, type EstadoPosts } from './posts-state';

type PostsContexto = {
  estado: EstadoPosts;
  usuarios: Usuario[];
  usuariosPorId: Record<number, Usuario>;
  cargandoPosts: boolean;
  errorPosts: string | null;
  cargandoUsuarios: boolean;
  errorUsuarios: string | null;
  cargarPosts: () => Promise<void>;
  cargarUsuarios: () => Promise<void>;
  crear: (datos: DatosPost) => Promise<Post>;
  editar: (id: number, datos: DatosPost) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  aviso: string | null;
  cerrarAviso: () => void;
};

const PostsContext = createContext<PostsContexto | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(postsReducer, estadoInicial);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargandoPosts, setCargandoPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const pedidoPosts = useRef<Promise<void> | null>(null);
  const pedidoUsuarios = useRef<Promise<void> | null>(null);
  const usuariosCargados = useRef(false);

  const cargarPosts = useCallback((): Promise<void> => {
    if (pedidoPosts.current) return pedidoPosts.current;
    setCargandoPosts(true);
    setErrorPosts(null);
    const pedido = listarPosts()
      .then(posts => dispatch({ tipo: 'cargar', posts }))
      .catch(error => setErrorPosts(mensajeError(error)))
      .finally(() => { setCargandoPosts(false); pedidoPosts.current = null; });
    pedidoPosts.current = pedido;
    return pedido;
  }, []);

  const cargarUsuarios = useCallback((): Promise<void> => {
    if (pedidoUsuarios.current) return pedidoUsuarios.current;
    if (usuariosCargados.current) return Promise.resolve();
    setCargandoUsuarios(true);
    setErrorUsuarios(null);
    const pedido = listarUsuarios()
      .then(lista => { setUsuarios(lista); usuariosCargados.current = true; })
      .catch(error => setErrorUsuarios(mensajeError(error)))
      .finally(() => { setCargandoUsuarios(false); pedidoUsuarios.current = null; });
    pedidoUsuarios.current = pedido;
    return pedido;
  }, []);

  useEffect(() => { void cargarPosts(); void cargarUsuarios(); }, [cargarPosts, cargarUsuarios]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 5000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  // Un solo GET /users. Las tarjetas resuelven sus autores con este mapa.
  const usuariosPorId = useMemo(() => Object.fromEntries(usuarios.map(u => [u.id, u])), [usuarios]);

  async function crear(datos: DatosPost): Promise<Post> {
    const respuesta = await crearPost(datos);
    const post = { ...respuesta, id: crearIdLocal() }; // Nunca usar el 101 del POST como key.
    dispatch({ tipo: 'crear', post });
    setAviso('Publicación creada.');
    return post;
  }

  async function editar(id: number, datos: DatosPost): Promise<void> {
    const post = estado.creados.includes(id)
      ? { ...datos, id }
      : { ...(await actualizarPost(id, datos)), id };
    dispatch({ tipo: 'editar', post });
    setAviso('Cambios guardados.');
  }

  async function eliminar(id: number): Promise<void> {
    if (!estado.creados.includes(id)) await eliminarPost(id);
    dispatch({ tipo: 'eliminar', id });
    setAviso('Publicación eliminada.');
  }

  return (
    <PostsContext.Provider value={{ estado, usuarios, usuariosPorId, cargandoPosts, errorPosts,
      cargandoUsuarios, errorUsuarios, cargarPosts, cargarUsuarios, crear, editar, eliminar,
      aviso, cerrarAviso: () => setAviso(null) }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts(): PostsContexto {
  const contexto = useContext(PostsContext);
  if (!contexto) throw new Error('usePosts debe usarse dentro de PostsProvider.');
  return contexto;
}
