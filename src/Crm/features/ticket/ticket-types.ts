import {
  EstadoTicketSoporte,
  PrioridadTicketSoporte,
} from "../dashboard/dashboard-tickets";

export interface ComentarioSeguimientoDto {
  ticketId: number | null;
  usuarioId: number | null;
  descripcion: string;
}

export interface updateTicketDto {
  title: string;
  description: string | null;
  priority: PrioridadTicketSoporte;
  status: EstadoTicketSoporte;
  fixed: boolean;
  clienteId: number | null;
  tecnicoId: number | null;
  tecnicosAdicionales: number[];
  tags: number[];
}
