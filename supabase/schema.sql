-- Colmena — funciones RPC de registro/login.
--
-- La tabla `usuarios` YA EXISTE en este proyecto (creada manualmente antes
-- de esta etapa) con esta forma — no se toca ni su estructura ni sus datos:
--   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
--   nombre TEXT NOT NULL
--   correo TEXT NOT NULL UNIQUE
--   contraseña TEXT NOT NULL   -- texto plano, tal como se creó
--   rol TEXT NOT NULL CHECK (rol IN ('cliente','creativo'))
--   tipo_cliente TEXT
--
-- Como esa tabla tiene RLS activado y sin políticas, el cliente (clave
-- anon) no puede leerla ni escribirla directamente — y no queremos abrir
-- una política de SELECT ancha porque expondría la columna "contraseña" en
-- texto plano a cualquiera con la clave anon (que es pública, va en el
-- bundle del frontend).
--
-- En vez de eso, estas dos funciones corren DENTRO de la base (security
-- definer) y solo exponen lo necesario: registrar_usuario nunca devuelve la
-- contraseña, y verificar_login la compara internamente sin sacarla nunca
-- hacia el cliente.
--
-- Ejecuta este archivo completo en Supabase → SQL Editor → New query → Run.
-- Es seguro volver a correrlo (create or replace).

create or replace function public.registrar_usuario(
  p_nombre text,
  p_correo text,
  p_contrasena text,
  p_rol text,
  p_tipo_cliente text
)
returns table (id bigint, nombre text, correo text, rol text, tipo_cliente text)
language plpgsql
security definer set search_path = public
as $$
begin
  if exists (select 1 from public.usuarios u where u.correo = p_correo) then
    raise exception 'Ya existe una cuenta con ese correo.';
  end if;

  return query
  insert into public.usuarios (nombre, correo, "contraseña", rol, tipo_cliente)
  values (p_nombre, p_correo, p_contrasena, p_rol, p_tipo_cliente)
  returning usuarios.id, usuarios.nombre, usuarios.correo, usuarios.rol, usuarios.tipo_cliente;
end;
$$;

create or replace function public.verificar_login(
  p_correo text,
  p_contrasena text
)
returns table (id bigint, nombre text, correo text, rol text, tipo_cliente text)
language plpgsql
security definer set search_path = public
as $$
begin
  return query
  select u.id, u.nombre, u.correo, u.rol, u.tipo_cliente
  from public.usuarios u
  where u.correo = p_correo and u."contraseña" = p_contrasena;
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
