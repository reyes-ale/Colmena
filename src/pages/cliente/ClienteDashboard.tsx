import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useParams } from "react-router";
import { LayoutDashboard, PlusCircle, Briefcase, MessageSquare, Users, BarChart3, Wallet, Settings, Sparkles, ChevronLeft } from "lucide-react";
import type { EntregaConDetalle, Proyecto, PropuestaConDetalle, UsuarioProfile } from "../../lib/types";
import { crearProyecto, listarProyectosDeCliente, seleccionarCreativo } from "../../lib/proyectos";
import { listarPropuestasDeCliente } from "../../lib/propuestas";
import { listarEntregasDeCliente } from "../../lib/entregas";
import { Avatar, FlyingBees, DashboardLayout, Panel, EmptyState, ComingSoon, type NavItem } from "../shared/DashboardUI";
import { ESTADO_LABEL, ESTADO_COLOR, formatFecha, formatMoneda } from "../shared/proyectoFormat";
import Configuracion from "../shared/Configuracion";

const NAV_ITEMS: NavItem[] = [
  { key: "cliente", label: "Inicio", icon: LayoutDashboard, end: true },
  { key: "cliente/publicar-proyecto", label: "Publicar proyecto", icon: PlusCircle },
  { key: "cliente/proyectos", label: "Proyectos activos", icon: Briefcase },
  { key: "cliente/mensajes", label: "Mensajes", icon: MessageSquare },
  { key: "cliente/propuestas", label: "Propuestas", icon: Users },
  { key: "cliente/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { key: "cliente/pagos", label: "Pagos y facturación", icon: Wallet },
  { key: "cliente/configuracion", label: "Configuración", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Proyectos activos — datos reales del cliente (tabla proyectos)       */
/* ------------------------------------------------------------------ */

function useProyectosDeCliente(clienteId: number) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listarProyectosDeCliente(clienteId).then((data) => {
      if (active) {
        setProyectos(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [clienteId, version]);

  return { proyectos, loading, refresh: () => setVersion((v) => v + 1) };
}

function ProyectoRow({ proyecto, propuestasCount }: { proyecto: Proyecto; propuestasCount?: number }) {
  return (
    <Link
      to={`/dashboard/cliente/proyectos/${proyecto.id}/propuestas`}
      className="flex items-center justify-between gap-4 border-b border-[#f1f5f9] py-3 last:border-0 hover:bg-[#f8fafc]"
    >
      <div className="flex min-w-0 flex-col">
        <p className={`text-[12px] font-bold uppercase ${ESTADO_COLOR[proyecto.estado]}`}>{ESTADO_LABEL[proyecto.estado]}</p>
        <p className="truncate font-bold text-[#0a142f] text-[15px]">{proyecto.titulo}</p>
        <p className="text-[13px] text-[#64748b]">{formatMoneda(proyecto.presupuesto)}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-right text-[13px] text-[#64748b]">
        <p>Fecha de entrega</p>
        <p className="font-medium text-[#0a142f]">{formatFecha(proyecto.fecha_entrega)}</p>
        {typeof propuestasCount === "number" && (
          <span className="mt-0.5 rounded-full bg-[#CBE9F4] px-2.5 py-0.5 text-[11px] font-bold text-[#0a142f] whitespace-nowrap">
            {propuestasCount === 0 ? "Sin propuestas" : `${propuestasCount} propuesta${propuestasCount === 1 ? "" : "s"}`}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Propuestas — las que los creativos envían a los proyectos del cliente */
/* ------------------------------------------------------------------ */

function usePropuestasDeCliente(clienteId: number) {
  const [propuestas, setPropuestas] = useState<PropuestaConDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listarPropuestasDeCliente(clienteId).then((data) => {
      if (active) {
        setPropuestas(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [clienteId]);

  return { propuestas, loading };
}

function PropuestaRow({ propuesta }: { propuesta: PropuestaConDetalle }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#f1f5f9] py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar nombre={propuesta.creativo_nombre} fotoUrl={propuesta.creativo_foto_url} size={48} />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-[#0a142f] text-[15px]">{propuesta.creativo_nombre}</p>
            <span className="rounded-full bg-[#ffe1b0] px-2.5 py-0.5 text-[11px] font-bold text-[#7a4a00] whitespace-nowrap">
              {propuesta.proyecto_titulo}
            </span>
          </div>
          <p className="text-[13px] text-[#475569]">{propuesta.entregable}</p>
          {propuesta.mensaje && <p className="mt-1 max-w-[420px] text-[13px] text-[#94a3b8]">&ldquo;{propuesta.mensaje}&rdquo;</p>}
        </div>
      </div>
      <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
        <span className="rounded-full bg-[#CBE9F4] px-3 py-1 text-[12px] font-bold text-[#0a142f] whitespace-nowrap">{formatMoneda(propuesta.monto)}</span>
        {propuesta.cv_url && (
          <a
            href={propuesta.cv_url}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-medium text-[#0a142f] hover:underline whitespace-nowrap"
          >
            Ver CV
          </a>
        )}
      </div>
    </div>
  );
}

function contarPropuestasPorProyecto(propuestas: PropuestaConDetalle[]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const p of propuestas) counts[p.proyecto_id] = (counts[p.proyecto_id] ?? 0) + 1;
  return counts;
}

/* ------------------------------------------------------------------ */
/* Inicio (overview)                                                    */
/* ------------------------------------------------------------------ */

function Inicio({ profile }: { profile: UsuarioProfile }) {
  const { proyectos, loading } = useProyectosDeCliente(profile.id);
  const { propuestas, loading: loadingPropuestas } = usePropuestasDeCliente(profile.id);
  const conteoPropuestas = useMemo(() => contarPropuestasPorProyecto(propuestas), [propuestas]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[18px] text-[#64748b] sm:text-[20px]">Bienvenido de nuevo,</p>
          <p className="font-extrabold text-[#0a142f] text-[32px] sm:text-[38px]">{profile.nombre}</p>
        </div>
        <FlyingBees />
      </div>

      <div className="flex w-full flex-col items-start gap-4 rounded-[20px] bg-[#ffd081] p-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-extrabold text-[#0a142f] text-[22px]">Publica un proyecto</p>
          <p className="max-w-[420px] text-[14px] text-[#0a142f]/80">Cuéntanos qué necesitas y recibe propuestas de creativos listos para hacerlo realidad.</p>
        </div>
        <Link to="/dashboard/cliente/publicar-proyecto" className="flex shrink-0 items-center justify-center rounded-[12px] bg-black px-6 py-3">
          <p className="font-bold leading-normal text-white text-[14px] whitespace-nowrap">Publicar un proyecto</p>
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel
            title="Proyectos activos"
            action={
              <Link to="/dashboard/cliente/proyectos" className="text-[13px] font-medium text-[#0a142f] hover:underline">
                Ver más
              </Link>
            }
          >
            {loading ? (
              <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
            ) : proyectos.length === 0 ? (
              <EmptyState text="Aún no has publicado proyectos. Publica uno para empezar a recibir propuestas." />
            ) : (
              <div className="flex flex-col">
                {proyectos.slice(0, 4).map((p) => (
                  <ProyectoRow key={p.id} proyecto={p} propuestasCount={conteoPropuestas[p.id] ?? 0} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel
            title="Propuestas"
            action={
              <Link to="/dashboard/cliente/propuestas" className="text-[13px] font-medium text-[#0a142f] hover:underline">
                Ver más
              </Link>
            }
          >
            {loadingPropuestas ? (
              <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
            ) : propuestas.length === 0 ? (
              <EmptyState text="Aún no has recibido propuestas." />
            ) : (
              <div className="flex flex-col">
                {propuestas.slice(0, 3).map((p) => (
                  <PropuestaRow key={p.id} propuesta={p} />
                ))}
              </div>
            )}
          </Panel>

          <div className="flex w-full flex-col gap-3 rounded-[16px] bg-[#CBE9F4] p-5 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-[12px] bg-white/70">
              <Sparkles size={20} className="text-[#0a142f]" />
            </div>
            <p className="font-bold text-[#0a142f] text-[16px]">¿Quieres más visibilidad?</p>
            <p className="text-[13px] text-[#0a142f]/80">Promociona tus proyectos dentro de Colmena y llega a más creativos.</p>
            <p className="text-[13px] font-bold text-[#0a142f]">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Publicar proyecto — formulario real, escribe en la tabla proyectos   */
/* ------------------------------------------------------------------ */

function PublicarProyecto({ profile }: { profile: UsuarioProfile }) {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acepto) {
      setError("Tienes que aceptar el acuerdo digital para publicar.");
      return;
    }
    const presupuestoNum = Number(presupuesto);
    if (!presupuestoNum || presupuestoNum <= 0) {
      setError("Ingresa un presupuesto válido.");
      return;
    }

    setLoading(true);
    const { proyecto, error: createError } = await crearProyecto({
      clienteId: profile.id,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fechaEntrega,
      presupuesto: presupuestoNum,
    });
    setLoading(false);

    if (createError || !proyecto) {
      setError(createError?.message ?? "No se pudo publicar el proyecto.");
      return;
    }
    navigate("/dashboard/cliente/proyectos");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Cuéntanos sobre tu proyecto</p>
        <FlyingBees />
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-[640px] flex-col gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="titulo" className="text-[14px] font-medium text-[#0a142f]">
            Título de tu proyecto
          </label>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ej. Diseño de identidad visual"
            className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="descripcion" className="text-[14px] font-medium text-[#0a142f]">
            Describe qué necesitas
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            placeholder="Cuéntanos el alcance, referencias y cualquier detalle importante…"
            className="w-full resize-none rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
          />
        </div>

        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="fecha" className="text-[14px] font-medium text-[#0a142f]">
              Fecha de entrega
            </label>
            <input
              id="fecha"
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="presupuesto" className="text-[14px] font-medium text-[#0a142f]">
              ¿Cuánto puedes invertir?
            </label>
            <input
              id="presupuesto"
              type="number"
              min="1"
              step="1"
              value={presupuesto}
              onChange={(e) => setPresupuesto(e.target.value)}
              required
              placeholder="L. 0"
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-[13px] text-[#475569]">
          <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#0a142f]" />
          Acepto el acuerdo digital y las condiciones del pago protegido con escrow.
        </label>

        {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 disabled:opacity-60"
        >
          <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">{loading ? "Publicando…" : "Publicar Proyecto"}</p>
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Proyectos activos — listado completo                                 */
/* ------------------------------------------------------------------ */

function ProyectosActivos({ profile }: { profile: UsuarioProfile }) {
  const { proyectos, loading } = useProyectosDeCliente(profile.id);
  const { propuestas } = usePropuestasDeCliente(profile.id);
  const conteoPropuestas = useMemo(() => contarPropuestasPorProyecto(propuestas), [propuestas]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Proyectos activos</p>
        <Link to="/dashboard/cliente/publicar-proyecto" className="flex shrink-0 items-center justify-center rounded-[12px] bg-black px-5 py-2.5">
          <p className="font-bold leading-normal text-white text-[14px] whitespace-nowrap">Publicar un proyecto</p>
        </Link>
      </div>

      <Panel title={`${proyectos.length} proyecto${proyectos.length === 1 ? "" : "s"}`}>
        {loading ? (
          <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
        ) : proyectos.length === 0 ? (
          <EmptyState text="Aún no has publicado proyectos." />
        ) : (
          <div className="flex flex-col">
            {proyectos.map((p) => (
              <ProyectoRow key={p.id} proyecto={p} propuestasCount={conteoPropuestas[p.id] ?? 0} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Propuestas de un proyecto — el cliente elige un creativo             */
/* ------------------------------------------------------------------ */

function PropuestaCard({
  propuesta,
  estado,
  onSeleccionar,
  seleccionando,
}: {
  propuesta: PropuestaConDetalle;
  estado: "pendiente" | "seleccionado" | "no_seleccionado";
  onSeleccionar: () => void;
  seleccionando: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-3 rounded-[16px] bg-[#CBE9F4] p-6 text-center">
      <Avatar nombre={propuesta.creativo_nombre} fotoUrl={propuesta.creativo_foto_url} size={72} />
      <p className="font-bold text-[#0a142f] text-[17px]">{propuesta.creativo_nombre}</p>
      <p className="font-extrabold text-[#0a142f] text-[20px]">{formatMoneda(propuesta.monto)}</p>

      <div className="flex flex-col gap-0.5 text-[13px] text-[#0a142f]/80">
        {propuesta.propuestas_iniciales != null && (
          <p>
            {propuesta.propuestas_iniciales} propuesta{propuesta.propuestas_iniciales === 1 ? "" : "s"} iniciales
          </p>
        )}
        {propuesta.rondas_cambio != null && (
          <p>
            {propuesta.rondas_cambio} ronda{propuesta.rondas_cambio === 1 ? "" : "s"} de cambios
          </p>
        )}
      </div>

      {propuesta.cv_url && (
        <a href={propuesta.cv_url} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-[#0a142f] underline underline-offset-2">
          Ver CV
        </a>
      )}

      {estado === "seleccionado" && <span className="mt-2 rounded-[10px] bg-black px-4 py-2 text-[13px] font-bold text-white">Creativo asignado</span>}
      {estado === "no_seleccionado" && <span className="mt-2 text-[13px] font-medium text-[#0a142f]/50">No seleccionado</span>}
      {estado === "pendiente" && (
        <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onSeleccionar}
            disabled={seleccionando}
            className="flex flex-1 items-center justify-center rounded-[10px] bg-[#ffb53e] px-4 py-2.5 disabled:opacity-60"
          >
            <p className="font-bold text-[#0a142f] text-[13px] whitespace-nowrap">{seleccionando ? "Asignando…" : "Seleccionar creativo"}</p>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/cliente/mensajes")}
            className="flex flex-1 items-center justify-center rounded-[10px] bg-black px-4 py-2.5"
          >
            <p className="font-bold text-white text-[13px] whitespace-nowrap">Contactar</p>
          </button>
        </div>
      )}
    </div>
  );
}

function useEntregasDeCliente(clienteId: number) {
  const [entregas, setEntregas] = useState<EntregaConDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listarEntregasDeCliente(clienteId).then((data) => {
      if (active) {
        setEntregas(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [clienteId]);

  return { entregas, loading };
}

function EntregaRow({ entrega }: { entrega: EntregaConDetalle }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#f1f5f9] py-4 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar nombre={entrega.creativo_nombre} fotoUrl={entrega.creativo_foto_url} size={40} />
        <div className="flex min-w-0 flex-col">
          <p className="font-bold text-[#0a142f] text-[14px]">{entrega.creativo_nombre}</p>
          <p className="text-[12px] text-[#94a3b8]">{new Date(entrega.created_at).toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
      <p className="text-[14px] text-[#475569]">{entrega.descripcion}</p>
      {entrega.archivo_url && (
        <a
          href={entrega.archivo_url}
          target="_blank"
          rel="noreferrer"
          className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#0a142f] underline underline-offset-2"
        >
          Ver archivo entregado
        </a>
      )}
    </div>
  );
}

function PropuestasDelProyecto({ profile }: { profile: UsuarioProfile }) {
  const { proyectoId } = useParams();
  const { proyectos, loading: loadingProyecto, refresh: refreshProyectos } = useProyectosDeCliente(profile.id);
  const { propuestas, loading: loadingPropuestas } = usePropuestasDeCliente(profile.id);
  const { entregas, loading: loadingEntregas } = useEntregasDeCliente(profile.id);
  const [seleccionandoId, setSeleccionandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const proyecto = useMemo(() => proyectos.find((p) => p.id === Number(proyectoId)), [proyectos, proyectoId]);
  const propuestasDelProyecto = useMemo(() => propuestas.filter((p) => p.proyecto_id === Number(proyectoId)), [propuestas, proyectoId]);
  const entregasDelProyecto = useMemo(() => entregas.filter((e) => e.proyecto_id === Number(proyectoId)), [entregas, proyectoId]);

  const handleSeleccionar = async (creativoId: number) => {
    if (!proyecto) return;
    setError(null);
    setSeleccionandoId(creativoId);
    const { proyecto: actualizado, error: selectError } = await seleccionarCreativo({
      proyectoId: proyecto.id,
      clienteId: profile.id,
      creativoId,
    });
    setSeleccionandoId(null);

    if (selectError || !actualizado) {
      setError(selectError?.message ?? "No se pudo asignar el creativo.");
      return;
    }
    refreshProyectos();
  };

  if (loadingProyecto) {
    return <p className="py-10 text-center text-[13px] text-[#94a3b8]">Cargando…</p>;
  }

  if (!proyecto) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Link to="/dashboard/cliente/proyectos" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <EmptyState text="Ese proyecto ya no está disponible." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/dashboard/cliente/proyectos" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <FlyingBees />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Propuestas</p>
        <p className="text-[14px] text-[#64748b]">
          Revisa las propuestas para <span className="font-bold text-[#0a142f]">{proyecto.titulo}</span> y elige la que mejor se adapte a lo que
          necesitas.
        </p>
      </div>

      {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

      {loadingPropuestas ? (
        <p className="py-10 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
      ) : propuestasDelProyecto.length === 0 ? (
        <EmptyState text="Aún no has recibido propuestas para este proyecto." />
      ) : (
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {propuestasDelProyecto.map((p) => (
            <PropuestaCard
              key={p.id}
              propuesta={p}
              estado={p.estado === "aceptada" ? "seleccionado" : p.estado === "rechazada" ? "no_seleccionado" : "pendiente"}
              seleccionando={seleccionandoId === p.creativo_id}
              onSeleccionar={() => handleSeleccionar(p.creativo_id)}
            />
          ))}
        </div>
      )}

      {proyecto.estado !== "abierto" && (
        <Panel title="Entrega">
          {loadingEntregas ? (
            <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
          ) : entregasDelProyecto.length === 0 ? (
            <EmptyState text="El creativo todavía no ha entregado nada para este proyecto." />
          ) : (
            <div className="flex flex-col">
              {entregasDelProyecto.map((e) => (
                <EntregaRow key={e.id} entrega={e} />
              ))}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Propuestas — listado completo                                        */
/* ------------------------------------------------------------------ */

function PropuestasRecibidas({ profile }: { profile: UsuarioProfile }) {
  const { propuestas, loading } = usePropuestasDeCliente(profile.id);

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Propuestas</p>

      <Panel title={`${propuestas.length} propuesta${propuestas.length === 1 ? "" : "s"}`}>
        {loading ? (
          <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
        ) : propuestas.length === 0 ? (
          <EmptyState text="Aún no has recibido propuestas." />
        ) : (
          <div className="flex flex-col">
            {propuestas.map((p) => (
              <PropuestaRow key={p.id} propuesta={p} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rutas del dashboard de cliente                                       */
/* ------------------------------------------------------------------ */

export default function ClienteDashboard({ profile }: { profile: UsuarioProfile }) {
  return (
    <DashboardLayout profile={profile} navItems={NAV_ITEMS} homePath="/dashboard/cliente" configPath="/dashboard/cliente/configuracion">
      <Routes>
        <Route path="cliente" element={<Inicio profile={profile} />} />
        <Route path="cliente/publicar-proyecto" element={<PublicarProyecto profile={profile} />} />
        <Route path="cliente/proyectos" element={<ProyectosActivos profile={profile} />} />
        <Route path="cliente/proyectos/:proyectoId/propuestas" element={<PropuestasDelProyecto profile={profile} />} />
        <Route path="cliente/mensajes" element={<ComingSoon title="Mensajes" icon={MessageSquare} />} />
        <Route path="cliente/propuestas" element={<PropuestasRecibidas profile={profile} />} />
        <Route path="cliente/estadisticas" element={<ComingSoon title="Estadísticas" icon={BarChart3} />} />
        <Route path="cliente/pagos" element={<ComingSoon title="Pagos y facturación" icon={Wallet} />} />
        <Route path="cliente/configuracion" element={<Configuracion profile={profile} />} />
        <Route path="*" element={<Navigate to="/dashboard/cliente" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
