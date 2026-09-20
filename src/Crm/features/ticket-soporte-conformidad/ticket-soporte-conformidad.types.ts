/* =========================================================
 * CREAR CONFORMIDAD
 * ======================================================= */

import {
  TicketConformidadCanal,
  TicketConformidadEnlaceEstado,
  TicketConformidadResultado,
  TicketFirmaOrigen,
  TicketFirmaTipo,
} from "./enums";

export interface TicketConformidadEntityPropsResponse {
  id: number;

  ticketId: number;

  clienteId: number | null;

  tecnicoAsignadoId: number | null;

  creadoPorId: number | null;

  resultado: TicketConformidadResultado;

  creadoEn: string;

  actualizadoEn: string;

  respondidoEn: string | null;
}

/**
 * Actualmente el backend serializa directamente la Entity,
 * por eso recibimos { props: {...} }.
 *
 * Cuando posteriormente coloquemos un presenter backend,
 * esta interfaz será la única que habrá que ajustar.
 */
export interface CrearTicketConformidadResponse {
  props: TicketConformidadEntityPropsResponse;
}

/* =========================================================
 * GENERAR ENLACE
 * ======================================================= */

export interface GenerarEnlaceTicketConformidadPayload {
  canal: TicketConformidadCanal;

  telefonoDestino?: string | null;
}

export interface GenerarEnlaceTicketConformidadResponse {
  enlaceId: number;

  conformidadId: number;

  /**
   * Token plano.
   *
   * Sólo aparece en el momento de creación.
   * El backend persiste únicamente tokenHash.
   */
  token: string;

  canal: TicketConformidadCanal;

  telefonoDestino: string | null;

  expiraEn: string;

  creadoEn: string;
}

/* =========================================================
 * USUARIO
 * ======================================================= */

export interface TicketConformidadUsuario {
  id: number;

  empresaId: number;

  nombre: string;

  correo: string;

  telefono: string | null;

  rol: string;

  activo: boolean;
}

/* =========================================================
 * CLIENTE
 * ======================================================= */

export interface TicketConformidadCliente {
  id: number;

  empresaId: number | null;

  nombre: string;

  apellidos: string | null;

  nombreCompleto: string;

  telefono: string | null;

  direccion: string | null;
}

/* =========================================================
 * MEDIA
 * ======================================================= */

export interface TicketConformidadFirmaMedia {
  id: number;

  empresaId: number;

  clienteId: number | null;

  categoria: string;

  tipo: string;

  estado: string;

  bucket: string | null;

  key: string;

  cdnUrl: string | null;

  mimeType: string | null;

  extension: string | null;

  tamanioBytes: string | null;

  titulo: string | null;

  descripcion: string | null;

  publico: boolean;

  creadoEn: string;
}

/* =========================================================
 * FIRMA
 * ======================================================= */

export interface TicketConformidadFirma {
  id: number;

  conformidadId: number;

  mediaId: number;

  tipo: TicketFirmaTipo;

  usuarioFirmanteId: number | null;

  nombreFirmante: string;

  telefonoFirmante: string | null;

  origen: TicketFirmaOrigen;

  ipOrigen: string | null;

  userAgent: string | null;

  firmadoEn: string;

  usuarioFirmante: TicketConformidadUsuario | null;

  media: TicketConformidadFirmaMedia;
}

/* =========================================================
 * ENLACE
 * ======================================================= */

export interface TicketConformidadEnlace {
  id: number;

  conformidadId: number;

  canal: TicketConformidadCanal;

  telefonoDestino: string | null;

  expiraEn: string;

  usadoEn: string | null;

  revocadoEn: string | null;

  creadoPorId: number | null;

  creadoEn: string;

  estadoDerivado: TicketConformidadEnlaceEstado;
}

/* =========================================================
 * TICKET
 * ======================================================= */

export interface TicketConformidadTicket {
  id: number;

  clienteId: number | null;

  empresaId: number | null;

  tecnicoId: number | null;

  creadoPorId: number | null;

  estado: string;

  prioridad: string;

  titulo: string | null;

  descripcion: string | null;

  fechaApertura: string;

