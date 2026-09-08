import type {
  CanalOperacionPppoe,
  EstadoCuentaPppoe,
  EstadoOperacionPppoe,
  OrigenOperacionPppoe,
  PppoeOperacionPaso,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

/**
 * ============================================================
 * RELACIONES RESUMIDAS
 * ============================================================
 */

export type PppoeOperacionUsuarioResumen = {
  id: number;

  nombre: string;

  correo: string;

  telefono: string | null;

  rol: string;

  activo: boolean;
};

export type PppoeOperacionEmpresaResumen = {
  id: number;

  nombre: string;
};

export type PppoeOperacionClienteResumen = {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  dpi: string | null;

  direccion: string | null;
};

export type PppoeOperacionServicioResumen = {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number;

  estado: string;
};

export type PppoeOperacionRouterResumen = {
  id: number;

  nombre: string;

  host: string;

  sshPort: number;

  descripcion: string | null;

  activo: boolean;
};

export type PppoeOperacionAccesoResumen = {
  id: number;

  clienteId: number;

  servicioInternetId: number | null;

  tecnologia: string;

  metodoAutenticacion: string;

  estado: string;

  cliente: PppoeOperacionClienteResumen;

  servicioInternet: PppoeOperacionServicioResumen | null;
};

export type PppoeOperacionCuentaResumen = {
  id: number;

  accesoInternetId: number;

  perfilHomologacionId: number;

  usuario: string;

  estado: EstadoCuentaPppoe;

  generadoEn: string;

  secretCreadoEn: string | null;

  activadoEn: string | null;

  suspendidoEn: string | null;

  eliminadoEn: string | null;

  ultimaSincronizacionEn: string | null;

  ultimoError: string | null;

  accesoInternet: PppoeOperacionAccesoResumen;
};

export type PppoeOperacionPerfilResumen = {
  id: number;

  mikrotikRouterId: number;

  servicioInternetId: number;

  codigoPerfil: string;

  activo: boolean;

  servicioInternet: PppoeOperacionServicioResumen;
};

export type PppoeOperacionInstalacionResumen = {
  id: number;

  clienteId: number;

  servicioInternetId: number | null;

  tipo: string;

  estado: string;

  fechaProgramada: string | null;

  fechaInicio: string | null;

  fechaFinalizacion: string | null;
};

export type PppoeOperacionDesinstalacionResumen = {
  id: number;

  clienteId: number;

  servicioInternetId: number | null;

  accesoInternetId: number | null;

  tipo: string;

  motivo: string | null;

  estado: string;

  fechaProgramada: string | null;

  fechaInicio: string | null;

  fechaFinalizacion: string | null;
};

/**
 * ============================================================
 * REINTENTOS / CONTEOS
 * ============================================================
 */

export type PppoeOperacionReintentoResumen = {
  id: number;

  numeroIntento: number;

  estado: EstadoOperacionPppoe;

  errorCodigo: string | null;

  errorMensaje: string | null;

  iniciadoEn: string | null;

  finalizadoEn: string | null;

  creadoEn: string;
};

export type PppoeOperacionConteos = {
  pasos: number;

  auditorias: number;

  reintentos: number;
};

/**
 * ============================================================
 * LISTADO
 * ============================================================
 */

export type PppoeOperacionListItem = {
  id: number;

  empresaId: number;

  cuentaPppoeId: number;

  mikrotikRouterId: number;

  perfilHomologacionId: number | null;

  instalacionId: number | null;

  desinstalacionId: number | null;

  reintentoDeId: number | null;

  numeroIntento: number;

  claveIdempotencia: string;

  tipo: TipoOperacionPppoe;

  origen: OrigenOperacionPppoe;

  canal: CanalOperacionPppoe;

  estado: EstadoOperacionPppoe;

  iniciadoPorId: number | null;

  reautenticadoPorId: number | null;

  requiereReautenticacion: boolean;

  reautenticacionExitosa: boolean | null;

  reautenticadoEn: string | null;

  usuarioPppoeSnapshot: string;

  codigoPerfilSnapshot: string | null;

  routerHostSnapshot: string | null;

  routerPuertoSnapshot: number | null;

  motivo: string | null;

  /**
   * Resultado técnico sanitizado.
   *
   * Su estructura depende del tipo de operación,
   * por lo que todavía no lo rigidizamos en UI.
   */
  resultado: Record<string, unknown> | null;

  errorCodigo: string | null;

  errorMensaje: string | null;

  iniciadoEn: string | null;

  finalizadoEn: string | null;

  canceladoEn: string | null;

  duracionMs: number | null;

  creadoEn: string;

  actualizadoEn: string;

  empresa: PppoeOperacionEmpresaResumen;

  cuentaPppoe: PppoeOperacionCuentaResumen;

  mikrotikRouter: PppoeOperacionRouterResumen;

  perfilHomologacion: PppoeOperacionPerfilResumen | null;

  instalacion: PppoeOperacionInstalacionResumen | null;

  desinstalacion: PppoeOperacionDesinstalacionResumen | null;

  iniciadoPor: PppoeOperacionUsuarioResumen | null;

  reautenticadoPor: PppoeOperacionUsuarioResumen | null;

  reintentoDe: PppoeOperacionReintentoResumen | null;

  conteos: PppoeOperacionConteos;
};

/**
 * GET /pppoe-operaciones/:operacionId
 */
export type PppoeOperacionDetalle = PppoeOperacionListItem & {
  pasos: PppoeOperacionPaso[];

  reintentos: PppoeOperacionReintentoResumen[];
};

export type PppoeOperacionesPaginationMeta = {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
};

export type PppoeOperacionesListResponse = {
  data: PppoeOperacionListItem[];

  meta: PppoeOperacionesPaginationMeta;
};

/**
 * ============================================================
 * QUERY PARAMS
 * ============================================================
 *
 * empresaId NO pertenece al contrato nuevo del frontend.
 * El servidor actual lo resuelve desde el JWT.
 */

export type ListarPppoeOperacionesParams = {
  page?: number;

  limit?: number;

  search?: string;

  cuentaPppoeId?: number;

  mikrotikRouterId?: number;

  perfilHomologacionId?: number;

  instalacionId?: number;

  desinstalacionId?: number;

  iniciadoPorId?: number;

  reautenticadoPorId?: number;

  reintentoDeId?: number;

  tipos?: TipoOperacionPppoe[];

  origenes?: OrigenOperacionPppoe[];

  canales?: CanalOperacionPppoe[];

  estados?: EstadoOperacionPppoe[];

  requiereReautenticacion?: boolean;

  numeroIntento?: number;

  fechaDesde?: string;

  fechaHasta?: string;

  ordenPor?: "creadoEn" | "iniciadoEn" | "finalizadoEn" | "numeroIntento";

  ordenDireccion?: "asc" | "desc";
};

export type PppoeCuentaOperacionesParams = Omit<
  ListarPppoeOperacionesParams,
  "cuentaPppoeId"
>;
