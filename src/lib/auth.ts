import { supabase } from "./supabase";
import type { Rol, TipoCliente, UsuarioProfile } from "./types";

const STORAGE_KEY = "colmena_usuario";

export interface SignUpInput {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: Rol;
  tipoCliente: TipoCliente | null;
}

/**
 * La tabla `usuarios` de este proyecto ya existía antes de esta etapa (con
 * columna "contraseña" en texto plano) y no se tocó, así que en vez de
 * Supabase Auth usamos dos funciones RPC (ver supabase/schema.sql) que
 * leen/escriben esa tabla sin exponerla directamente por RLS: la
 * contraseña se compara DENTRO de la base y nunca sale hacia el cliente.
 * La "sesión" es simplemente el perfil devuelto, guardado en localStorage.
 */
export async function signUpUsuario({ nombre, correo, contrasena, rol, tipoCliente }: SignUpInput) {
  const { data, error } = await supabase.rpc("registrar_usuario", {
    p_nombre: nombre,
    p_correo: correo,
    p_contrasena: contrasena,
    p_rol: rol,
    p_tipo_cliente: tipoCliente,
  });
  if (error) return { profile: null, error };

  const profile = (Array.isArray(data) ? data[0] : data) as UsuarioProfile | undefined;
  if (profile) persistProfile(profile);
  return { profile: profile ?? null, error: null };
}

export async function signInUsuario(correo: string, contrasena: string) {
  const { data, error } = await supabase.rpc("verificar_login", {
    p_correo: correo,
    p_contrasena: contrasena,
  });
  if (error) return { profile: null, error };

  const profile = (Array.isArray(data) ? data[0] : null) as UsuarioProfile | null;
  if (!profile) return { profile: null, error: { message: "Correo o contraseña incorrectos." } };

  persistProfile(profile);
  return { profile, error: null };
}

export function signOutUsuario() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadStoredProfile(): UsuarioProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UsuarioProfile) : null;
  } catch {
    return null;
  }
}

function persistProfile(profile: UsuarioProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** A qué dashboard debe ir cada combinación de rol / tipo_cliente. */
export function dashboardPathForProfile(profile: UsuarioProfile): string {
  if (profile.rol === "creativo") return "/dashboard/creativo";
  return profile.tipo_cliente === "empresa" ? "/dashboard/cliente-empresa" : "/dashboard/cliente-persona";
}
