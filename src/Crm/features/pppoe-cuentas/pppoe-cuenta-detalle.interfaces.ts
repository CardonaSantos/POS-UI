import type {
  AccionInstalacionAcceso,
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
  EstadoInstalacionCliente,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";

import type {
  EstadoOperacionPppoe,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import type { OrigenCuentaPppoe } from "./pppoe-cuentas.interfaces";

/**
 * Orquestador que el backend determinó para
 * realizar la primera activación PPPoE.
 *
 * La UI no debe inferir este dato a partir
 * de origen, estado o instalaciones[].
 */
export type FlujoActivacionCuentaPppoe = "INSTALACION" | "ALTA_MANUAL";

export type PppoeCuentaDetalleUsuario = {
  id: number;

  nombre: string;

  correo: string;

  telefono: string | null;

  activo: boolean;
};

export type PppoeCuentaDetalleCliente = {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  dpi: string | null;

  direccion: string | null;

  estadoCliente: string;

  estadoCobranza: string;
};

export type PppoeCuentaDetalleAccesoInternet = {
  id: number;

  tecnologia: TecnologiaAccesoInternet;

  metodoAutenticacion: MetodoAutenticacionInternet;

  estado: EstadoAccesoInternet;

  activadoEn: string | null;

  suspendidoEn: string | null;

  dadoDeBajaEn: string | null;

  creadoEn: string;

  actualizadoEn: string;
};

export type PppoeCuentaDetalleServicioInternet = {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number;

  estado: string;
};

export type PppoeCuentaDetallePerfilHomologacion = {
  id: number;

  mikrotikRouterId: number;

  servicioInternetId: number;

  codigoPerfil: string;

  activo: boolean;
};

export type PppoeCuentaDetalleRouter = {
  id: number;

  nombre: string;

  host: string;

  sshPort: number;

  descripcion: string | null;

  activo: boolean;
};

export type PppoeCuentaDetalleInstalacion = {
  vinculoId: number;

  accion: AccionInstalacionAcceso;

  vinculadoEn: string;

  instalacion: {
    id: number;

    tipo: TipoInstalacionCliente;

    estado: EstadoInstalacionCliente;

    fechaProgramada: string | null;

    fechaInicio: string | null;

    fechaFinalizacion: string | null;

    creadoEn: string;
  };
};

export type PppoeCuentaDetalleUltimaOperacion = {
  id: number;

  tipo: TipoOperacionPppoe;

  estado: EstadoOperacionPppoe;

  reintentoDeId: number | null;

  numeroIntento: number;

  motivo: string | null;

  errorCodigo: string | null;

  errorMensaje: string | null;

  iniciadoEn: string | null;

  finalizadoEn: string | null;

  creadoEn: string;

  iniciadoPor: PppoeCuentaDetalleUsuario | null;
};

/**
 * Capacidad administrativa calculada por backend.
 */
export type PppoeCuentaDetalleAccion = {
  habilitada: boolean;

  motivo: string | null;
};

/**
 * Primera activación PPPoE.
 *
 * El backend decide:
 *
 * INSTALACION
 *   -> POST /cliente-instalaciones/:id/pppoe/activar
 *
 * ALTA_MANUAL
 *   -> POST /pppoe-cuentas/:id/provisionar
 */
export type PppoeCuentaDetalleActivacionAccion = PppoeCuentaDetalleAccion & {
  flujo: FlujoActivacionCuentaPppoe | null;

  /**
   * Obligatorio cuando flujo === "INSTALACION".
   *
   * null para ALTA_MANUAL o cuando no existe
   * un flujo de activación aplicable.
   */
  instalacionId: number | null;
};

/**
 * Reintento/recuperación necesitan además saber
 * sobre qué operación actuar.
 */
export type PppoeCuentaDetalleOperacionAccion = PppoeCuentaDetalleAccion & {
  operacionId: number | null;
};

export type PppoeCuentaDetalleAcciones = {
  /**
   * Reemplaza el antiguo "provisionar".
   *
   * La UI muestra una única acción:
   *
   * Activar PPPoE
   */
  activar: PppoeCuentaDetalleActivacionAccion;

  suspender: PppoeCuentaDetalleAccion;

  reactivar: PppoeCuentaDetalleAccion;

  reintentarOperacion: PppoeCuentaDetalleOperacionAccion;

  recuperarOperacion: PppoeCuentaDetalleOperacionAccion;
};

/**
 * Respuesta completa de:
 *
 * GET /pppoe-cuentas/:cuentaPppoeId
 *
 * No incluye ninguna contraseña PPPoE.
 */
export type PppoeCuentaDetalle = {
  cuentaPppoeId: number;

  empresaId: number;

  accesoInternetId: number;

  perfilHomologacionId: number;

  usuario: string;

  estadoCuenta: EstadoCuentaPppoe;

  generadoPorId: number | null;

  /**
   * Operador que incorporó una cuenta PPPoE
   * preexistente al CRM.
   *
   * null para instalación y alta manual.
   */
  adoptadoPorId: number | null;

  generadoEn: string;

  /**
   * Fecha en que una cuenta externa fue adoptada
   * por el CRM.
   *
   * No representa la fecha histórica en que el
   * secret fue creado en MikroTik.
   */
  adoptadoEn: string | null;

  secretCreadoEn: string | null;

  activadoEn: string | null;

  suspendidoEn: string | null;

  eliminadoEn: string | null;

  ultimaSincronizacionEn: string | null;

  ultimoError: string | null;

  actualizadoEn: string;

  generadoPor: PppoeCuentaDetalleUsuario | null;

  /**
   * Usuario administrativo que realizó
   * la adopción.
   */
  adoptadoPor: PppoeCuentaDetalleUsuario | null;

  cliente: PppoeCuentaDetalleCliente;

  accesoInternet: PppoeCuentaDetalleAccesoInternet;

  servicioInternet: PppoeCuentaDetalleServicioInternet | null;

  perfilHomologacion: PppoeCuentaDetallePerfilHomologacion;

  router: PppoeCuentaDetalleRouter;

  origen: OrigenCuentaPppoe;

  instalaciones: PppoeCuentaDetalleInstalacion[];

  ultimaOperacion: PppoeCuentaDetalleUltimaOperacion | null;

  conteos: {
    instalaciones: number;

    operaciones: number;

    auditorias: number;
  };

  acciones: PppoeCuentaDetalleAcciones;
};
