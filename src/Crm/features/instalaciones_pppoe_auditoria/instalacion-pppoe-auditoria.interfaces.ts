export type TipoOperacionPppoe =
  | "CREAR_SECRET"
  | "ACTIVAR_SECRET"
  | "SUSPENDER_SERVICIO"
  | "ELIMINAR_SECRET";

export type EstadoOperacionPppoe =
  | "PENDIENTE"
  | "AUTORIZADA"
  | "EJECUTANDO"
  | "EXITOSA"
  | "PARCIAL"
  | "FALLIDA"
  | "CANCELADA";

export type OrigenOperacionPppoe =
  | "OPERADOR"
  | "SISTEMA"
  | "COBRANZA_AUTOMATICA";

export type CanalOperacionPppoe = "SSH" | "ROUTEROS_API" | "MANUAL";

export type TipoPasoPppoe =
  | "CONECTAR_ROUTER"
  | "BUSCAR_SECRET"
  | "AGREGAR_SECRET"
  | "CONFIRMAR_SECRET"
  | "HABILITAR_SECRET"
  | "DESHABILITAR_SECRET"
  | "REMOVER_SESION_ACTIVA"
  | "ELIMINAR_SECRET";

export type EstadoPasoPppoe =
  | "PENDIENTE"
  | "EJECUTANDO"
  | "EXITOSO"
  | "FALLIDO"
  | "OMITIDO";

export type AccionAuditoriaPppoe =
  | "PERFIL_HOMOLOGADO"
  | "PERFIL_ACTUALIZADO"
  | "PERFIL_ACTIVADO"
  | "PERFIL_DESACTIVADO"
  | "PREALTA_CREADA"
  | "PREALTA_CANCELADA"
  | "CONTRASENA_GENERADA"
  | "CREACION_AUTORIZADA"
  | "CREACION_CANCELADA"
  | "SECRET_CREADO"
  | "SECRET_HABILITADO"
  | "SERVICIO_ACTIVADO"
  | "SERVICIO_REACTIVADO"
  | "SECRET_DESHABILITADO"
  | "SERVICIO_SUSPENDIDO"
  | "SESION_ACTIVA_REMOVIDA"
  | "DESINSTALACION_AUTORIZADA"
  | "DESINSTALACION_RECHAZADA"
  | "SECRET_ELIMINADO"
  | "REAUTENTICACION_EXITOSA"
  | "REAUTENTICACION_FALLIDA"
  | "OPERACION_CREADA"
  | "OPERACION_INICIADA"
  | "OPERACION_REINTENTADA"
  | "OPERACION_RECUPERADA"
  | "OPERACION_EXITOSA"
  | "OPERACION_FALLIDA"
  | "OPERACION_PARCIAL"
  | "OPERACION_CANCELADA"
  | "SINCRONIZACION_EXITOSA"
  | "SINCRONIZACION_FALLIDA"
  | "DESINCRONIZACION_DETECTADA"
  | "HOJA_VISUALIZADA"
  | "HOJA_GENERADA";

export type EstadoCuentaPppoe =
  | "PENDIENTE_CREACION"
  | "EN_INSTALACION"
  | "PENDIENTE_ACTIVACION"
  | "EN_ACTIVACION"
  | "ACTIVA"
  | "EN_SUSPENSION"
  | "SUSPENDIDA"
  | "EN_DESINSTALACION"
  | "ELIMINADA"
  | "CANCELADA"
  | "ERROR";

export type PppoeAuditoriaUsuarioResumen = {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: string;
  activo: boolean;
};

export type PppoeAuditoriaServicioResumen = {
  id: number;
  nombre: string;
  velocidad: string | null;
  precio: number;
  estado: string;
};

export type PppoeAuditoriaRouterResumen = {
  id: number;
  nombre: string;
  host: string;
  sshPort: number;
  descripcion: string | null;
  activo: boolean;
};

export type PppoeAuditoriaPerfilResumen = {
  id: number;
  codigoPerfil: string;
  activo: boolean;
  router: PppoeAuditoriaRouterResumen;
  servicioInternet: PppoeAuditoriaServicioResumen;
};

export type PppoeAuditoriaAccesoResumen = {
  id: number;
  tecnologia: string;
  metodoAutenticacion: string;
  estado: string;
  activadoEn: string | null;
  suspendidoEn: string | null;
  dadoDeBajaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
  servicioInternet: PppoeAuditoriaServicioResumen | null;
};

export type PppoeAuditoriaAccesoAdministrableResumen =
  PppoeAuditoriaAccesoResumen & {
    cuentaPppoe: {
      id: number;
      usuario: string;
      estado: EstadoCuentaPppoe;
      perfilHomologacionId: number;
      mikrotikRouterId: number;
      codigoPerfil: string;
      routerNombre: string;
    } | null;
  };

