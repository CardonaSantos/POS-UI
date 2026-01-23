export enum InteresTipo {
  FIJO = "FIJO",
  VARIABLE = "VARIABLE",
}

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
  estado: string; // puedes luego tiparlo como enum EstadoCuota
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
  pagos: unknown[]; // puedes tiparlo luego si lo usas

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