  fechaAsignacion: string | null;

  fechaInicioAtencion: string | null;

  fechaResolucionTecnico: string | null;

  fechaCierre: string | null;
}

/* =========================================================
 * RESUMEN
 * ======================================================= */

export interface TicketConformidadResumen {
  tieneFirmaCliente: boolean;

  tieneFirmaTecnico: boolean;

  firmaClienteEn: string | null;

  firmaTecnicoEn: string | null;

  cantidadFirmas: number;

  cantidadEnlaces: number;

  cantidadEnlacesUsados: number;

  cantidadEnlacesExpirados: number;

  cantidadEnlacesRevocados: number;

  cantidadEnlacesActivos: number;

  ultimoEnlaceCanal: TicketConformidadCanal | null;

  ultimoEnlaceCreadoEn: string | null;

  requiereRetrabajo: boolean;

  estaConforme: boolean;

  estaPendiente: boolean;

  tiempoRespuestaMinutos: number | null;
}

/* =========================================================
 * DETALLE / CONFORMIDAD ACTUAL
 * ======================================================= */

export interface TicketConformidadDetalle {
  id: number;

  ticketId: number;

  clienteId: number | null;

  tecnicoAsignadoId: number | null;

  creadoPorId: number | null;

  resultado: TicketConformidadResultado;

  creadoEn: string;

  actualizadoEn: string;

  respondidoEn: string | null;

  ticket: TicketConformidadTicket;

  cliente: TicketConformidadCliente | null;

  tecnicoAsignado: TicketConformidadUsuario | null;

  creadoPor: TicketConformidadUsuario | null;

  firmas: TicketConformidadFirma[];

  enlaces: TicketConformidadEnlace[];

  resumen: TicketConformidadResumen;
}

/* =========================================================
 * RESPUESTA PÚBLICA
 * ======================================================= */

export interface TicketConformidadPublicaTicket {
  id: number;

  titulo: string | null;

  descripcion: string | null;

  fechaApertura: string;

  fechaResolucionTecnico: string | null;
}

export interface TicketConformidadPublicaCliente {
  nombreCompleto: string;
}

export interface TicketConformidadPublicaTecnico {
  nombre: string;
}

export interface TicketConformidadPublicaEstado {
  resultado: TicketConformidadResultado;

  creadoEn: string;

  expiraEn: string;
}

export interface TicketConformidadPublicaResponse {
  ticket: TicketConformidadPublicaTicket;

  cliente: TicketConformidadPublicaCliente | null;

  tecnico: TicketConformidadPublicaTecnico | null;

  conformidad: TicketConformidadPublicaEstado;
}

/* =========================================================
 * RETRABAJO PÚBLICO
 * ======================================================= */

export interface RequerirRetrabajoResponse {
  conformidadId: number;

  resultado: TicketConformidadResultado;

  respondidoEn: string;

  enlaceId: number;

  usadoEn: string;
}

/* =========================================================
 * FIRMA PÚBLICA
 * ======================================================= */

export interface RegistrarFirmaClientePayload {
  nombreFirmante: string;

  telefonoFirmante: string;

  firma: File;
}

export interface RegistrarFirmaClienteResponse {
  conformidadId: number;

  resultado: TicketConformidadResultado;

  firmaId: number;

  mediaId: number;

  nombreFirmante: string;

  telefonoFirmante: string | null;

  firmadoEn: string;

  respondidoEn: string;

  enlaceId: number;

  usadoEn: string;
}

/* =========================================================
 * LINK GENERADO PARA UI
 * ======================================================= */

export interface TicketConformidadGeneratedLink {
  enlaceId: number;

  conformidadId: number;

  token: string;

  publicUrl: string;

  expiraEn: string;

  canal: TicketConformidadCanal;
}

export interface GenerarEnlaceTicketConformidadPayload {
  canal: TicketConformidadCanal;
  telefonoDestino?: string | null;
}

export interface RegistrarFirmaTecnicoResponse {
  conformidadId: number;

  firmaId: number;

  mediaId: number;

  usuarioFirmanteId: number;

  nombreFirmante: string;

  firmadoEn: string;
}