export type PppoeAuditoriaCuentaBase = {
  id: number;
  accesoInternetId: number;
  usuario: string;
  estado: EstadoCuentaPppoe;
  generadoEn: string;
  secretCreadoEn: string | null;
  activadoEn: string | null;
  suspendidoEn: string | null;
  eliminadoEn: string | null;
  ultimaSincronizacionEn: string | null;
  ultimoError: string | null;
};

export type PppoeAuditoriaCuentaCompleta = PppoeAuditoriaCuentaBase & {
  accesoInternet: PppoeAuditoriaAccesoResumen;
  perfilHomologacion: PppoeAuditoriaPerfilResumen;
};

export type PppoeAuditoriaEvento = {
  id: number;
  empresaId: number;
  clienteId: number | null;
  accesoInternetId: number | null;
  cuentaPppoeId: number | null;
  perfilHomologacionId: number | null;
  instalacionId: number | null;
  operacionId: number | null;
  operadorId: number | null;
  origen: OrigenOperacionPppoe;
  accion: AccionAuditoriaPppoe;
  descripcion: string;
  estadoCuentaAnterior: EstadoCuentaPppoe | null;
  estadoCuentaNuevo: EstadoCuentaPppoe | null;
  usuarioPppoeSnapshot: string | null;
  perfilCodigoSnapshot: string | null;
  operadorNombreSnapshot: string | null;
  datos: unknown | null;
  ipOrigen: string | null;
  userAgent: string | null;
  creadoEn: string;
  operador: PppoeAuditoriaUsuarioResumen | null;
};

export type PppoeOperacionPaso = {
  id: number;
  operacionId: number;
  tipo: TipoPasoPppoe;
  orden: number;
  estado: EstadoPasoPppoe;
  comandoSanitizado: string | null;
  respuestaSanitizada: string | null;
  errorCodigo: string | null;
  errorMensaje: string | null;
  iniciadoEn: string | null;
  finalizadoEn: string | null;
  duracionMs: number | null;
  creadoEn: string;
  actualizadoEn: string;
};

export type PppoeOperacionDetalle = {
  id: number;
  empresaId: number;
  cuentaPppoeId: number;
  mikrotikRouterId: number;
  perfilHomologacionId: number | null;
  instalacionId: number | null;
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
  resultado: unknown | null;
  errorCodigo: string | null;
  errorMensaje: string | null;
  iniciadoEn: string | null;
  finalizadoEn: string | null;
  canceladoEn: string | null;
  duracionMs: number | null;
  creadoEn: string;
  actualizadoEn: string;
};

export type InstalacionPppoeOperacionTimelineItem = {
  tipoRegistro: "OPERACION";
  fecha: string;
  operacion: PppoeOperacionDetalle;
  actores: {
    iniciadoPor: PppoeAuditoriaUsuarioResumen | null;
    reautenticadoPor: PppoeAuditoriaUsuarioResumen | null;
  };
  contexto: {
    accesoInternet: PppoeAuditoriaAccesoResumen;
    cuentaPppoe: PppoeAuditoriaCuentaBase;
    router: PppoeAuditoriaRouterResumen;
    perfilHomologacion: PppoeAuditoriaPerfilResumen | null;
  };
  auditorias: PppoeAuditoriaEvento[];
  pasos: PppoeOperacionPaso[];
};

export type InstalacionPppoeAuditoriaTimelineItem = {
  tipoRegistro: "AUDITORIA";
  fecha: string;
  auditoria: PppoeAuditoriaEvento;
  contexto: {
    accesoInternet: PppoeAuditoriaAccesoResumen | null;
    cuentaPppoe: PppoeAuditoriaCuentaCompleta | null;
    perfilHomologacion: PppoeAuditoriaPerfilResumen | null;
  };
};

export type InstalacionPppoeTimelineItem =
  | InstalacionPppoeOperacionTimelineItem
  | InstalacionPppoeAuditoriaTimelineItem;

export type InstalacionPppoeAuditoriaSummary = {
  instalacion: {
    id: number;
    empresaId: number;
    clienteId: number;
    estado: string;
    fechaProgramada: string | null;
    fechaInicio: string | null;
    fechaFinalizacion: string | null;
    fechaActivacionServicio: string | null;
    cliente: {
      id: number;
      nombre: string;
      apellidos: string | null;
      telefono: string | null;
    };
  };
  totalEventos: number;
  totalOperaciones: number;
  totalPasos: number;
  operacionesExitosas: number;
  operacionesFallidas: number;
  operacionesParciales: number;
  operacionesEnCurso: number;
  operacionesCanceladas: number;
  ultimaActividadEn: string | null;
  cantidadAccesosPppoe: number;
  accesosPppoe: PppoeAuditoriaAccesoAdministrableResumen[];
  cuentaPppoe: PppoeAuditoriaCuentaCompleta | null;
};

export type InstalacionPppoeAuditoriaResponse = {
  data: InstalacionPppoeTimelineItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: InstalacionPppoeAuditoriaSummary | null;
};
