import { supabase } from "./supabase";
import type { EstadisticasCreativo, Resena } from "./types";

export interface CrearResenaInput {
  proyectoId: number;
  clienteId: number;
  creativoId: number;
  calificacion: number;
  comentario: string;
}

/** El cliente deja su valoración de un proyecto completado (vía RPC —
 * ver supabase/schema_14_resenas.sql). */
export async function crearResena({ proyectoId, clienteId, creativoId, calificacion, comentario }: CrearResenaInput) {
  const { data, error } = await supabase.rpc("crear_resena", {
    p_proyecto_id: proyectoId,
    p_cliente_id: clienteId,
    p_creativo_id: creativoId,
    p_calificacion: calificacion,
    p_comentario: comentario || null,
  });
  if (error) return { resena: null, error };

  const resena = (Array.isArray(data) ? data[0] : data) as Resena | undefined;
  return { resena: resena ?? null, error: null };
}

/** Si el proyecto ya tiene una reseña, la devuelve — así el cliente no ve
 * el pop-up de valoración dos veces. */
export async function obtenerResenaDeProyecto(proyectoId: number): Promise<Resena | null> {
  const { data, error } = await supabase.rpc("obtener_resena_de_proyecto", { p_proyecto_id: proyectoId });
  if (error) {
    console.error("Error obteniendo reseña:", error.message);
    return null;
  }
  const resena = Array.isArray(data) ? data[0] : data;
  return (resena ?? null) as Resena | null;
}

export interface ProyectoPendienteResena {
  id: number;
  titulo: string;
  creativo_id: number;
  creativo_nombre: string;
  creativo_foto_url: string | null;
}

/** Proyectos completados del cliente que todavía no tienen reseña — para
 * mostrarle el pop-up de valoración apenas inicia sesión, sin que tenga
 * que entrar a ver ese proyecto específico. */
export async function listarProyectosPendientesResena(clienteId: number): Promise<ProyectoPendienteResena[]> {
  const { data, error } = await supabase.rpc("listar_proyectos_pendientes_resena", { p_cliente_id: clienteId });
  if (error) {
    console.error("Error listando proyectos pendientes de reseña:", error.message);
    return [];
  }
  return (data ?? []) as ProyectoPendienteResena[];
}

/** Trabajos completados, ganancias y calificación promedio reales de un
 * creativo — para las tarjetas de estadísticas de su dashboard. */
export async function obtenerEstadisticasCreativo(creativoId: number): Promise<EstadisticasCreativo | null> {
  const { data, error } = await supabase.rpc("obtener_estadisticas_creativo", { p_creativo_id: creativoId });
  if (error) {
    console.error("Error obteniendo estadísticas:", error.message);
    return null;
  }
  const stats = Array.isArray(data) ? data[0] : data;
  return (stats ?? null) as EstadisticasCreativo | null;
}
