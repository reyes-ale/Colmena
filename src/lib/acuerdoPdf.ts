import imgColmenaLogo from "../imports/ColmenaLanding/41ac45f8c7521b60c25adadf954c316d83f63029.png";
import { ACUERDO_CIERRE, ACUERDO_INTRO, ACUERDO_SECCIONES, ACUERDO_SUBTITULO, ACUERDO_TITULO } from "../pages/shared/acuerdoDigital";

// Colores de marca Colmena.
const NAVY = "#0a142f";
const ORANGE = "#ffb53e";
const GRAY = "#475569";

/** El logo de Colmena en este proyecto es un recorte de un sprite más
 * grande (se hace con CSS en toda la app — ver BeeLogo en
 * shared/DashboardUI.tsx). Para meterlo en el PDF replicamos el mismo
 * recorte, pero dibujando en un <canvas> para obtener un PNG real. */
function recortarLogo(anchoPx: number, altoPx: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = anchoPx;
      canvas.height = altoPx;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo preparar el logo."));
        return;
      }
      const drawW = anchoPx * 7.891;
      const drawH = altoPx * 4.6455;
      const drawX = -anchoPx * 1.7523;
      const drawY = -altoPx * 1.9361;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("No se pudo cargar el logo."));
    img.src = imgColmenaLogo;
  });
}

/** Genera el PDF del Acuerdo Digital y dispara la descarga en el navegador.
 * jsPDF se carga solo cuando se llama esto (no en el bundle inicial) — la
 * mayoría de los usuarios nunca descarga el PDF, así que no tiene sentido
 * que todos paguen ese peso desde el primer render. */
export async function descargarAcuerdoDigitalPdf() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const marginBottom = 20;
  const maxWidth = pageWidth - marginX * 2;
  let y = 20;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = 20;
    }
  };

  // --- Encabezado: logo + "Colmena" ---
  try {
    const logoDataUrl = await recortarLogo(160, 188);
    const logoH = 12;
    const logoW = logoH * (160 / 188);
    doc.addImage(logoDataUrl, "PNG", marginX, y, logoW, logoH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(NAVY);
    doc.text("Colmena", marginX + logoW + 4, y + logoH - 2.5);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(NAVY);
    doc.text("Colmena", marginX, y + 8);
  }
  y += 18;

  doc.setDrawColor(ORANGE);
  doc.setLineWidth(1);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 12;

  // --- Título ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(NAVY);
  doc.text(ACUERDO_TITULO, pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(GRAY);
  doc.text(ACUERDO_SUBTITULO, pageWidth / 2, y, { align: "center" });
  y += 12;

  // --- Intro ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(GRAY);
  for (const line of doc.splitTextToSize(ACUERDO_INTRO, maxWidth)) {
    ensureSpace(6);
    doc.text(line, marginX, y);
    y += 5.5;
  }
  y += 4;

  // --- Secciones ---
  for (const seccion of ACUERDO_SECCIONES) {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(NAVY);
    doc.text(seccion.titulo, marginX, y);
    y += 6.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(GRAY);
    for (const line of doc.splitTextToSize(seccion.texto, maxWidth)) {
      ensureSpace(6);
      doc.text(line, marginX, y);
      y += 5.5;
    }
    y += 5;
  }

  // --- Cierre ---
  ensureSpace(20);
  doc.setDrawColor(ORANGE);
  doc.setLineWidth(0.6);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY);
  for (const line of doc.splitTextToSize(ACUERDO_CIERRE, maxWidth)) {
    ensureSpace(6);
    doc.text(line, marginX, y);
    y += 5.5;
  }

  const fecha = new Date().toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  ensureSpace(10);
  y += 4;
  doc.text(`Documento generado en Colmena el ${fecha}.`, marginX, y);

  doc.save("acuerdo-digital-colmena.pdf");
}
