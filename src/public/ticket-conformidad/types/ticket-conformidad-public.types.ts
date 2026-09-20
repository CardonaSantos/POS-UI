import { TicketConformidadPublicResultado } from "./conformidad-types.public";

export interface RegistrarFirmaTicketConformidadPayload {
  nombreFirmante: string;
  telefonoFirmante: string;
  firma: File;
}

export interface RegistrarFirmaTicketConformidadResponse {
  conformidadId: number;

  resultado: TicketConformidadPublicResultado;

  firmaId: number;
  mediaId: number;

  nombreFirmante: string;
  telefonoFirmante: string;

  firmadoEn: string;
  respondidoEn: string;

  enlaceId: number;
  usadoEn: string;
}
