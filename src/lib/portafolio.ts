import { supabase } from "./supabase";
import type { TrabajoPortafolio } from "./types";

export interface CrearTrabajoInput {
  creativoId: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  categorias: string[];
  herramientas: string;
  link: string;
  fechaProyecto: string; // yyyy-mm-dd
}

/** Agrega un proyecto al portafolio (vía RPC — ver
 * supabase/schema_15_portafolio.sql). */
export async function crearTrabajoPortafolio({
  creativoId,
  titulo,
  descripcion,
  imagenUrl,
  categorias,
  herramientas,
  link,
  fechaProyecto,
}: CrearTrabajoInput) {
  const { data, error } = await supabase.rpc("crear_trabajo_portafolio", {
    p_creativo_id: creativoId,
    p_titulo: titulo,
    p_descripcion: descripcion || null,
    p_imagen_url: imagenUrl,
    p_categorias: categorias,
    p_herramientas: herramientas || null,
    p_link: link || null,
    p_fecha_proyecto: fechaProyecto || null,
  });
  if (error) return { trabajo: null, error };

  const trabajo = (Array.isArray(data) ? data[0] : data) as TrabajoPortafolio | undefined;
  return { trabajo: trabajo ?? null, error: null };
}

/** Lista el portafolio de un creativo (lectura directa — la tabla tiene
 * política de lectura pública). */
export async function listarPortafolioDeCreativo(creativoId: number): Promise<TrabajoPortafolio[]> {
  const { data, error } = await supabase
    .from("trabajos_creativo")
    .select("*")
    .eq("creativo_id", creativoId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error listando portafolio:", error.message);
    return [];
  }
  return (data ?? []) as TrabajoPortafolio[];
}

/** Quita un proyecto del portafolio (solo su dueño puede). */
export async function eliminarTrabajoPortafolio(id: number, creativoId: number) {
  const { error } = await supabase.rpc("eliminar_trabajo_portafolio", { p_id: id, p_creativo_id: creativoId });
  return { error };
}

export interface PerfilPublico {
  id: number;
  nombre: string;
  foto_url: string | null;
}

/** Perfil mínimo (nombre + foto) de cualquier usuario por su id — para
 * mostrar de quién es un portafolio sin exponer correo ni contraseña. */
export async function obtenerPerfilPublico(usuarioId: number): Promise<PerfilPublico | null> {
  const { data, error } = await supabase.rpc("obtener_perfil_publico", { p_usuario_id: usuarioId });
  if (error) {
    console.error("Error obteniendo perfil:", error.message);
    return null;
  }
  const perfil = Array.isArray(data) ? data[0] : data;
  return (perfil ?? null) as PerfilPublico | null;
}
