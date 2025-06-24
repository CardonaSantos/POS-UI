// src/interfaces/ticket.ts

export interface FormattedTicket {
  id: number;
  title: string;
  openedAt: string;
  status: EstadoTicketSoporte;
  priority: "BAJA" | "MEDIA" | "ALTA";
  description: string;
  direction: string;
  clientName: string;
  clientPhone: string | null;
  referenceContact: string | null;
  clientId: number;

  location: {
    lat: number;
    lng: number;
  };
}
export enum EstadoTicketSoporte {
  NUEVO = "NUEVO",
  ABIERTA = "ABIERTA",
  EN_PROCESO = "EN_PROCESO",
  PENDIENTE = "PENDIENTE",
  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",
  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",
  RESUELTA = "RESUELTA",
  CANCELADA = "CANCELADA",
  ARCHIVADA = "ARCHIVADA",
}
