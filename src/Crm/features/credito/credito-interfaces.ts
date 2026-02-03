export enum InteresTipo {
  FIJO = "FIJO",
  VARIABLE = "VARIABLE",
}

export enum TipoArchivoCliente {
  DPI = "DPI",
  CASA = "CASA",
  NEGOCIO = "NEGOCIO",
  RECIBO_LUZ = "RECIBO_LUZ",
  OTRO = "OTRO",
}

export const TipoArchivoClienteArray = Object.values(TipoArchivoCliente);

export enum FrecuenciaPago {
  MENSUAL = "MENSUAL",
  QUINCENAL = "QUINCENAL",
  SEMANAL = "SEMANAL",
  CUSTOM = "CUSTOM",
}

export enum OrigenCredito {
  TIENDA = "TIENDA",
  CAMPO = "CAMPO",
  ONLINE = "ONLINE",
  REFERIDO = "REFERIDO",
  USUARIO = "USUARIO",
}

export const OrigenCreditoArray = [
  "TIENDA",
  "CAMPO",
  "ONLINE",
  "REFERIDO",
  "USUARIO",
] as const;

export enum EstadoCredito {
  ACTIVO = "ACTIVO",
  EN_MORA = "EN_MORA",
  COMPLETADO = "COMPLETADO",
  CANCELADO = "CANCELADO",
}

// INTERFACES
export interface CreditoCuotaResponse {
  id: number;
  creditoId: number;
  numeroCuota: number;
  fechaVenc: string; // ISO
  montoCapital: string;
  montoInteres: string;
  montoTotal: string;
  montoPagado: string;
  estado: EstadoCuota;
  moras: MoraCuota[];
}

export enum EstadoCuota {
  PENDIENTE = "PENDIENTE",
  PARCIAL = "PARCIAL",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
}

export interface CuotaResponse {
  id: number;
  creditoId: number;
  numeroCuota: number;
  fechaVenc: string;
  montoCapital: string;
  montoInteres: string;
  montoTotal: string;
  estado: EstadoCuota;
  montoPagado: string;
  moras?: MoraCuota[];
}

export interface PagoCuotaResponse {
  id: number;
  cuotaId: number;
  pagoCreditoId: number;
  monto: string;
  creadoEn: string;
}

export interface PagoCreditoResponse {
  id: number;
  creditoId: number;
  montoTotal: string;
  fechaPago: string;
  metodoPago?: string;
  referencia?: string;
  observacion?: string;
  creadoEn: string;
  aplicaciones: PagoCuotaResponse[];
  registradoPor: PagoCreditoRegistradoPor;
}

export interface PagoCreditoRegistradoPor {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface CreditoResponse {
  id: number;
  clienteId: number;

  montoCapital: string;
  interesPorcentaje: string;
  interesMoraPorcentaje: string;
  engancheMonto: string;

  interesTipo: InteresTipo;
  plazoCuotas: number;
  frecuencia: FrecuenciaPago;
  intervaloDias: number;

  fechaInicio: string; // ISO
  fechaFinEstimada: string; // ISO

  origenCredito: OrigenCredito;
  observaciones?: string | null;

  creadoPorId: number;
  estado: EstadoCredito;

  montoTotal: string;
  montoCuota: string;

  cuotas: CreditoCuotaResponse[];
  pagos: PagoCreditoResponse[];

  clienteNombre: string;
  usuarioNombre: string;
}
export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface GetCreditosResponse {
  data: CreditoResponse[];
  meta: PaginationMeta;
}

// INITIAL STATES
export const initialCredito: CreditoResponse = {
  id: 0,
  clienteId: 0,

  montoCapital: "0",
  interesPorcentaje: "0",
  interesMoraPorcentaje: "0",
  engancheMonto: "0",

  interesTipo: InteresTipo.FIJO,
  plazoCuotas: 0,
  frecuencia: FrecuenciaPago.MENSUAL,
  intervaloDias: 30,

  fechaInicio: "",
  fechaFinEstimada: "",

  origenCredito: OrigenCredito.USUARIO,
  observaciones: null,

  creadoPorId: 0,
  estado: EstadoCredito.ACTIVO,

  montoTotal: "0",
  montoCuota: "0",

  cuotas: [],
  pagos: [],

  clienteNombre: "",
  usuarioNombre: "",
};

export interface MoraCuota {
  id: number;
  diasMora: number;
  interes: string;
  calculadoEn: string;
  estado: EstadoMora;
}

export enum EstadoMora {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
}

export const initialCreditoResponse: GetCreditosResponse = {
  data: [],
  meta: {
    total: 0,
    page: 1,
    lastPage: 1,
  },
};

// VERIFICACION DE CLIENTE
export interface HistorialPagoUI {
  facturaId: number;
  pagadaATiempo: boolean;
  diferencia: number; // días (+ antes, - atraso)
  fechaVencimiento: string; // DD/MM/YYYY
  fechaPagada: string; // DD/MM/YYYY
}
export type ClasificacionCliente =
  | "CONFIABLE"
  | "RIESGO_MEDIO"
  | "RIESGO_ALTO"
  | "NO_APROBABLE";

export interface ResumenCreditoUI {
  puntualidadPct: number; // 0–100
  promedioAtraso: number; // días
  medianaAtraso: number; // días
  rachaActual: number; // facturas consecutivas / recientes
  score: number; // 0–100
  clasificacion: ClasificacionCliente;
}
export interface VerifyCustomerResponseUI {
  historial: HistorialPagoUI[];
  resumen: ResumenCreditoUI;
}
