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

/** Flujo completo, en orden:
 * abierto → en_proceso → entregado → (aceptado | cambios_solicitados)
 * cambios_solicitados vuelve a "entregado" cuando el creativo corrige.
 * aceptado → pago_realizado → completado. */
export type EstadoProyecto =
  | "abierto"
  | "en_proceso"
  | "entregado"
  | "cambios_solicitados"
  | "aceptado"
  | "pago_realizado"
  | "completado"
  | "cancelado";

/** Fila de la tabla public.proyectos (ya existía en el proyecto). */
export interface Proyecto {
  id: number;
  cliente_id: number;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  fecha_entrega: string; // fecha ISO (yyyy-mm-dd)
  estado: EstadoProyecto;
  /** Comentario del cliente cuando pide cambios (ver solicitar_cambios). */
  comentario_revision: string | null;
}

/** Proyecto abierto, tal como lo ve un Creativo en "Buscar proyecto" —
 * incluye el nombre y la foto del cliente que lo publicó (via RPC, no
 * expone más datos del cliente que esos dos). */
export interface ProyectoDisponible extends Proyecto {
  cliente_nombre: string;
  cliente_foto_url: string | null;
  /** true si el creativo que pidió la lista ya envió una propuesta para
   * este proyecto (siempre false si no se pasó un id de creativo). */
  ya_envie_propuesta: boolean;
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

/** Fila de la tabla public.resenas (ya existía en el proyecto). */
export interface Resena {
  id: number;
  proyecto_id: number;
  cliente_id: number;
  creativo_id: number;
  calificacion: number;
  comentario: string | null;
  created_at: string;
}

/** Estadísticas reales de un Creativo (vía RPC — ver
 * supabase/schema_14_resenas.sql). calificacion_promedio es null si
 * todavía no tiene reseñas. */
export interface EstadisticasCreativo {
  trabajos_completados: number;
  ganancias: number;
  calificacion_promedio: number | null;
  total_resenas: number;
}

/** Conversación entre un cliente y un creativo (ver
 * supabase/schema_18_mensajes.sql) — "otro_*" es la contraparte del
 * usuario que la está consultando, sea cliente o creativo. */
export interface Conversacion {
  id: number;
  otro_id: number;
  otro_nombre: string;
  otro_foto_url: string | null;
  ultimo_mensaje: string | null;
  ultimo_mensaje_en: string | null;
  no_leidos: number;
}

export interface Mensaje {
  id: number;
  conversacion_id: number;
  autor_id: number;
  texto: string;
  created_at: string;
  leido: boolean;
}

/** Ver supabase/schema_19_notificaciones.sql — se crean solas desde
 * seleccionar_creativo, enviar_propuesta y solicitar_cambios. */
export type TipoNotificacion = "seleccionado" | "nueva_propuesta" | "cambios_solicitados";

export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  proyecto_id: number | null;
  leida: boolean;
  created_at: string;
}

/** Fila de la tabla public.trabajos_creativo — un proyecto del portafolio
 * (ya existía en el proyecto, ver supabase/schema_15_portafolio.sql).
 * Visible para todos (RLS de lectura pública) — los clientes también lo
 * ven al revisar propuestas. */
export interface TrabajoPortafolio {
  id: number;
  creativo_id: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  categorias: string[];
  herramientas: string | null;
  link: string | null;
  fecha_proyecto: string | null; // fecha ISO (yyyy-mm-dd)
  created_at: string;
}
