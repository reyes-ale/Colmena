import { supabase } from "./supabase";
import type { Conversacion, Mensaje } from "./types";

interface ConversacionBase {
  id: number;
  cliente_id: number;
  creativo_id: number;
}

/** Trae la conversación entre ese cliente y ese creativo, o la crea si es
 * la primera vez que se escriben (vía RPC — ver
 * supabase/schema_18_mensajes.sql). Esto es lo que llama el botón
 * "Contactar". */
export async function obtenerOCrearConversacion(clienteId: number, creativoId: number) {
  const { data, error } = await supabase.rpc("obtener_o_crear_conversacion", {
    p_cliente_id: clienteId,
    p_creativo_id: creativoId,
  });
  if (error) return { conversacion: null, error };

  const conversacion = (Array.isArray(data) ? data[0] : data) as ConversacionBase | undefined;
  return { conversacion: conversacion ?? null, error: null };
}

/** Lista las conversaciones de un usuario (como cliente o como creativo). */
export async function listarConversaciones(usuarioId: number): Promise<Conversacion[]> {
  const { data, error } = await supabase.rpc("listar_conversaciones", { p_usuario_id: usuarioId });
  if (error) {
    console.error("Error listando conversaciones:", error.message);
    return [];
  }
  return (data ?? []) as Conversacion[];
}

/** Lista los mensajes de una conversación (el RPC valida que el usuario
 * sea parte de ella). */
export async function listarMensajes(conversacionId: number, usuarioId: number): Promise<Mensaje[]> {
  const { data, error } = await supabase.rpc("listar_mensajes", {
    p_conversacion_id: conversacionId,
    p_usuario_id: usuarioId,
  });
  if (error) {
    console.error("Error listando mensajes:", error.message);
    return [];
  }
  return (data ?? []) as Mensaje[];
}

export async function enviarMensaje(conversacionId: number, autorId: number, texto: string) {
  const { data, error } = await supabase.rpc("enviar_mensaje", {
    p_conversacion_id: conversacionId,
    p_autor_id: autorId,
    p_texto: texto,
  });
  if (error) return { mensaje: null, error };

  const mensaje = (Array.isArray(data) ? data[0] : data) as Mensaje | undefined;
  return { mensaje: mensaje ?? null, error: null };
}

/** Marca como leídos los mensajes de la otra persona — se llama al abrir
 * una conversación. */
export async function marcarConversacionLeida(conversacionId: number, usuarioId: number) {
  const { error } = await supabase.rpc("marcar_conversacion_leida", {
    p_conversacion_id: conversacionId,
    p_usuario_id: usuarioId,
  });
  return { error };
}
