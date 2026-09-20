import { TicketConformidadPublicResultado } from "@/public/ticket-conformidad/types/conformidad-types.public";

export interface CrearTicketConformidadResponse {
  props: {
    id: number;
    ticketId: number;
    clienteId: number | null;
    tecnicoAsignadoId: number | null;
    creadoPorId: number;

    resultado: TicketConformidadPublicResultado;

    creadoEn: string;
    actualizadoEn: string;
    respondidoEn: string | null;
  };
}
