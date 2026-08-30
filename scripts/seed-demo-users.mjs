// Crea los 3 usuarios de prueba de Colmena directamente en tu tabla
// `usuarios` (vía la función RPC registrar_usuario — ver supabase/schema.sql).
//
// IMPORTANTE: corre primero supabase/schema.sql en el SQL Editor de Supabase
// (crea las funciones registrar_usuario / verificar_login). Sin eso este
// script va a fallar con "Could not find the function ...".
//
// Uso:  node --env-file=.env scripts/seed-demo-users.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.");
  console.error("Corre con: node --env-file=.env scripts/seed-demo-users.mjs");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const demoUsers = [
  { nombre: "Empresa Demo", correo: "empresa@demo.com", contrasena: "1234", rol: "cliente", tipo_cliente: "empresa" },
  { nombre: "Persona Demo", correo: "persona@demo.com", contrasena: "1234", rol: "cliente", tipo_cliente: "persona_natural" },
  { nombre: "Creativo Demo", correo: "creativo@demo.com", contrasena: "1234", rol: "creativo", tipo_cliente: null },
];

for (const u of demoUsers) {
  console.log(`\n→ Registrando ${u.correo} ...`);
  const { data, error } = await supabase.rpc("registrar_usuario", {
    p_nombre: u.nombre,
    p_correo: u.correo,
    p_contrasena: u.contrasena,
    p_rol: u.rol,
    p_tipo_cliente: u.tipo_cliente,
  });

  if (error) {
    if (/ya existe una cuenta/i.test(error.message)) {
      console.log(`  Ya existía ${u.correo}, no se modifica.`);
    } else if (/Could not find the function/i.test(error.message)) {
      console.error(`  Falta correr supabase/schema.sql en el SQL Editor de Supabase (las funciones RPC no existen todavía).`);
      process.exit(1);
    } else {
      console.error(`  Error creando ${u.correo}:`, error.message);
    }
    continue;
  }

  console.log(`  Listo:`, Array.isArray(data) ? data[0] : data);
}

console.log("\nListo.");
