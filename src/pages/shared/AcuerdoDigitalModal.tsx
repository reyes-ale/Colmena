import { useState } from "react";
import { X, Download } from "lucide-react";
import { descargarAcuerdoDigitalPdf } from "../../lib/acuerdoPdf";
import { ACUERDO_CIERRE, ACUERDO_INTRO, ACUERDO_SECCIONES, ACUERDO_SUBTITULO, ACUERDO_TITULO } from "./acuerdoDigital";
import { BeeLogo } from "./DashboardUI";

export default function AcuerdoDigitalModal({ onClose }: { onClose: () => void }) {
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    setDescargando(true);
    try {
      await descargarAcuerdoDigitalPdf();
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative flex max-h-[85vh] w-full max-w-[680px] flex-col overflow-hidden rounded-[16px] bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-[#e2e8f0] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BeeLogo size={26} />
            <p className="font-extrabold text-[#0a142f] text-[16px]">Colmena</p>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="flex size-8 items-center justify-center rounded-[8px] hover:bg-[#f3f4f6]">
            <X size={18} className="text-[#475569]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <p className="font-extrabold text-[#0a142f] text-[22px]">{ACUERDO_TITULO}</p>
          <p className="mt-1 text-[13px] italic text-[#64748b]">{ACUERDO_SUBTITULO}</p>

          <p className="mt-5 text-[14px] leading-relaxed text-[#475569]">{ACUERDO_INTRO}</p>

          <div className="mt-5 flex flex-col gap-5">
            {ACUERDO_SECCIONES.map((seccion) => (
              <div key={seccion.titulo} className="flex flex-col gap-1.5">
                <p className="font-bold text-[#0a142f] text-[15px]">{seccion.titulo}</p>
                <p className="text-[14px] leading-relaxed text-[#475569]">{seccion.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t-2 border-[#ffb53e] pt-4">
            <p className="text-[13px] font-bold italic text-[#0a142f]">{ACUERDO_CIERRE}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e2e8f0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDescargar}
            disabled={descargando}
            className="flex items-center justify-center gap-2 rounded-[10px] border border-[#e2e8f0] px-4 py-2.5 disabled:opacity-60"
          >
            <Download size={16} className="text-[#0a142f]" />
            <p className="font-medium text-[#0a142f] text-[13px] whitespace-nowrap">{descargando ? "Generando…" : "Descargar PDF"}</p>
          </button>
          <button type="button" onClick={onClose} className="flex items-center justify-center rounded-[10px] bg-black px-5 py-2.5">
            <p className="font-bold text-white text-[13px] whitespace-nowrap">Cerrar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
