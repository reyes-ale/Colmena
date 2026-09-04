import { useState } from "react";
import type { FormEvent } from "react";
import { Star } from "lucide-react";
import { crearResena } from "../../lib/resenas";
import { Avatar } from "./DashboardUI";

export default function ValoracionModal({
  proyectoId,
  proyectoTitulo,
  creativoId,
  creativoNombre,
  creativoFotoUrl,
  clienteId,
  onClose,
  onEnviada,
}: {
  proyectoId: number;
  proyectoTitulo: string;
  creativoId: number;
  creativoNombre: string;
  creativoFotoUrl: string | null;
  clienteId: number;
  onClose: () => void;
  onEnviada: () => void;
}) {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (calificacion < 1) {
      setError("Selecciona cuántas estrellas quieres darle.");
      return;
    }

    setLoading(true);
    const { resena, error: err } = await crearResena({
      proyectoId,
      clienteId,
      creativoId,
      calificacion,
      comentario: comentario.trim(),
    });
    setLoading(false);

    if (err || !resena) {
      setError(err?.message ?? "No se pudo enviar tu valoración.");
      return;
    }
    onEnviada();
  };

  const activo = hover || calificacion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-y-auto rounded-[16px] bg-white p-6 sm:p-8">
        <p className="font-extrabold text-[#0a142f] text-[24px] sm:text-[26px]">¡Proyecto completado!</p>
        <p className="mt-2 text-[14px] text-[#64748b]">
          Tu proyecto ha finalizado, ayúdanos a construir una comunidad de confianza dejando tu valoración
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5 rounded-[16px] border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4">
            <Avatar nombre={creativoNombre} fotoUrl={creativoFotoUrl} size={56} />
            <div className="flex min-w-0 flex-col">
              <p className="truncate font-bold text-[#0a142f] text-[15px]">{proyectoTitulo}</p>
              <p className="text-[13px] text-[#64748b]">{creativoNombre}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium text-[#0a142f]">Califica su servicio</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrellas`}
                  onClick={() => setCalificacion(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-0.5"
                >
                  <Star size={26} className={activo >= n ? "fill-[#ffb53e] text-[#ffb53e]" : "text-[#cbd5e1]"} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="comentario-resena" className="text-[14px] font-medium text-[#0a142f]">
              Cuéntanos brevemente sobre tu experiencia
            </label>
            <textarea
              id="comentario-resena"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full resize-none rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
            />
          </div>

          {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 disabled:opacity-60"
          >
            <p className="font-bold leading-normal text-white text-[15px]">{loading ? "Enviando…" : "Enviar valoración"}</p>
          </button>
        </form>
      </div>
    </div>
  );
}
