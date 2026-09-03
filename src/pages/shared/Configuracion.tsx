import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { actualizarUsuario } from "../../lib/auth";
import { subirImagenCloudinary } from "../../lib/cloudinary";
import type { UsuarioProfile } from "../../lib/types";
import { Avatar, Panel } from "./DashboardUI";

function rolLabel(profile: UsuarioProfile) {
  if (profile.rol === "creativo") return "Creativo";
  return profile.tipo_cliente === "empresa" ? "Cliente · Empresa" : "Cliente · Persona natural";
}

export default function Configuracion({ profile }: { profile: UsuarioProfile }) {
  const { setProfile } = useAuth();
  const [nombre, setNombre] = useState(profile.nombre);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    let fotoUrl = profile.foto_url;

    if (file) {
      const { url, error: uploadError } = await subirImagenCloudinary(file);
      if (uploadError || !url) {
        setSaving(false);
        setError(uploadError ?? "No se pudo subir la imagen.");
        return;
      }
      fotoUrl = url;
    }

    const { profile: updated, error: updateError } = await actualizarUsuario(profile.id, nombre.trim(), fotoUrl);
    setSaving(false);

    if (updateError || !updated) {
      setError(updateError?.message ?? "No se pudo guardar.");
      return;
    }
    setProfile(updated);
    setFile(null);
    setMessage("Cambios guardados.");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="font-extrabold text-[#0a142f] text-[22px]">Configuración</p>

      <form onSubmit={handleSave} className="flex w-full flex-col gap-6">
        <Panel title="Foto de perfil">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar nombre={nombre} fotoUrl={preview ?? profile.foto_url} size={72} />
            <div className="flex flex-col gap-2">
              <p className="max-w-[420px] text-[14px] text-[#475569]">
                Elige la imagen que quieras usar. Se sube a Cloudinary y se guarda cuando le des a "Guardar cambios".
              </p>
              <label className="w-fit cursor-pointer rounded-[8px] border border-[#e2e8f0] px-3 py-1.5 text-[13px] font-medium text-[#0a142f] hover:bg-[#f3f4f6]">
                Elegir imagen
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
        </Panel>

        <Panel title="Datos de la cuenta">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-[14px] font-medium text-[#0a142f]">
                Nombre
              </label>
              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full max-w-[420px] rounded-[8px] border border-[#e2e8f0] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffb53e]"
              />
            </div>

            <dl className="flex flex-col gap-3 text-[14px]">
              <div className="flex justify-between border-b border-dashed border-[#e2e8f0] pb-2">
                <dt className="text-[#64748b]">Correo</dt>
                <dd className="font-medium text-[#0a142f]">{profile.correo}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#64748b]">Tipo de cuenta</dt>
                <dd className="font-medium text-[#0a142f]">{rolLabel(profile)}</dd>
              </div>
            </dl>
          </div>
        </Panel>

        {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}
        {message && <p className="text-[14px] font-medium text-[#16a34a]">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex w-fit items-center justify-center rounded-[12px] bg-black px-7 py-3 disabled:opacity-60"
        >
          <p className="font-bold leading-normal text-white text-[14px] whitespace-nowrap">{saving ? (file ? "Subiendo imagen…" : "Guardando…") : "Guardar cambios"}</p>
        </button>
      </form>
    </div>
  );
}
