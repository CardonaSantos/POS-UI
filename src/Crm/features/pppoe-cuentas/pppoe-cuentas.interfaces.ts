import type {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

import type {
  EstadoOperacionPppoe,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export type OrigenCuentaPppoe = "INSTALACION" | "ALTA_MANUAL";

export type PppoeCuentaClienteResumen = {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  dpi: string | null;
};

export type PppoeCuentaServicioResumen = {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number | null;
};

export type PppoeCuentaPerfilResumen = {
  id: number;

  codigoPerfil: string;
};

export type PppoeCuentaRouterResumen = {
  id: number;

  nombre: string;
};

export type PppoeCuentaUltimaOperacionResumen = {
  id: number;

  tipo: TipoOperacionPppoe;

  estado: EstadoOperacionPppoe;

  creadoEn: string;

  finalizadoEn: string | null;
};

/**
 * Item devuelto por:
 *
 * GET /pppoe-cuentas
 */
export type PppoeCuentaListItem = {
  cuentaPppoeId: number;

  accesoInternetId: number;

  usuario: string;

  estadoCuenta: EstadoCuentaPppoe;

  estadoAcceso: EstadoAccesoInternet;

  origen: OrigenCuentaPppoe;

  generadoEn: string;

  secretCreadoEn: string | null;

  activadoEn: string | null;

  suspendidoEn: string | null;

  ultimaSincronizacionEn: string | null;

  ultimoError: string | null;

  cliente: PppoeCuentaClienteResumen;

  servicioInternet: PppoeCuentaServicioResumen | null;

  perfilHomologacion: PppoeCuentaPerfilResumen;

  router: PppoeCuentaRouterResumen;

  ultimaOperacion: PppoeCuentaUltimaOperacionResumen | null;
};

export type PppoeCuentasPaginationMeta = {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
};

export type PppoeCuentasListResponse = {
  data: PppoeCuentaListItem[];

  meta: PppoeCuentasPaginationMeta;
};
