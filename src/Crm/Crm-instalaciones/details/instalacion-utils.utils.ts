// instalacion-detail.utils.ts

import type { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";

export type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const currencyFormatter = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  minimumFractionDigits: 2,
});

const auditDateFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Guatemala",
});

const businessDateFormatter = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Para campos introducidos desde un date picker.
 * Evita que 2026-07-11T00:00:00.000Z aparezca como 10/07/2026
 * por la diferencia horaria de Guatemala.
 */
export function formatBusinessDate(value: string | null): string {
  if (!value) {
    return "Sin registrar";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return businessDateFormatter.format(date);
}

/**
 * Para marcas reales de auditoría como creadoEn y actualizadoEn.
 */
export function formatAuditDate(value: string | null): string {
  if (!value) {
    return "Sin registrar";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return auditDateFormatter.format(date);
}

export function formatBytes(value: string | null): string {
  if (!value) {
    return "Tamaño no disponible";
  }

  const bytes = Number(value);

  if (!Number.isFinite(bytes) || bytes < 0) {
    return "Tamaño no disponible";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

export function getEstadoToneInstalacion(
  estado: EstadoInstalacionCliente,
): AppBadgeTone {
  if (estado === EstadoInstalacionCliente.PROGRAMADA) {
    return "info";
  }

  if (estado === EstadoInstalacionCliente.REPROGRAMADA) {
    return "warning";
  }

  if (estado === EstadoInstalacionCliente.EN_PROCESO) {
    return "primary";
  }

  if (estado === EstadoInstalacionCliente.COMPLETADA) {
    return "success";
  }

  if (
    estado === EstadoInstalacionCliente.CANCELADA ||
    estado === EstadoInstalacionCliente.FALLIDA
  ) {
    return "danger";
  }

  return "neutral";
}

export function getClienteNombre(
  instalacion: ClienteInstalacionDetalle,
): string {
  return [instalacion.cliente.nombre, instalacion.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

export function getTotalCostos(instalacion: ClienteInstalacionDetalle): number {
  return (
    instalacion.costos.costoInstalacion +
    instalacion.costos.costoMateriales +
    instalacion.costos.costoManoObra +
    instalacion.costos.costoOtros
  );
}

export function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getGoogleMapsUrl(latitud: number, longitud: number): string {
  return `https://www.google.com/maps?q=${latitud},${longitud}`;
}
