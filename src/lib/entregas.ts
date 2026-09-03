import { supabase } from "./supabase";
import type { Entrega, EntregaConDetalle } from "./types";

export interface CrearEntregaInput {
  proyectoId: number;
  creativoId: number;
  descripcion: string;
  archivoUrl: string | null;
}

/** Sube una entrega para un proyecto asignado (vía RPC — ver
 * supabase/schema_10_entregas.sql). Pone el proyecto en estado "entregado". */
export async function crearEntrega({ proyectoId, creativoId, descripcion, archivoUrl }: CrearEntregaInput) {
  const { data, error } = await supabase.rpc("crear_entrega", {
    p_proyecto_id: proyectoId,
    p_creativo_id: creativoId,
    p_descripcion: descripcion,
    p_archivo_url: archivoUrl,
  });
  if (error) return { entrega: null, error };

  const entrega = (Array.isArray(data) ? data[0] : data) as Entrega | undefined;
  return { entrega: entrega ?? null, error: null };
}

/** Lista las entregas que le llegaron a un cliente, en todos sus proyectos. */
export async function listarEntregasDeCliente(clienteId: number): Promise<EntregaConDetalle[]> {
  const { data, error } = await supabase.rpc("listar_entregas_de_cliente", { p_cliente_id: clienteId });
  if (error) {
    console.error("Error listando entregas:", error.message);
    return [];
  }
  return (data ?? []) as EntregaConDetalle[];
}
