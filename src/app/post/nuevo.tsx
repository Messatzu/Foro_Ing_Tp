import { EstadoCarga } from '@/components/estado-carga';
import { EstadoError } from '@/components/estado-error';
import { FormularioPost } from '@/components/formulario-post';
import { usePosts } from '@/context/posts-context';
import { volver } from '@/utils/navegacion';

export default function NuevoPost() {
  const { usuarios, cargandoUsuarios, errorUsuarios, cargarUsuarios, crear } = usePosts();
  if (cargandoUsuarios) return <EstadoCarga mensaje="Cargando autores…" />;
  if (errorUsuarios) return <EstadoError mensaje={errorUsuarios} onRetry={() => { void cargarUsuarios(); }} />;
  return <FormularioPost usuarios={usuarios} modo="crear" onGuardar={async datos => {
    await crear(datos);
    volver();
  }} />;
}
