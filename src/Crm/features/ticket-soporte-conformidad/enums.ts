/* =========================================================
 * ENUMS
 * ======================================================= */

export enum TicketConformidadResultado {
  PENDIENTE = "PENDIENTE",
  CONFORME = "CONFORME",
  REQUIERE_RETRABAJO = "REQUIERE_RETRABAJO",
}

export enum TicketConformidadCanal {
  LINK = "LINK",
  QR = "QR",
  WHATSAPP = "WHATSAPP",
}

export enum TicketConformidadEnlaceEstado {
  ACTIVO = "ACTIVO",
  USADO = "USADO",
  EXPIRADO = "EXPIRADO",
  REVOCADO = "REVOCADO",
}

export enum TicketFirmaTipo {
  CLIENTE = "CLIENTE",
  TECNICO = "TECNICO",
}

export enum TicketFirmaOrigen {
  CRM = "CRM",
  PUBLICO = "PUBLICO",
}

/**
 * Estado exclusivamente de UI.
 *
 * NONE representa que el GET de conformidad actual
 * devolvió 404 porque todavía no existe un ciclo.
 */
export enum TicketConformidadDialogState {
  NONE = "NONE",
  PENDIENTE = "PENDIENTE",
  CONFORME = "CONFORME",
  REQUIERE_RETRABAJO = "REQUIERE_RETRABAJO",
}
