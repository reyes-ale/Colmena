-- Colmena — funciones RPC de registro/login, con contraseñas hasheadas.
--
-- La tabla `usuarios` YA EXISTE en este proyecto (creada manualmente antes
-- de esta etapa) con esta forma — no se toca ni su estructura ni sus datos:
--   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
--   nombre TEXT NOT NULL
--   correo TEXT NOT NULL UNIQUE
--   contraseña TEXT NOT NULL   -- guarda un HASH bcrypt, no texto plano
--   rol TEXT NOT NULL CHECK (rol IN ('cliente','creativo'))
--   tipo_cliente TEXT
--
-- Como esa tabla tiene RLS activado y sin políticas, el cliente (clave
-- anon) no puede leerla ni escribirla directamente — y aunque pudiera,
-- ahora ni siquiera vería la contraseña real: se guarda hasheada con
-- bcrypt (vía pgcrypto), así que en el Table Editor de Supabase vas a ver
-- algo como "$2a$06/xJ3k..." en vez del valor real.
--
-- registrar_usuario nunca devuelve la contraseña, y verificar_login la
-- compara internamente (hash contra hash) sin sacarla nunca hacia el
-- cliente.
--
-- Ejecuta este archivo completo en Supabase → SQL Editor → New query → Run.
-- Es seguro volver a correrlo (create or replace / update condicionado).

create extension if not exists pgcrypto;

-- Migración única: las cuentas creadas antes de este cambio (los 3 usuarios
-- demo + lo que hayas probado) tienen la contraseña en texto plano todavía.
-- Esto las re-hashea una sola vez. Es seguro volver a correr este bloque:
-- solo toca filas cuyo valor NO tenga ya forma de hash bcrypt.
update public.usuarios
set "contraseña" = crypt("contraseña", gen_salt('bf'))
where "contraseña" !~ '^\$2[aby]\$';

create or replace function public.registrar_usuario(
  p_nombre text,
  p_correo text,
  p_contrasena text,
  p_rol text,
  p_tipo_cliente text
)
returns table (id bigint, nombre text, correo text, rol text, tipo_cliente text)
language plpgsql
security definer set search_path = public, extensions
as $$
begin
  if exists (select 1 from public.usuarios u where u.correo = p_correo) then
    raise exception 'Ya existe una cuenta con ese correo.';
  end if;

  return query
  insert into public.usuarios (nombre, correo, "contraseña", rol, tipo_cliente)
  values (p_nombre, p_correo, crypt(p_contrasena, gen_salt('bf')), p_rol, p_tipo_cliente)
  returning usuarios.id, usuarios.nombre, usuarios.correo, usuarios.rol, usuarios.tipo_cliente;
end;
$$;

create or replace function public.verificar_login(
  p_correo text,
  p_contrasena text
)
returns table (id bigint, nombre text, correo text, rol text, tipo_cliente text)
language plpgsql
security definer set search_path = public, extensions
as $$
begin
  return query
  select u.id, u.nombre, u.correo, u.rol, u.tipo_cliente
  from public.usuarios u
  where u.correo = p_correo
    and u."contraseña" = crypt(p_contrasena, u."contraseña");
end;
$$;

grant execute on function public.registrar_usuario(text, text, text, text, text) to anon, authenticated;
grant execute on function public.verificar_login(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Nota sobre el trigger roto en auth.users (visible en tus Postgres Logs):
-- algo previo a esta etapa dejó un trigger en auth.users que intenta
-- insertar en una tabla "profiles" que no existe, y por eso CUALQUIER
-- supabase.auth.signUp()/creación de usuario en Auth falla con
-- "Database error saving new user". Como esta etapa ya no usa Supabase
-- Auth (usamos las funciones de arriba sobre tu tabla usuarios), no hace
-- falta tocarlo — pero si más adelante quieres usar Supabase Auth para
-- algo, vas a necesitar encontrar y corregir ese trigger primero.
-- ---------------------------------------------------------------------
