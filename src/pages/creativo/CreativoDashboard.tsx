import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useParams } from "react-router";
import {
  X,
  LayoutDashboard,
  Search,
  Briefcase,
  MessageSquare,
  Image as ImageIcon,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
} from "lucide-react";
import type { ProyectoAsignado, ProyectoDisponible, UsuarioProfile } from "../../lib/types";
import { listarProyectosDisponibles, listarProyectosAsignados } from "../../lib/proyectos";
import { enviarPropuesta } from "../../lib/propuestas";
import { crearEntrega } from "../../lib/entregas";
import { subirArchivoCloudinary } from "../../lib/cloudinary";
import { Avatar, BeeLogo, FlyingBees, DashboardLayout, Panel, EmptyState, ComingSoon, type NavItem } from "../shared/DashboardUI";
import { ESTADO_LABEL, ESTADO_COLOR, formatFecha, formatMoneda } from "../shared/proyectoFormat";
import Configuracion from "../shared/Configuracion";

const NAV_ITEMS: NavItem[] = [
  { key: "creativo", label: "Inicio", icon: LayoutDashboard, end: true },
  { key: "creativo/buscar-proyecto", label: "Buscar proyecto", icon: Search },
  { key: "creativo/proyectos", label: "Proyectos activos", icon: Briefcase },
  { key: "creativo/mensajes", label: "Mensajes", icon: MessageSquare },
  { key: "creativo/portafolio", label: "Portafolio", icon: ImageIcon },
  { key: "creativo/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { key: "creativo/pagos", label: "Pagos y facturación", icon: Wallet },
  { key: "creativo/configuracion", label: "Configuración", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Tarjetas de estadísticas                                            */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className={`flex min-h-[190px] flex-1 flex-col justify-between rounded-[20px] p-6 ${bg}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-[#0a142f] text-[15px]">{label}</p>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-white/85">
          <BeeLogo size={26} />
        </div>
      </div>
      <p className="font-extrabold text-[#0a142f] text-[36px]">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Horas trabajadas — sin datos todavía (no hay registro de horas aún) */
/* ------------------------------------------------------------------ */

function WeeklyHoursChart() {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return (
    <div className="flex w-full flex-col gap-3">
      {dias.map((d) => (
        <div key={d} className="flex items-center gap-3">
          <span className="w-[80px] shrink-0 text-[13px] text-[#64748b]">{d}</span>
          <div className="h-2.5 w-full rounded-full bg-[#CBE9F4]" />
        </div>
      ))}
      <p className="mt-1 text-[13px] text-[#94a3b8]">Aún no hay horas registradas esta semana.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* To-do list — funcional, persistida por usuario en localStorage      */
/* ------------------------------------------------------------------ */

interface TodoItem {
  id: string;
  texto: string;
  hecho: boolean;
}

function useTodoList(userId: number) {
  const storageKey = `colmena_todos_${userId}`;
  const [items, setItems] = useState<TodoItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as TodoItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const add = (texto: string) => {
    if (!texto.trim()) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), texto: texto.trim(), hecho: false }]);
  };
  const toggle = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, hecho: !i.hecho } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return { items, add, toggle, remove };
}

function TodoList({ profile }: { profile: UsuarioProfile }) {
  const { items, add, toggle, remove } = useTodoList(profile.id);
  const [text, setText] = useState("");

  return (
    <div className="flex w-full flex-col gap-4 rounded-[16px] border-2 border-[#ffb53e] bg-[#ffdfad] p-5">
      <p className="font-bold text-[#0a142f] text-[16px]">To-do List</p>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Agregar pendiente…"
          className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
        />
        <button type="submit" aria-label="Agregar" className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-black">
          <Plus size={16} className="text-white" />
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState text="No tienes pendientes todavía." />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-[8px] border border-[#f1f5f9] px-3 py-2">
              <input type="checkbox" checked={item.hecho} onChange={() => toggle(item.id)} className="size-4 shrink-0 accent-[#0a142f]" />
              <span className={`flex-1 text-[13px] ${item.hecho ? "text-[#94a3b8] line-through" : "text-[#0a142f]"}`}>{item.texto}</span>
              <button type="button" aria-label="Eliminar" onClick={() => remove(item.id)} className="text-[#94a3b8] hover:text-[#d4183d]">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Calendario — mes actual, navegable                                  */
/* ------------------------------------------------------------------ */

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS_CORTOS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const weeks = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<number | null> = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: Array<Array<number | null>> = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [viewDate]);

  const isToday = (day: number | null) =>
    !!day && viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth() && day === today.getDate();

  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] bg-[#CBE9F4] p-5">
      <div className="flex items-center justify-between">
        <p className="font-bold text-[#0a142f] text-[14px]">
          {MESES[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="flex size-7 items-center justify-center rounded-[6px] hover:bg-[#f3f4f6]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="flex size-7 items-center justify-center rounded-[6px] hover:bg-[#f3f4f6]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#94a3b8]">
        {DIAS_CORTOS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((day, j) => (
              <div
                key={j}
                className={`flex aspect-square items-center justify-center rounded-[8px] text-[12px] ${
                  day == null ? "" : isToday(day) ? "bg-black font-bold text-white" : "text-[#334155] hover:bg-[#f3f4f6]"
                }`}
              >
                {day ?? ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buscar proyecto — proyectos abiertos publicados por clientes         */
/* ------------------------------------------------------------------ */

function useProyectosDisponibles() {
  const [proyectos, setProyectos] = useState<ProyectoDisponible[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listarProyectosDisponibles().then((data) => {
      if (active) {
        setProyectos(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { proyectos, loading };
}

function ProyectoDisponibleRow({ proyecto }: { proyecto: ProyectoDisponible }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar nombre={proyecto.cliente_nombre} fotoUrl={proyecto.cliente_foto_url} size={56} />
        <div className="flex min-w-0 flex-col">
          <p className="truncate font-bold text-[#0a142f] text-[17px]">{proyecto.cliente_nombre}</p>
          <p className="truncate text-[14px] text-[#475569]">{proyecto.titulo}</p>
          <p className="truncate text-[13px] text-[#94a3b8]">
            {formatMoneda(proyecto.presupuesto)} · Entrega {formatFecha(proyecto.fecha_entrega)}
          </p>
        </div>
      </div>

      <Link
        to={`/dashboard/creativo/buscar-proyecto/${proyecto.id}/propuesta`}
        className="flex shrink-0 items-center justify-center rounded-[10px] bg-black px-5 py-2.5"
      >
        <p className="font-bold leading-normal text-white text-[13px] whitespace-nowrap">Enviar Propuesta</p>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Enviar propuesta — formulario real, sube el CV y escribe en          */
/* la tabla propuestas                                                  */
/* ------------------------------------------------------------------ */

function DetalleValor({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#0a142f]/60">{label}</p>
      <span className="rounded-[10px] bg-white/70 px-4 py-1.5 text-center font-bold text-[#0a142f] text-[14px]">{valor}</span>
    </div>
  );
}

function EnviarPropuesta({ profile }: { profile: UsuarioProfile }) {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  const { proyectos, loading: loadingProyecto } = useProyectosDisponibles();
  const proyecto = useMemo(() => proyectos.find((p) => p.id === Number(proyectoId)), [proyectos, proyectoId]);

  const [monto, setMonto] = useState("");
  const [entregable, setEntregable] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [propuestasIniciales, setPropuestasIniciales] = useState("");
  const [rondasCambio, setRondasCambio] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!proyecto) return;

    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      setError("Ingresa cuánto cobrarías.");
      return;
    }
    if (!entregable.trim()) {
      setError("Cuéntanos qué vas a entregar.");
      return;
    }
    if (!cvFile) {
      setError("Sube tu CV para enviar la propuesta.");
      return;
    }

    setLoading(true);

    const { url, error: uploadError } = await subirArchivoCloudinary(cvFile);
    if (uploadError || !url) {
      setLoading(false);
      setError(uploadError ?? "No se pudo subir tu CV.");
      return;
    }

    const { propuesta, error: sendError } = await enviarPropuesta({
      proyectoId: proyecto.id,
      creativoId: profile.id,
      monto: montoNum,
      entregable: entregable.trim(),
      mensaje: mensaje.trim(),
      propuestasIniciales: propuestasIniciales ? Number(propuestasIniciales) : null,
      rondasCambio: rondasCambio ? Number(rondasCambio) : null,
      cvUrl: url,
    });
    setLoading(false);

    if (sendError || !propuesta) {
      setError(sendError?.message ?? "No se pudo enviar tu propuesta.");
      return;
    }
    navigate("/dashboard/creativo/buscar-proyecto");
  };

  if (loadingProyecto) {
    return <p className="py-10 text-center text-[13px] text-[#94a3b8]">Cargando…</p>;
  }

  if (!proyecto) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Link to="/dashboard/creativo/buscar-proyecto" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <EmptyState text="Este proyecto ya no está disponible." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/dashboard/creativo/buscar-proyecto" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <FlyingBees />
      </div>

      <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Enviar propuesta</p>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-6">
          <p className="font-bold text-[#0a142f] text-[18px]">Detalles del Proyecto</p>

          <div className="flex flex-col items-center gap-4 rounded-[16px] bg-[#CBE9F4] p-6 text-center">
            <Avatar nombre={proyecto.cliente_nombre} fotoUrl={proyecto.cliente_foto_url} size={72} />
            <div>
              <p className="font-bold text-[#0a142f] text-[18px]">{proyecto.cliente_nombre}</p>
              <p className="text-[14px] text-[#0a142f]/70">{proyecto.titulo}</p>
            </div>
            <p className="text-[14px] text-[#0a142f]/80">{proyecto.descripcion}</p>

            <DetalleValor label="Presupuesto" valor={formatMoneda(proyecto.presupuesto)} />
            <DetalleValor label="Fecha de entrega" valor={formatFecha(proyecto.fecha_entrega)} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6">
          <p className="font-bold text-[#0a142f] text-[18px]">Tu propuesta</p>

          <div className="flex flex-col gap-2">
            <label htmlFor="monto" className="text-[14px] font-medium text-[#0a142f]">
              ¿Cuánto cobrarías?
            </label>
            <input
              id="monto"
              type="number"
              min="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="L. 0"
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="entregable" className="text-[14px] font-medium text-[#0a142f]">
              ¿Qué entregarás?
            </label>
            <input
              id="entregable"
              value={entregable}
              onChange={(e) => setEntregable(e.target.value)}
              placeholder="Ej. 5 posts en formato editable"
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="mensaje" className="text-[14px] font-medium text-[#0a142f]">
              Mensaje para la empresa
            </label>
            <textarea
              id="mensaje"
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Cuéntales por qué eres la persona ideal para este proyecto…"
              className="w-full resize-none rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="propuestas-iniciales" className="text-[14px] font-medium text-[#0a142f]">
                Propuestas iniciales
              </label>
              <input
                id="propuestas-iniciales"
                type="number"
                min="0"
                value={propuestasIniciales}
                onChange={(e) => setPropuestasIniciales(e.target.value)}
                placeholder="0"
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="rondas-cambio" className="text-[14px] font-medium text-[#0a142f]">
                Rondas de cambio
              </label>
              <input
                id="rondas-cambio"
                type="number"
                min="0"
                value={rondasCambio}
                onChange={(e) => setRondasCambio(e.target.value)}
                placeholder="0"
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a142f]">Sube tu CV</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] py-8 text-center hover:bg-[#f1f5f9]">
              <Upload size={20} className="text-[#64748b]" />
              <span className="px-4 text-[13px] text-[#64748b]">{cvFile ? cvFile.name : "PDF o Word — haz click para elegir"}</span>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 disabled:opacity-60"
          >
            <p className="font-bold leading-normal text-white text-[15px]">{loading ? "Enviando…" : "Enviar"}</p>
          </button>
        </form>
      </div>
    </div>
  );
}

function BuscarProyecto() {
  const { proyectos, loading } = useProyectosDisponibles();
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return proyectos;
    return proyectos.filter(
      (p) => p.titulo.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q) || p.cliente_nombre.toLowerCase().includes(q)
    );
  }, [proyectos, query]);

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Proyectos disponibles</p>

      <div className="relative w-full max-w-[420px]">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, cliente o descripción…"
          className="w-full rounded-[10px] border border-[#e2e8f0] py-2.5 pl-9 pr-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
        />
      </div>

      <div className="w-full rounded-[16px] border border-[#e2e8f0] bg-white px-5">
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
        ) : filtrados.length === 0 ? (
          <div className="py-8">
            <EmptyState text={proyectos.length === 0 ? "Todavía no hay proyectos publicados." : "Ningún proyecto coincide con tu búsqueda."} />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {filtrados.map((p) => (
              <ProyectoDisponibleRow key={p.id} proyecto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Proyectos activos — proyectos donde el cliente ya eligió a este       */
/* creativo                                                              */
/* ------------------------------------------------------------------ */

function useProyectosAsignados(creativoId: number) {
  const [proyectos, setProyectos] = useState<ProyectoAsignado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listarProyectosAsignados(creativoId).then((data) => {
      if (active) {
        setProyectos(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [creativoId]);

  return { proyectos, loading };
}

function ProyectoAsignadoRow({ proyecto }: { proyecto: ProyectoAsignado }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#f1f5f9] py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar nombre={proyecto.cliente_nombre} fotoUrl={proyecto.cliente_foto_url} size={44} />
        <div className="flex min-w-0 flex-col">
          <p className={`text-[12px] font-bold uppercase ${ESTADO_COLOR[proyecto.estado]}`}>{ESTADO_LABEL[proyecto.estado]}</p>
          <p className="truncate font-bold text-[#0a142f] text-[15px]">{proyecto.titulo}</p>
          <p className="text-[13px] text-[#64748b]">
            {proyecto.cliente_nombre} · {formatMoneda(proyecto.presupuesto)}
          </p>
        </div>
      </div>
      <Link
        to={`/dashboard/creativo/proyectos/${proyecto.id}/entregar`}
        className="flex shrink-0 items-center justify-center rounded-[10px] bg-black px-4 py-2.5"
      >
        <p className="font-bold leading-normal text-white text-[13px] whitespace-nowrap">
          {proyecto.estado === "en_proceso" ? "Entregar" : "Ver entrega"}
        </p>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entregar proyecto — formulario real, sube el archivo y escribe en    */
/* la tabla entregas                                                    */
/* ------------------------------------------------------------------ */

function EntregarProyecto({ profile }: { profile: UsuarioProfile }) {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  const { proyectos, loading: loadingProyecto } = useProyectosAsignados(profile.id);
  const proyecto = useMemo(() => proyectos.find((p) => p.id === Number(proyectoId)), [proyectos, proyectoId]);

  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!proyecto) return;

    if (!descripcion.trim()) {
      setError("Cuéntale al cliente qué le estás entregando.");
      return;
    }

    setLoading(true);

    let archivoUrl: string | null = null;
    if (archivo) {
      const { url, error: uploadError } = await subirArchivoCloudinary(archivo);
      if (uploadError || !url) {
        setLoading(false);
        setError(uploadError ?? "No se pudo subir el archivo.");
        return;
      }
      archivoUrl = url;
    }

    const { entrega, error: crearError } = await crearEntrega({
      proyectoId: proyecto.id,
      creativoId: profile.id,
      descripcion: descripcion.trim(),
      archivoUrl,
    });
    setLoading(false);

    if (crearError || !entrega) {
      setError(crearError?.message ?? "No se pudo enviar la entrega.");
      return;
    }
    setEnviado(true);
  };

  if (loadingProyecto) {
    return <p className="py-10 text-center text-[13px] text-[#94a3b8]">Cargando…</p>;
  }

  if (!proyecto) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Link to="/dashboard/creativo/proyectos" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <EmptyState text="Ese proyecto no está entre tus proyectos activos." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/dashboard/creativo/proyectos" className="flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#0a142f] hover:underline">
          <ChevronLeft size={18} /> Regresar a proyectos
        </Link>
        <FlyingBees />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Entregar proyecto</p>
        <p className="text-[14px] text-[#64748b]">
          Para <span className="font-bold text-[#0a142f]">{proyecto.titulo}</span> — cliente: {proyecto.cliente_nombre}
        </p>
      </div>

      {enviado ? (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-[16px] border border-[#e2e8f0] bg-white p-8 text-center">
          <p className="font-bold text-[#0a142f] text-[18px]">¡Entrega enviada!</p>
          <p className="text-[14px] text-[#64748b]">{proyecto.cliente_nombre} ya puede ver tu entrega.</p>
          <Link to="/dashboard/creativo/proyectos" className="mt-2 flex items-center justify-center rounded-[10px] bg-black px-5 py-2.5">
            <p className="font-bold text-white text-[13px] whitespace-nowrap">Volver a proyectos activos</p>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-[560px] flex-col gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion-entrega" className="text-[14px] font-medium text-[#0a142f]">
              ¿Qué estás entregando?
            </label>
            <textarea
              id="descripcion-entrega"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe lo que estás entregando, con qué formato y cualquier nota importante…"
              className="w-full resize-none rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a142f]">Subir archivo</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] py-8 text-center hover:bg-[#f1f5f9]">
              <Upload size={20} className="text-[#64748b]" />
              <span className="px-4 text-[13px] text-[#64748b]">{archivo ? archivo.name : "Haz click para elegir un archivo (opcional)"}</span>
              <input type="file" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 disabled:opacity-60"
          >
            <p className="font-bold leading-normal text-white text-[15px]">{loading ? "Entregando…" : "Entregar proyecto"}</p>
          </button>
        </form>
      )}
    </div>
  );
}

function ProyectosActivosCreativo({ profile }: { profile: UsuarioProfile }) {
  const { proyectos, loading } = useProyectosAsignados(profile.id);

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="font-extrabold text-[#0a142f] text-[26px] sm:text-[32px]">Proyectos activos</p>

      <Panel title={`${proyectos.length} proyecto${proyectos.length === 1 ? "" : "s"}`}>
        {loading ? (
          <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
        ) : proyectos.length === 0 ? (
          <EmptyState text="Aún no tienes proyectos activos. Cuando un cliente te elija en una propuesta, va a aparecer aquí." />
        ) : (
          <div className="flex flex-col">
            {proyectos.map((p) => (
              <ProyectoAsignadoRow key={p.id} proyecto={p} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inicio (overview)                                                    */
/* ------------------------------------------------------------------ */

function Inicio({ profile }: { profile: UsuarioProfile }) {
  const { proyectos: disponibles, loading: loadingDisponibles } = useProyectosDisponibles();
  const { proyectos: activos, loading: loadingActivos } = useProyectosAsignados(profile.id);
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <BeeLogo size={64} />
        <div>
          <p className="text-[18px] text-[#64748b] sm:text-[20px]">Bienvenido de nuevo,</p>
          <p className="font-extrabold text-[#0a142f] text-[32px] sm:text-[38px]">{profile.nombre}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard label="Trabajos completados" value="0" bg="bg-[#3cb9e5]" />
        <StatCard label="Ganancias" value="L. 0" bg="bg-[#8ddaf1]" />
        <StatCard label="Calificación promedio" value="—" bg="bg-[#CBE9F4]" />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel
            title="Proyectos activos"
            action={
              <Link to="/dashboard/creativo/proyectos" className="text-[13px] font-medium text-[#0a142f] hover:underline">
                Ver todos
              </Link>
            }
          >
            {loadingActivos ? (
              <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
            ) : activos.length === 0 ? (
              <EmptyState text="Aún no tienes proyectos activos. Cuando un cliente te elija en una propuesta, va a aparecer aquí." />
            ) : (
              <div className="flex flex-col">
                {activos.slice(0, 4).map((p) => (
                  <ProyectoAsignadoRow key={p.id} proyecto={p} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Horas trabajadas esta semana">
            <WeeklyHoursChart />
          </Panel>

          <Panel
            title="Proyectos disponibles"
            action={
              <Link to="/dashboard/creativo/buscar-proyecto" className="text-[13px] font-medium text-[#0a142f] hover:underline">
                Ver más
              </Link>
            }
          >
            {loadingDisponibles ? (
              <p className="py-6 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
            ) : disponibles.length === 0 ? (
              <EmptyState text="Todavía no hay proyectos publicados para mostrar." />
            ) : (
              <div className="flex flex-col divide-y divide-[#f1f5f9]">
                {disponibles.slice(0, 2).map((p) => (
                  <ProyectoDisponibleRow key={p.id} proyecto={p} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <TodoList profile={profile} />
          <MiniCalendar />
          <div className="flex w-full flex-col gap-4 rounded-[16px] bg-[#CBE9F4] p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#0a142f] text-[16px]">Mensajes</p>
              <Link to="/dashboard/creativo/mensajes" className="text-[13px] font-medium text-[#0a142f] hover:underline">
                Ver más
              </Link>
            </div>
            <EmptyState text="No tienes mensajes todavía." />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rutas del dashboard de creativo                                      */
/* ------------------------------------------------------------------ */

export default function CreativoDashboard({ profile }: { profile: UsuarioProfile }) {
  return (
    <DashboardLayout profile={profile} navItems={NAV_ITEMS} homePath="/dashboard/creativo" configPath="/dashboard/creativo/configuracion">
      <Routes>
        <Route path="creativo" element={<Inicio profile={profile} />} />
        <Route path="creativo/buscar-proyecto" element={<BuscarProyecto />} />
        <Route path="creativo/buscar-proyecto/:proyectoId/propuesta" element={<EnviarPropuesta profile={profile} />} />
        <Route path="creativo/proyectos" element={<ProyectosActivosCreativo profile={profile} />} />
        <Route path="creativo/proyectos/:proyectoId/entregar" element={<EntregarProyecto profile={profile} />} />
        <Route path="creativo/mensajes" element={<ComingSoon title="Mensajes" icon={MessageSquare} />} />
        <Route path="creativo/portafolio" element={<ComingSoon title="Portafolio" icon={ImageIcon} />} />
        <Route path="creativo/estadisticas" element={<ComingSoon title="Estadísticas" icon={BarChart3} />} />
        <Route path="creativo/pagos" element={<ComingSoon title="Pagos y facturación" icon={Wallet} />} />
        <Route path="creativo/configuracion" element={<Configuracion profile={profile} />} />
        <Route path="*" element={<Navigate to="/dashboard/creativo" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
