import type { Proyecto } from "../../lib/types";

/** Etiquetas/colores de estado y formateo — compartido entre el dashboard
 * de Cliente y el de Creativo para no duplicar el mismo código dos veces. */

export const ESTADO_LABEL: Record<Proyecto["estado"], string> = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  entregado: "Entregado",
  cambios_solicitados: "Cambios solicitados",
  aceptado: "Aceptado",
  pago_realizado: "Pago realizado",
  completado: "Completado",
  cancelado: "Cancelado",
};

export const ESTADO_COLOR: Record<Proyecto["estado"], string> = {
  abierto: "text-[#0a142f]",
  en_proceso: "text-[#b45309]",
  entregado: "text-[#0369a1]",
  cambios_solicitados: "text-[#d4183d]",
  aceptado: "text-[#7c3aed]",
  pago_realizado: "text-[#0ea5e9]",
  completado: "text-[#16a34a]",
  cancelado: "text-[#d4183d]",
};

export function formatFecha(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" });
}

export function formatMoneda(n: number) {
  return `L. ${n.toLocaleString("es-HN")}`;
}
