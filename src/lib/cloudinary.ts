const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function subirACloudinary(file: File, resourceType: "image" | "auto"): Promise<{ url: string | null; error: string | null }> {
  if (!cloudName || !uploadPreset) {
    return {
      url: null,
      error: "Cloudinary no está configurado — faltan VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET en el .env.",
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      return { url: null, error: data?.error?.message ?? "No se pudo subir el archivo." };
    }
    return { url: data.secure_url as string, error: null };
  } catch {
    return { url: null, error: "Error de red al subir el archivo." };
  }
}

/** Sube una imagen (fotos de perfil) usando un "unsigned upload preset" —
 * el único método pensado para subir directo desde el navegador sin
 * exponer el API Secret. Devuelve la URL pública (secure_url). */
export function subirImagenCloudinary(file: File) {
  return subirACloudinary(file, "image");
}

/** Sube cualquier archivo (CV en PDF/Word, etc.) — usa el endpoint "auto"
 * de Cloudinary, que detecta el tipo de recurso solo. Requiere el mismo
 * upload preset unsigned. Nota: Cloudinary bloquea por defecto la entrega
 * de PDF/ZIP por seguridad — si el link del CV da error, hay que
 * habilitarlo en Settings → Security → "Allow delivery of PDF and ZIP files". */
export function subirArchivoCloudinary(file: File) {
  return subirACloudinary(file, "auto");
}
