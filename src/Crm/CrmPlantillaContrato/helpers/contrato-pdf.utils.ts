import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export type PdfPaper = "letter" | "halfLetter";

export interface PdfPaperDef {
  label: string;
  fileLabel: string;
  widthMm: number;
  heightMm: number;
}

export const PDF_PAPER_DEFS: Record<PdfPaper, PdfPaperDef> = {
  letter: {
    label: "Carta",
    fileLabel: "Carta",
    widthMm: 215.9,
    heightMm: 279.4,
  },

  halfLetter: {
    label: "Media carta",
    fileLabel: "Media_Carta",
    widthMm: 139.7,
    heightMm: 215.9,
  },
};

export function normalizePaperParam(value: string | null): PdfPaper {
  const normalized = value?.toLowerCase().trim();

  if (
    normalized === "half" ||
    normalized === "half-letter" ||
    normalized === "media" ||
    normalized === "media-carta" ||
    normalized === "mediacarta"
  ) {
    return "halfLetter";
  }

  return "letter";
}

/**
 * Para fechas DateTime reales.
 */
export function formatDate(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  return dayjs(value).format("DD/MM/YYYY");
}

export function formatCurrency(amount: number | null): string {
  if (amount === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(amount);
}

export interface ContratoTextBlock {
  type: "section" | "subsection" | "paragraph";

  text: string;
}

/**
 * Convierte el texto plano de la plantilla
 * en bloques visualmente legibles.
 */
export function parseContratoContenido(contenido: string): ContratoTextBlock[] {
  if (!contenido.trim()) {
    return [];
  }

  const result: ContratoTextBlock[] = [];

  const chunks = contenido
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      /**
       * 1. OBJETO DEL CONTRATO:
       * 2. PLAZO...
       */
      if (/^\d+\.\s+[A-ZÁÉÍÓÚÜÑ].*:?$/.test(line)) {
        result.push({
          type: "section",
          text: line,
        });

        continue;
      }

      /**
       * 2.1. Plazo inicial mínimo:
       */
      if (/^\d+\.\d+\.?\s+.+:?$/.test(line)) {
        result.push({
          type: "subsection",
          text: line,
        });

        continue;
      }

      result.push({
        type: "paragraph",
        text: line,
      });
    }
  }

  return result;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

export async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.onload = () => resolve();

          image.onerror = () => resolve();
        }),
    ),
  );
}
