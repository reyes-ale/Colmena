import { Link } from "react-router";
import { Plus } from "lucide-react";
import type { TrabajoPortafolio } from "../../lib/types";
import { Avatar } from "./DashboardUI";

function formatAnio(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 4);
}

function TrabajoCard({ trabajo, autorNombre, autorFotoUrl }: { trabajo: TrabajoPortafolio; autorNombre: string; autorFotoUrl: string | null }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white">
      <div className="flex items-center gap-2 p-4 pb-3">
        <Avatar nombre={autorNombre} fotoUrl={autorFotoUrl} size={32} />
        <div className="flex min-w-0 flex-col">
          <p className="truncate font-bold text-[#0a142f] text-[13px]">{autorNombre}</p>
          {trabajo.herramientas && <p className="truncate text-[11px] text-[#94a3b8]">{trabajo.herramientas}</p>}
        </div>
      </div>

      {trabajo.imagen_url ? (
        <img src={trabajo.imagen_url} alt={trabajo.titulo} className="h-[160px] w-full object-cover" />
      ) : (
        <div className="flex h-[160px] w-full items-center justify-center bg-[#f8fafc] text-[13px] text-[#94a3b8]">Sin imagen</div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        {trabajo.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trabajo.categorias.map((c) => (
              <span key={c} className="rounded-full bg-[#CBE9F4] px-2.5 py-0.5 text-[11px] font-bold text-[#0a142f] whitespace-nowrap">
                {c}
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="font-bold text-[#0a142f] text-[15px]">{trabajo.titulo}</p>
          {trabajo.fecha_proyecto && <p className="text-[12px] text-[#94a3b8]">{formatAnio(trabajo.fecha_proyecto)}</p>}
        </div>

        {trabajo.descripcion && <p className="line-clamp-3 text-[13px] text-[#64748b]">{trabajo.descripcion}</p>}

        <div className="mt-auto pt-2">
          {trabajo.link ? (
            <a
              href={trabajo.link}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-[10px] bg-black px-4 py-2.5"
            >
              <p className="font-bold text-white text-[13px]">Ver Proyecto</p>
            </a>
          ) : (
            <span className="flex w-full items-center justify-center rounded-[10px] border border-[#e2e8f0] px-4 py-2.5">
              <p className="font-medium text-[#94a3b8] text-[13px]">Sin link</p>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AgregarProyectoCard({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9]"
    >
      <div className="flex size-12 items-center justify-center rounded-full border-2 border-[#0a142f]">
        <Plus size={22} className="text-[#0a142f]" />
      </div>
      <p className="font-bold text-[#0a142f] text-[15px]">Agregar Proyecto</p>
    </Link>
  );
}

/** Grid de portafolio — reutilizado por el dashboard del Creativo (con
 * "Agregar Proyecto") y por la vista que ve un Cliente (sin ese botón). */
export function PortafolioGrid({
  trabajos,
  autorNombre,
  autorFotoUrl,
  agregarTo,
}: {
  trabajos: TrabajoPortafolio[];
  autorNombre: string;
  autorFotoUrl: string | null;
  agregarTo?: string;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {trabajos.map((t) => (
        <TrabajoCard key={t.id} trabajo={t} autorNombre={autorNombre} autorFotoUrl={autorFotoUrl} />
      ))}
      {agregarTo && <AgregarProyectoCard to={agregarTo} />}
    </div>
  );
}
