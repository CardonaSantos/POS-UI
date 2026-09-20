export enum TicketConformidadPublicResultado {
  PENDIENTE = "PENDIENTE",
  CONFORME = "CONFORME",
  REQUIERE_RETRABAJO = "REQUIERE_RETRABAJO",
}

export interface TicketConformidadPublicTicket {
  id: number;

  titulo: string | null;

  descripcion: string | null;

  fechaApertura: string;

  fechaResolucionTecnico: string | null;
}

export interface TicketConformidadPublicCliente {
  nombreCompleto: string;

  telefono: string | null;
}

export interface TicketConformidadPublicTecnico {
  nombre: string;
}

export interface TicketConformidadPublicEstado {
  resultado: TicketConformidadPublicResultado;

  creadoEn: string;

  expiraEn: string;
}

export interface TicketConformidadPublicResponse {
  ticket: TicketConformidadPublicTicket;

  cliente: TicketConformidadPublicCliente | null;

  tecnico: TicketConformidadPublicTecnico | null;

  conformidad: TicketConformidadPublicEstado;
}

export enum TicketConformidadPublicStep {
  DECISION = "DECISION",
  FIRMA = "FIRMA",
  CONFIRMAR_RETRABAJO = "CONFIRMAR_RETRABAJO",
  FINAL_CONFORME = "FINAL_CONFORME",
  FINAL_RETRABAJO = "FINAL_RETRABAJO",
}
