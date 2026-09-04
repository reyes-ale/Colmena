import { supabase } from "./supabase";
import type { Notificacion } from "./types";

/** Últimas notificaciones de un usuario (vía RPC — ver
 * supabase/schema_19_notificaciones.sql). Se crean solas desde
 * seleccionar_creativo, enviar_propuesta y solicitar_cambios. */
export async function listarNotificaciones(usuarioId: number): Promise<Notificacion[]> {
  const { data, error } = await supabase.rpc("listar_notificaciones", { p_usuario_id: usuarioId });
  if (error) {
    console.error("Error listando notificaciones:", error.message);
    return [];
  }
  return (data ?? []) as Notificacion[];
}

/** Marca todas las notificaciones no leídas de un usuario como leídas —
 * se llama al abrir la campanita. */
export async function marcarNotificacionesLeidas(usuarioId: number) {
  const { error } = await supabase.rpc("marcar_notificaciones_leidas", { p_usuario_id: usuarioId });
  return { error };
}
