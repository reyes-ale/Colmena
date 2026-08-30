export type Rol = "cliente" | "creativo";
export type TipoCliente = "empresa" | "persona_natural";

/** Fila de la tabla public.usuarios (id BIGINT, ya existía en el proyecto). */
export interface UsuarioProfile {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  tipo_cliente: TipoCliente | null;
}
