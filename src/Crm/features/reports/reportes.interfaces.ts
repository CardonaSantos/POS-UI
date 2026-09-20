// CLIENTES

export const ReporteClienteEstado = {
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  DESINSTALADO: "DESINSTALADO",
  PENDIENTE_ACTIVO: "PENDIENTE_ACTIVO",
  EN_INSTALACION: "EN_INSTALACION",
} as const;

export type ReporteClienteEstado =
  (typeof ReporteClienteEstado)[keyof typeof ReporteClienteEstado];

/**
 * Estos son los estados operativos que sí debemos
 * exponer posteriormente en la UI.
 *
 * El backend todavía conoce PAGO_PENDIENTE,
 * ATRASADO y MOROSO dentro del estado histórico
 * de cliente, pero no deben usarse como estado
 * operativo actual.
 */
export const REPORTE_CLIENTE_ESTADOS = Object.values(ReporteClienteEstado);

export const ReporteClienteEstadoCobranza = {
  AL_DIA: "AL_DIA",
  PAGO_PENDIENTE: "PAGO_PENDIENTE",
  ATRASADO: "ATRASADO",
  MOROSO: "MOROSO",
} as const;

export type ReporteClienteEstadoCobranza =
  (typeof ReporteClienteEstadoCobranza)[keyof typeof ReporteClienteEstadoCobranza];

export interface ReporteClientesFiltersDto {
  search?: string;

  estado?: ReporteClienteEstado;

  estadoCobranza?: ReporteClienteEstadoCobranza;

  servicioInternetId?: number;

  sectorId?: number;

  municipioId?: number;

  departamentoId?: number;

  /**
   * El backend acepta fechas ISO.
   *
   * Para nuestra UI posteriormente usaremos
   * YYYY-MM-DD.
   */
  fechaCreadoDesde?: string;

  fechaCreadoHasta?: string;

  incluirEliminados?: boolean;
}

// =====================================================
// TICKETS
// =====================================================

export const ReporteTicketAgrupacion = {
  AUTO: "AUTO",
  DIA: "DIA",
  SEMANA: "SEMANA",
  MES: "MES",
} as const;

export type ReporteTicketAgrupacion =
  (typeof ReporteTicketAgrupacion)[keyof typeof ReporteTicketAgrupacion];

export enum ReporteTicketEstado {
  NUEVO = "NUEVO",

  ABIERTA = "ABIERTA",

  EN_PROCESO = "EN_PROCESO",

  PENDIENTE = "PENDIENTE",

  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",

  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",

  PENDIENTE_REVISION = "PENDIENTE_REVISION",

  RESUELTA = "RESUELTA",

  CERRADO = "CERRADO",

  CANCELADA = "CANCELADA",

  ARCHIVADA = "ARCHIVADA",
}

export enum ReporteTicketPrioridad {
  BAJA = "BAJA",

  MEDIA = "MEDIA",

  ALTA = "ALTA",

  URGENTE = "URGENTE",
}

export interface ReporteTicketsFiltersDto {
  /**
   * Ambas fechas se envían juntas o ninguna.
   *
   * Formato esperado:
   * YYYY-MM-DD
   */
  fechaDesde?: string;

  fechaHasta?: string;

  agrupacion?: ReporteTicketAgrupacion;

  estados?: ReporteTicketEstado[];

  prioridades?: ReporteTicketPrioridad[];

  etiquetaIds?: number[];

  tecnicoIds?: number[];

  clienteId?: number;
}

// FACTURACIÓN

export enum ReporteFacturacionEstadoFactura {
  PENDIENTE = "PENDIENTE",

  PAGADA = "PAGADA",

  VENCIDA = "VENCIDA",

  ANULADA = "ANULADA",

  PARCIAL = "PARCIAL",
}

export enum ReporteFacturacionMetodoPago {
  EFECTIVO = "EFECTIVO",

  TARJETA = "TARJETA",

  DEPOSITO = "DEPOSITO",

  PAYPAL = "PAYPAL",

  PENDIENTE = "PENDIENTE",

  OTRO = "OTRO",
}

export enum ReporteFacturacionOrigenPago {
  RUTA = "RUTA",

  OFICINA = "OFICINA",

  TRANSFERENCIA = "TRANSFERENCIA",

  EN_LINEA = "EN_LINEA",
}

export interface ReporteFacturacionFiltersDto {
  /**
   * FacturaInternet.periodo.
   *
   * Formato exacto:
   * YYYYMM
   *
   * Ejemplo:
   * 202608
   */
  periodoDesde?: string;

  periodoHasta?: string;

  /**
   * 0 = sin proyección.
   * Máximo admitido por backend: 24.
   */
  mesesProyeccion?: number;

  estadosFactura?: ReporteFacturacionEstadoFactura[];

  zonaIds?: number[];

  creadorIds?: number[];

  clienteId?: number;

  metodosPago?: ReporteFacturacionMetodoPago[];

  origenesPago?: ReporteFacturacionOrigenPago[];

  cobradorIds?: number[];

  rutaIds?: number[];
}

// TIPO COMÚN

export type ReporteXlsxBlob = Blob;
