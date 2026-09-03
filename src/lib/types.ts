export type Rol = "cliente" | "creativo";
export type TipoCliente = "empresa" | "persona_natural";

/** Fila de la tabla public.usuarios (id BIGINT, ya existía en el proyecto). */
export interface UsuarioProfile {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  tipo_cliente: TipoCliente | null;
  foto_url: string | null;
}

export type EstadoProyecto = "abierto" | "en_proceso" | "entregado" | "completado" | "cancelado";

/** Fila de la tabla public.proyectos (ya existía en el proyecto). */
export interface Proyecto {
  id: number;
  cliente_id: number;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  fecha_entrega: string; // fecha ISO (yyyy-mm-dd)
  estado: EstadoProyecto;
}

/** Proyecto abierto, tal como lo ve un Creativo en "Buscar proyecto" —
 * incluye el nombre y la foto del cliente que lo publicó (via RPC, no
 * expone más datos del cliente que esos dos). */
export interface ProyectoDisponible extends Proyecto {
  cliente_nombre: string;
  cliente_foto_url: string | null;
}

/** Proyecto asignado a un Creativo (hay una fila en public.contratos) —
 * su "Proyectos activos". Incluye nombre/foto del cliente. */
export interface ProyectoAsignado extends Proyecto {
  cliente_nombre: string;
  cliente_foto_url: string | null;
}

export type EstadoPropuesta = "enviada" | "aceptada" | "rechazada";

/** Fila de la tabla public.propuestas (ver supabase/schema_07_propuestas.sql). */
export interface Propuesta {
  id: number;
  proyecto_id: number;
  creativo_id: number;
  monto: number;
  entregable: string;
  mensaje: string | null;
  propuestas_iniciales: number | null;
  rondas_cambio: number | null;
  cv_url: string | null;
  estado: EstadoPropuesta;
  created_at: string;
}

/** Propuesta tal como la ve un Cliente — con el nombre/foto del creativo y
 * el título del proyecto ya resueltos (via RPC). */
export interface PropuestaConDetalle extends Propuesta {
  proyecto_titulo: string;
  creativo_nombre: string;
  creativo_foto_url: string | null;
}

/** Fila de la tabla public.entregas (ver supabase/schema_10_entregas.sql). */
export interface Entrega {
  id: number;
  proyecto_id: number;
  creativo_id: number;
  descripcion: string;
  archivo_url: string | null;
  created_at: string;
}

/** Entrega tal como la ve un Cliente — con el título del proyecto y el
 * nombre/foto del creativo ya resueltos (via RPC). */
export interface EntregaConDetalle extends Entrega {
  proyecto_titulo: string;
  creativo_nombre: string;
  creativo_foto_url: string | null;
}
