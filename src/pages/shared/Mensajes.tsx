import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Send } from "lucide-react";
import type { Conversacion, Mensaje, UsuarioProfile } from "../../lib/types";
import { listarConversaciones, listarMensajes, enviarMensaje, marcarConversacionLeida } from "../../lib/mensajes";
import { Avatar, EmptyState } from "./DashboardUI";

function useConversaciones(usuarioId: number) {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    listarConversaciones(usuarioId).then((data) => {
      if (active) {
        setConversaciones(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [usuarioId, version]);

  return { conversaciones, loading, refresh: () => setVersion((v) => v + 1) };
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleString("es-HN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Bandeja de Mensajes — compartida entre Cliente y Creativo. `basePath`
 * es la ruta de "Mensajes" de cada dashboard (…/cliente/mensajes o
 * …/creativo/mensajes); las conversaciones viven en …/mensajes/:id. */
export default function Mensajes({ profile, basePath }: { profile: UsuarioProfile; basePath: string }) {
  const { conversacionId } = useParams();
  const { conversaciones, loading: loadingConversaciones, refresh: refreshConversaciones } = useConversaciones(profile.id);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const idActivo = conversacionId ? Number(conversacionId) : null;
  const activa = conversaciones.find((c) => c.id === idActivo) ?? null;

  useEffect(() => {
    if (!idActivo) {
      setMensajes([]);
      return;
    }
    let active = true;
    setLoadingMensajes(true);
    listarMensajes(idActivo, profile.id).then((data) => {
      if (!active) return;
      setMensajes(data);
      setLoadingMensajes(false);
      marcarConversacionLeida(idActivo, profile.id).then(() => {
        if (active) refreshConversaciones();
      });
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idActivo, profile.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

  const handleEnviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!idActivo || !texto.trim()) return;
    setError(null);
    setEnviando(true);
    const { mensaje, error: sendError } = await enviarMensaje(idActivo, profile.id, texto.trim());
    setEnviando(false);

    if (sendError || !mensaje) {
      setError(sendError?.message ?? "No se pudo enviar el mensaje.");
      return;
    }
    setMensajes((prev) => [...prev, mensaje]);
    setTexto("");
    refreshConversaciones();
  };

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[480px] w-full gap-6">
      <div
        className={`w-full flex-col rounded-[16px] border border-[#e2e8f0] bg-white sm:flex sm:w-[320px] sm:shrink-0 ${
          idActivo ? "hidden" : "flex"
        }`}
      >
        <p className="border-b border-[#e2e8f0] p-4 font-bold text-[#0a142f] text-[16px]">Mensajes</p>
        <div className="flex-1 overflow-y-auto">
          {loadingConversaciones ? (
            <p className="py-8 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
          ) : conversaciones.length === 0 ? (
            <div className="p-4">
              <EmptyState text="No tienes conversaciones todavía." />
            </div>
          ) : (
            conversaciones.map((c) => (
              <Link
                key={c.id}
                to={`${basePath}/${c.id}`}
                className={`flex items-center gap-3 border-b border-[#f1f5f9] px-4 py-3 hover:bg-[#f8fafc] ${
                  c.id === idActivo ? "bg-[#f8fafc]" : ""
                }`}
              >
                <Avatar nombre={c.otro_nombre} fotoUrl={c.otro_foto_url} size={44} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate font-bold text-[#0a142f] text-[14px]">{c.otro_nombre}</p>
                  <p className="truncate text-[13px] text-[#64748b]">{c.ultimo_mensaje ?? "Sin mensajes todavía"}</p>
                </div>
                {c.no_leidos > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ffb53e] text-[11px] font-bold text-[#0a142f]">
                    {c.no_leidos}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      <div className={`w-full flex-1 flex-col rounded-[16px] border border-[#e2e8f0] bg-white sm:flex ${idActivo ? "flex" : "hidden"}`}>
        {!activa ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[14px] text-[#94a3b8]">Elige una conversación para empezar.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] p-4">
              <Link to={basePath} aria-label="Regresar" className="flex size-8 items-center justify-center rounded-[8px] hover:bg-[#f3f4f6] sm:hidden">
                <ChevronLeft size={18} />
              </Link>
              <Avatar nombre={activa.otro_nombre} fotoUrl={activa.otro_foto_url} size={36} />
              <p className="font-bold text-[#0a142f] text-[15px]">{activa.otro_nombre}</p>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
              {loadingMensajes ? (
                <p className="py-8 text-center text-[13px] text-[#94a3b8]">Cargando…</p>
              ) : mensajes.length === 0 ? (
                <EmptyState text="Todavía no hay mensajes — escribe el primero." />
              ) : (
                mensajes.map((m) => {
                  const esMio = m.autor_id === profile.id;
                  return (
                    <div key={m.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-[14px] px-4 py-2.5 text-[14px] ${
                          esMio ? "bg-black text-white" : "bg-[#f1f5f9] text-[#0a142f]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.texto}</p>
                        <p className={`mt-1 text-[11px] ${esMio ? "text-white/60" : "text-[#94a3b8]"}`}>{formatHora(m.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {error && <p className="px-4 text-[13px] font-medium text-[#d4183d]">{error}</p>}

            <form onSubmit={handleEnviar} className="flex items-center gap-2 border-t border-[#e2e8f0] p-4">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe un mensaje…"
                className="w-full rounded-[10px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
              />
              <button
                type="submit"
                disabled={enviando || !texto.trim()}
                aria-label="Enviar"
                className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-black disabled:opacity-60"
              >
                <Send size={16} className="text-white" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
