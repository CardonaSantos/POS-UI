import type { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
export type SupportUtilityTab = "TicketTags" | "soluciones";

export interface TagTicketFormState {
  nombre: string;
}

export interface TagTicketStats {
  totalEtiquetas: number;
  totalTickets: number;
}

export function createEmptyTagForm(): TagTicketFormState {
  return {
    nombre: "",
  };
}

export function normalizeTagsResponse(value: unknown): EtiquetaTicket[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as EtiquetaTicket[];
    if (Array.isArray(record.items)) return record.items as EtiquetaTicket[];
    if (Array.isArray(record.tags)) return record.tags as EtiquetaTicket[];
    if (Array.isArray(record.etiquetas))
      return record.etiquetas as EtiquetaTicket[];
  }

  return [];
}

export function getTagTicketStats(etiquetas: EtiquetaTicket[]): TagTicketStats {
  return etiquetas.reduce<TagTicketStats>(
    (acc, etiqueta) => {
      acc.totalEtiquetas += 1;
      acc.totalTickets += Number(
        etiqueta.ticketsCount ?? etiqueta.tickets ?? 0,
      );

      return acc;
    },
    {
      totalEtiquetas: 0,
      totalTickets: 0,
    },
  );
}

export function filterEtiquetas(
  etiquetas: EtiquetaTicket[],
  search: string,
): EtiquetaTicket[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) return etiquetas;

  return etiquetas.filter((etiqueta) =>
    etiqueta.nombre.toLowerCase().includes(normalizedSearch),
  );
}

export function validateTagName(
  etiquetas: EtiquetaTicket[],
  nombre: string,
  excludeId?: number,
): string | null {
  const cleanName = nombre.trim();

  if (!cleanName) {
    return "El nombre de la etiqueta no puede estar vacío.";
  }

  const alreadyExists = etiquetas.some(
    (etiqueta) =>
      etiqueta.id !== excludeId &&
      etiqueta.nombre.trim().toLowerCase() === cleanName.toLowerCase(),
  );

  if (alreadyExists) {
    return "Ya existe una etiqueta con este nombre.";
  }

  return null;
}

// OTROS

export function getEtiquetaTicketCount(etiqueta: EtiquetaTicket) {
  return Number(etiqueta.ticketsCount ?? etiqueta.tickets ?? 0);
}

export function getEtiquetaToneById(id: number) {
  const tones = [
    "danger",
    "primary",
    "success",
    "warning",
    "info",
    "neutral",
  ] as const;

  return tones[Math.abs(id) % tones.length];
}
