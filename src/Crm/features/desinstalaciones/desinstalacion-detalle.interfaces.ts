import type {
  AutorizacionDesinstalacionResumen,
  ClienteDesinstalacionListItem,
  OperacionPppoeDesinstalacionResumen,
  UsuarioDesinstalacionResumen,
} from "./desinstalaciones.interfaces";

export type ClienteDesinstalacionTecnicoDetalle = {
  id: number;

  desinstalacionId: number;

  tecnicoId: number | null;

  rol: string;

  esResponsable: boolean;

  tiempoMinutos: number | null;

  observaciones: string | null;

  tecnicoNombreSnapshot: string | null;

  creadoEn: string;

  actualizadoEn: string;

  tecnico: UsuarioDesinstalacionResumen | null;
};

export type ClienteDesinstalacionEvidenciaDetalle = {
  id: number;

  desinstalacionId: number;

  mediaId: number;

  tipo: string;

  descripcion: string | null;

  orden: number;

  creadoEn: string;

  media: {
    id: number;

    categoria: string;

    tipo: string;

    estado: string;

    cdnUrl: string | null;

    mimeType: string | null;

    extension: string | null;

    tamanioBytes: string | null;

    ancho: number | null;

    alto: number | null;

    titulo: string | null;

    descripcion: string | null;

    tomadoEn: string | null;

    creadoEn: string;
  };
};

export type ClienteDesinstalacionEquipoDetalle = {
  id: number;

  desinstalacionId: number;

  productoId: number | null;

  serialProductoId: number | null;

  movimientoInventarioId: number | null;

  bodegaDestinoId: number | null;

  accesoEquipoId: number | null;

  descripcion: string | null;

  cantidad: number;

  estadoRetiro: string;

  costoRecuperacion: number;

  serialSnapshot: string | null;

  notas: string | null;

  creadoEn: string;

  actualizadoEn: string;

  producto: {
    id: number;
    nombre: string;
  } | null;

  serialProducto: {
    id: number;
    serial: string;
  } | null;

  bodegaDestino: {
    id: number;
    nombre: string;
  } | null;
};

export type ClienteDesinstalacionGastoDetalle = {
  id: number;

  tipoGasto: string;

  subtipo: string | null;

  descripcion: string | null;

  montoTotal: number;

  esRecuperable: boolean;

  estado: string;

  fechaGasto: string;

  aprobadoEn: string | null;

  registradoPor: UsuarioDesinstalacionResumen | null;

  aprobadoPor: UsuarioDesinstalacionResumen | null;

  evidencia: {
    id: number;

    cdnUrl: string | null;

    mimeType: string | null;
  } | null;
};

export type ClienteDesinstalacionAuditoriaPppoeDetalle = {
  id: number;

  operacionId: number | null;

  cuentaPppoeId: number | null;

  accesoInternetId: number | null;

  perfilHomologacionId: number | null;

  operadorId: number | null;

  origen: string;

  accion: string;

  descripcion: string;

  estadoCuentaAnterior: string | null;

  estadoCuentaNuevo: string | null;

  usuarioPppoeSnapshot: string | null;

  perfilCodigoSnapshot: string | null;

  datos: unknown;

  ipOrigen: string | null;

  userAgent: string | null;

  creadoEn: string;

  operador: UsuarioDesinstalacionResumen | null;
};

export type ClienteDesinstalacionDetalle = ClienteDesinstalacionListItem & {
  tecnicos: ClienteDesinstalacionTecnicoDetalle[];

  evidencias: ClienteDesinstalacionEvidenciaDetalle[];

  equipos: ClienteDesinstalacionEquipoDetalle[];

  gastosOperativos: ClienteDesinstalacionGastoDetalle[];

  autorizaciones: AutorizacionDesinstalacionResumen[];

  operacionesPppoe: OperacionPppoeDesinstalacionResumen[];

  auditoriasPppoe: ClienteDesinstalacionAuditoriaPppoeDetalle[];
};
