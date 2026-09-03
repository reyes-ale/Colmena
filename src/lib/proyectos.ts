import { supabase } from "./supabase";
import type { Proyecto, ProyectoAsignado, ProyectoDisponible } from "./types";

export interface CrearProyectoInput {
  clienteId: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string; // yyyy-mm-dd
  presupuesto: number;
}

/** Publica un proyecto nuevo (vía RPC — ver supabase/schema_02_proyectos.sql). */
export async function crearProyecto({ clienteId, titulo, descripcion, fechaEntrega, presupuesto }: CrearProyectoInput) {
  const { data, error } = await supabase.rpc("crear_proyecto", {
    p_cliente_id: clienteId,
    p_titulo: titulo,
    p_descripcion: descripcion,
    p_fecha_entrega: fechaEntrega,
    p_presupuesto: presupuesto,
  });
  if (error) return { proyecto: null, error };

  const proyecto = (Array.isArray(data) ? data[0] : data) as Proyecto | undefined;
  return { proyecto: proyecto ?? null, error: null };
}

/** Lista los proyectos publicados por un cliente (los más nuevos primero). */
export async function listarProyectosDeCliente(clienteId: number): Promise<Proyecto[]> {
  const { data, error } = await supabase.from("proyectos").select("*").eq("cliente_id", clienteId).order("id", { ascending: false });
  if (error) {
    console.error("Error listando proyectos:", error.message);
    return [];
  }
  return (data ?? []) as Proyecto[];
}

/** Lista los proyectos abiertos de todos los clientes — lo que un Creativo
 * ve en "Buscar proyecto" (vía RPC — ver supabase/schema_03_buscar_proyecto.sql). */
export async function listarProyectosDisponibles(): Promise<ProyectoDisponible[]> {
  const { data, error } = await supabase.rpc("listar_proyectos_disponibles");
  if (error) {
    console.error("Error listando proyectos disponibles:", error.message);
    return [];
  }
  return (data ?? []) as ProyectoDisponible[];
}

export interface SeleccionarCreativoInput {
  proyectoId: number;
  clienteId: number;
  creativoId: number;
}

/** El cliente elige un creativo entre las propuestas de un proyecto — lo
 * asigna y pasa el proyecto a "en_proceso" (vía RPC — ver
 * supabase/schema_08_seleccionar_creativo.sql). */
export async function seleccionarCreativo({ proyectoId, clienteId, creativoId }: SeleccionarCreativoInput) {
  const { data, error } = await supabase.rpc("seleccionar_creativo", {
    p_proyecto_id: proyectoId,
    p_cliente_id: clienteId,
    p_creativo_id: creativoId,
  });
  if (error) return { proyecto: null, error };

  const proyecto = (Array.isArray(data) ? data[0] : data) as Proyecto | undefined;
  return { proyecto: proyecto ?? null, error: null };
}

/** Lista los proyectos que un Creativo tiene asignados — su "Proyectos
 * activos" (vía RPC — ver supabase/schema_08_seleccionar_creativo.sql). */
export async function listarProyectosAsignados(creativoId: number): Promise<ProyectoAsignado[]> {
  const { data, error } = await supabase.rpc("listar_proyectos_asignados", { p_creativo_id: creativoId });
  if (error) {
    console.error("Error listando proyectos asignados:", error.message);
    return [];
  }
  return (data ?? []) as ProyectoAsignado[];
}
