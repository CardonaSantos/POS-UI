import {
  TicketConformidadDialogState,
  TicketConformidadEnlaceEstado,
  TicketConformidadResultado,
  TicketFirmaTipo,
} from "@/Crm/features/ticket-soporte-conformidad/enums";
import {
  TicketConformidadDetalle,
  TicketConformidadEnlace,
} from "@/Crm/features/ticket-soporte-conformidad/ticket-soporte-conformidad.types";
import axios from "axios";

export function isConformidadNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export function getConformidadDialogState(
  conformidad: TicketConformidadDetalle | undefined,
  error: unknown,
): TicketConformidadDialogState {
  if (!conformidad && isConformidadNotFoundError(error)) {
    return TicketConformidadDialogState.NONE;
  }

  if (!conformidad) {
    return TicketConformidadDialogState.NONE;
  }

  switch (conformidad.resultado) {
    case TicketConformidadResultado.PENDIENTE:
      return TicketConformidadDialogState.PENDIENTE;

    case TicketConformidadResultado.CONFORME:
      return TicketConformidadDialogState.CONFORME;

    case TicketConformidadResultado.REQUIERE_RETRABAJO:
      return TicketConformidadDialogState.REQUIERE_RETRABAJO;
  }
}

export function getUltimoEnlace(
  conformidad: TicketConformidadDetalle,
): TicketConformidadEnlace | null {
  if (conformidad.enlaces.length === 0) {
    return null;
  }

  return conformidad.enlaces[conformidad.enlaces.length - 1] ?? null;
}

export function enlaceEstaExpirado(
  enlace: TicketConformidadEnlace | null,
): boolean {
  if (!enlace) {
    return false;
  }

  return enlace.estadoDerivado === TicketConformidadEnlaceEstado.EXPIRADO;
}

export function getFirmaCliente(conformidad: TicketConformidadDetalle) {
  return (
    conformidad.firmas.find(
      (firma) => firma.tipo === TicketFirmaTipo.CLIENTE,
    ) ?? null
  );
}

// constructor de enlace
export function buildPublicConformidadUrl(token: string): string {
  const configuredBase = import.meta.env.VITE_PUBLIC_APP_URL?.trim();

  const baseUrl = (configuredBase || window.location.origin).replace(
    /\/+$/,
    "",
  );

  return `${baseUrl}/conformidad/${encodeURIComponent(token)}`;
}
