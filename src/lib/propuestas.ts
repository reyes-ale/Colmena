import { supabase } from "./supabase";
import type { Propuesta, PropuestaConDetalle } from "./types";

export interface EnviarPropuestaInput {
  proyectoId: number;
  creativoId: number;
  monto: number;
  entregable: string;
  mensaje: string;
  propuestasIniciales: number | null;
  rondasCambio: number | null;
  cvUrl: string | null;
}

/** Envía una propuesta nueva (vía RPC — ver supabase/schema_07_propuestas.sql). */
export async function enviarPropuesta(input: EnviarPropuestaInput) {
  const { data, error } = await supabase.rpc("enviar_propuesta", {
    p_proyecto_id: input.proyectoId,
    p_creativo_id: input.creativoId,
    p_monto: input.monto,
    p_entregable: input.entregable,
    p_mensaje: input.mensaje || null,
    p_propuestas_iniciales: input.propuestasIniciales,
    p_rondas_cambio: input.rondasCambio,
    p_cv_url: input.cvUrl,
  });
  if (error) return { propuesta: null, error };

  const propuesta = (Array.isArray(data) ? data[0] : data) as Propuesta | undefined;
  return { propuesta: propuesta ?? null, error: null };
}

/** Lista las propuestas recibidas por un cliente, en todos sus proyectos. */
export async function listarPropuestasDeCliente(clienteId: number): Promise<PropuestaConDetalle[]> {
  const { data, error } = await supabase.rpc("listar_propuestas_de_cliente", { p_cliente_id: clienteId });
  if (error) {
    console.error("Error listando propuestas:", error.message);
    return [];
  }
  return (data ?? []) as PropuestaConDetalle[];
}
