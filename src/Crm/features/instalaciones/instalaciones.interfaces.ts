import { EstadoInstalacionCliente, TipoInstalacionCliente } from "./enums";

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
  apellidos: string;
  telefono: string;
  dpi: string;
  direccion: string;
};

export type ClienteInstalacionServicioInternet = {
  id: number;
  nombre: string;
  velocidad: string;
  precio: number;
};

export type ClienteInstalacionTecnicoResponsable = {
  asignacionId: number;
  tecnicoId: number;
  nombre: string;
  avatarUrl: string | null;
};

export type ClienteInstalacionConteos = {
  tecnicos: number;
  evidencias: number;
  equipos: number;
};

export type ClienteInstalacionListItem = {
  id: number;
  empresaId: number;
  clienteId: number;
  servicioInternetId: number;

  ticketId: number | null;
  asesorId: number | null;
  creadoPorId: number;
  completadoPorId: number | null;

  tipo: TipoInstalacionCliente;
  estado: EstadoInstalacionCliente;

  fechaProgramada: string;
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
  servicioInternet: ClienteInstalacionServicioInternet;

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
