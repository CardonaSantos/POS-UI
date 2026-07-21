import {
  EstadoInstalacionCliente,
  RolTecnicoOperacionCliente,
  TipoEvidenciaClienteOperacion,
  TipoInstalacionCliente,
} from "./enums";

export type ClienteInstalacionUbicacion = {
  direccion: string | null;
  referencia: string | null;
  latitud: number | null;
  longitud: number | null;
};

export type ClienteInstalacionWifi = {
  ssid: string | null;
};

export type ClienteInstalacionCostos = {
  costoInstalacion: number;
  costoMateriales: number;
  costoManoObra: number;
  costoOtros: number;
  montoCobradoCliente: number;
  saldoPendiente: number;
  notas: string | null;
};

export type ClienteInstalacionCliente = {
  id: number;
  nombre: string;

  apellidos: string | null;
  telefono: string | null;
  dpi: string | null;
  direccion: string | null;
};

export type ClienteInstalacionServicioInternet = {
  id: number;
  nombre: string;
  velocidad: string | null;
  precio: number | null;
};

export type ClienteInstalacionTecnicoResponsable = {
  asignacionId: number;
  tecnicoId: number | null;
  nombre: string;
  avatarUrl: string | null;
};

export type ClienteInstalacionConteos = {
  tecnicos: number;
  evidencias: number;
  equipos: number;
};

export type ClienteInstalacionUsuarioResumen = {
  id: number;
  nombre: string;

  correo: string | null;
  telefono: string | null;
  avatarUrl: string | null;

  activo: boolean;
};

export type ClienteInstalacionListItem = {
  id: number;
  empresaId: number;
  clienteId: number;

  servicioInternetId: number | null;
  ticketId: number | null;

  asesorId: number | null;
  creadoPorId: number;
  completadoPorId: number | null;

  tipo: TipoInstalacionCliente;
  estado: EstadoInstalacionCliente;

  fechaProgramada: string | null;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  fechaCancelacion: string | null;
  fechaActivacionServicio: string | null;

  motivo: string | null;
  observaciones: string | null;
  resultado: string | null;

  ubicacion: ClienteInstalacionUbicacion;
  wifi: ClienteInstalacionWifi;
  costos: ClienteInstalacionCostos;

  esMigrada: boolean;

  creadoEn: string;
  actualizadoEn: string;

  cliente: ClienteInstalacionCliente;

  servicioInternet: ClienteInstalacionServicioInternet | null;

  asesor: ClienteInstalacionUsuarioResumen | null;

  tecnicoResponsable: ClienteInstalacionTecnicoResponsable | null;

  conteos: ClienteInstalacionConteos;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ClienteInstalacionListResponse = {
  data: ClienteInstalacionListItem[];
  meta: PaginationMeta;
};

// DETALLE DE UNA INSTALACION

/*
 * Información base de una instalación.
 *
 * Esta parte aparece tanto en el listado
 * como en el detalle.
 */

export type ClienteInstalacionBase = {
  id: number;

  empresaId: number;
  clienteId: number;

  servicioInternetId: number | null;
  ticketId: number | null;

  asesorId: number | null;
  creadoPorId: number;
  completadoPorId: number | null;

  tipo: TipoInstalacionCliente;
  estado: EstadoInstalacionCliente;

  fechaProgramada: string | null;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  fechaCancelacion: string | null;
  fechaActivacionServicio: string | null;

  motivo: string | null;
  observaciones: string | null;
  resultado: string | null;

  ubicacion: ClienteInstalacionUbicacion;
  wifi: ClienteInstalacionWifi;
  costos: ClienteInstalacionCostos;

  esMigrada: boolean;

  /*
   * El presenter lo incluye, pero JSON.stringify
   * puede omitirlo cuando su valor es undefined.
   */
  metadata?: Record<string, unknown> | null;

  creadoEn: string;
  actualizadoEn: string;
};

/*
 * Detalle: participantes
 */

export type ClienteInstalacionParticipantes = {
  asesor: ClienteInstalacionUsuarioResumen | null;
  creadoPor: ClienteInstalacionUsuarioResumen | null;
  completadoPor: ClienteInstalacionUsuarioResumen | null;
};

/*
 * Detalle: técnicos
 */

export type ClienteInstalacionTecnicoDetalle = {
  id: number;
  instalacionId: number;

  tecnicoId: number | null;

  rol: RolTecnicoOperacionCliente;
  esResponsable: boolean;

  tiempoMinutos: number | null;
  observaciones: string | null;

  tecnicoNombreSnapshot: string | null;

  tecnico: ClienteInstalacionUsuarioResumen | null;

  creadoEn: string;
  actualizadoEn: string;
};

/*
 * Detalle: evidencias
 */

export type ClienteInstalacionEvidenciaMedia = {
  id: number;

  cdnUrl: string | null;
  key: string;

  mimeType: string | null;
  extension: string | null;

  /*
   * El backend convierte BigInt a string.
   */
  tamanioBytes: string | null;

  subidoPor: ClienteInstalacionUsuarioResumen | null;
};

export type ClienteInstalacionEvidenciaDetalle = {
  id: number;
  instalacionId: number;

  mediaId: number;

  tipo: TipoEvidenciaClienteOperacion;

  descripcion: string | null;
  orden: number;

  creadoEn: string;

  media: ClienteInstalacionEvidenciaMedia;
};

export type ClienteInstalacionDetalle = ClienteInstalacionBase & {
  cliente: ClienteInstalacionCliente;

  servicioInternet: ClienteInstalacionServicioInternet | null;

  participantes: ClienteInstalacionParticipantes;

  tecnicos: ClienteInstalacionTecnicoDetalle[];

  evidencias: ClienteInstalacionEvidenciaDetalle[];

  conteos: ClienteInstalacionConteos;
};
