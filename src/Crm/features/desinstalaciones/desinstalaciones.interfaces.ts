// import type {
//   EstadoAccesoInternet,
//   EstadoAutorizacionDesinstalacion,
//   EstadoCuentaPppoe,
//   EstadoDesinstalacionCliente,
//   EstadoOperacionPppoe,
//   EstadoPasoPppoe,
//   MetodoAutenticacionInternet,
//   MotivoDesinstalacionCliente,
//   TecnologiaAccesoInternet,
//   TipoDesinstalacionCliente,
//   TipoOperacionPppoe,
//   TipoPasoPppoe,
// } from "./desinstalaciones.enums";

import {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
} from "../instalaciones/enums";
import {
  EstadoPasoPppoe,
  TipoOperacionPppoe,
  TipoPasoPppoe,
} from "../instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  EstadoAutorizacionDesinstalacion,
  EstadoDesinstalacionCliente,
  EstadoOperacionPppoe,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "./desinstalaciones.enums";

export type UsuarioDesinstalacionResumen = {
  id: number;

  nombre: string;

  correo: string | null;

  telefono: string | null;

  activo: boolean;

  avatarUrl: string | null;
};

export type ClienteDesinstalacionResumen = {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  dpi: string | null;

  direccion: string | null;
};

export type ServicioInternetDesinstalacionResumen = {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number | null;
};

export type TicketDesinstalacionResumen = {
  id: number;

  titulo: string | null;

  descripcion: string | null;

  estado: string;

  prioridad: string;

  fechaApertura: string;

  fechaCierre: string | null;
};

export type CuentaPppoeDesinstalacionResumen = {
  id: number;

  usuario: string;

  estado: EstadoCuentaPppoe;

  perfilHomologacionId: number;

  generadoEn: string;

  secretCreadoEn: string | null;

  activadoEn: string | null;

  suspendidoEn: string | null;

  eliminadoEn: string | null;

  ultimaSincronizacionEn: string | null;

  ultimoError: string | null;
};

export type AccesoInternetDesinstalacionResumen = {
  id: number;

  clienteId: number;

  servicioInternetId: number | null;

  tecnologia: TecnologiaAccesoInternet;

  metodoAutenticacion: MetodoAutenticacionInternet;

  estado: EstadoAccesoInternet;

  activadoEn: string | null;

  suspendidoEn: string | null;

  dadoDeBajaEn: string | null;

  creadoEn: string;

  actualizadoEn: string;

  cuentaPppoe: CuentaPppoeDesinstalacionResumen | null;
};

export type TecnicoResponsableDesinstalacionResumen = {
  asignacionId: number;

  tecnicoId: number | null;

  nombre: string;

  avatarUrl: string | null;
};

export type AutorizacionDesinstalacionResumen = {
  id: number;

  estado: EstadoAutorizacionDesinstalacion;

  motivoSolicitud: string | null;

  comentarioAutorizador: string | null;

  fechaSolicitud: string;

  fechaRespuesta: string | null;

  solicitadoPor: UsuarioDesinstalacionResumen | null;

  autorizadoPor: UsuarioDesinstalacionResumen | null;
};

export type PasoOperacionPppoeDesinstalacion = {
  id: number;

  tipo: TipoPasoPppoe;

  orden: number;

  estado: EstadoPasoPppoe;

  errorCodigo: string | null;

  errorMensaje: string | null;

  iniciadoEn: string | null;

  finalizadoEn: string | null;

  duracionMs: number | null;
};

export type OperacionPppoeDesinstalacionResumen = {
  id: number;

  cuentaPppoeId: number;

  mikrotikRouterId: number;

  tipo: TipoOperacionPppoe;

  origen: string;

  estado: EstadoOperacionPppoe;

  iniciadoPorId: number | null;

  reautenticadoPorId: number | null;

  requiereReautenticacion: boolean;

  reautenticacionExitosa: boolean | null;

  reautenticadoEn: string | null;

  motivo: string | null;

  errorCodigo: string | null;

  errorMensaje: string | null;

  iniciadoEn: string | null;

  finalizadoEn: string | null;

  creadoEn: string;

  actualizadoEn: string;

  iniciadoPor: UsuarioDesinstalacionResumen | null;

  reautenticadoPor: UsuarioDesinstalacionResumen | null;

  pasos: PasoOperacionPppoeDesinstalacion[];
};

export type CostosDesinstalacionResumen = {
  saldoClienteAlMomento: number;

  costoDesinstalacion: number;

  costoTransporte: number;

  costoManoObra: number;

  costoOtros: number;
};

export type ConteosDesinstalacion = {
  tecnicos: number;

  evidencias: number;

  equipos: number;

  gastosOperativos: number;

  autorizaciones: number;

  operacionesPppoe: number;

  auditoriasPppoe: number;
};

export type ClienteDesinstalacionListItem = {
  id: number;

  empresaId: number;

  clienteId: number;

  servicioInternetId: number | null;

  ticketId: number | null;

  accesoInternetId: number | null;

  solicitadoPorId: number | null;

  ejecutadoPorId: number | null;

  creadoPorId: number | null;

  tipo: TipoDesinstalacionCliente;

  motivo: MotivoDesinstalacionCliente | null;

  estado: EstadoDesinstalacionCliente;

  fechaSolicitud: string | null;

  fechaProgramada: string | null;

  fechaInicio: string | null;

  fechaFinalizacion: string | null;

  fechaCancelacion: string | null;

  requiereRetiroEquipo: boolean;

  equipoRecuperado: boolean;

  costos: CostosDesinstalacionResumen;

  direccionServicio: string | null;

  referenciaUbicacion: string | null;

  latitud: number | null;

  longitud: number | null;

  firmadoPor: string | null;

  dpiFirmante: string | null;

  conforme: boolean | null;

  observaciones: string | null;

  resultado: string | null;

  metadata: unknown | null;

  creadoEn: string;

  actualizadoEn: string;

  cliente: ClienteDesinstalacionResumen;

  servicioInternet: ServicioInternetDesinstalacionResumen | null;

  ticket: TicketDesinstalacionResumen | null;

  solicitadoPor: UsuarioDesinstalacionResumen | null;

  ejecutadoPor: UsuarioDesinstalacionResumen | null;

  creadoPor: UsuarioDesinstalacionResumen | null;

  accesoInternet: AccesoInternetDesinstalacionResumen | null;

  tecnicoResponsable: TecnicoResponsableDesinstalacionResumen | null;

  ultimaAutorizacion: AutorizacionDesinstalacionResumen | null;

  ultimaOperacionPppoe: OperacionPppoeDesinstalacionResumen | null;

  conteos: ConteosDesinstalacion;
};

export type ClienteDesinstalacionListResponse = {
  data: ClienteDesinstalacionListItem[];

  meta: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;
  };
};
