import type { VisibilityState } from "@tanstack/react-table";
import type { ClasificacionCliente } from "@/Crm/features/credito/credito-interfaces";

export type AppOption<TValue extends string | number = string> = {
  value: TValue;
  label: string;
};

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100, 200];

export const INITIAL_CUSTOMER_COLUMN_VISIBILITY: VisibilityState = {
  direccion: false,
  creadoEn: false,
  sector: false,
  clasificacionCredito: false,
};

export const ESTADOS_CLIENTE_OPTIONS: AppOption[] = [
  { value: "ACTIVO", label: "Activo" },
  { value: "PENDIENTE_ACTIVO", label: "Pendiente activo" },
  { value: "PAGO_PENDIENTE", label: "Pago pendiente" },
  { value: "MOROSO", label: "Moroso" },
  { value: "ATRASADO", label: "Atrasado" },
  { value: "SUSPENDIDO", label: "Suspendido" },
  { value: "DESINSTALADO", label: "Desinstalado" },
  { value: "EN_INSTALACION", label: "En instalación" },
];

export const ESTADOS_COBRANZA_OPTIONS: AppOption[] = [
  { value: "AL_DIA", label: "Al día" },
  { value: "PAGO_PENDIENTE", label: "Pago pendiente" },
  { value: "ATRASADO", label: "Atrasado" },
  { value: "MOROSO", label: "Moroso" },
];

export const FACTURA_ESTADO_OPTIONS: AppOption[] = [
  { value: "PAGADA", label: "Pagada" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PARCIAL", label: "Parcial" },
  { value: "VENCIDA", label: "Vencida" },
];

export const CUSTOMER_SORT_OPTIONS: AppOption[] = [
  { value: "ip-asc", label: "IP ascendente" },
  { value: "ip-desc", label: "IP descendente" },
  { value: "nombre-asc", label: "Nombre ascendente" },
  { value: "nombre-desc", label: "Nombre descendente" },
  { value: "fechapago-asc", label: "Fecha creación ascendente" },
  { value: "fechapago-desc", label: "Fecha creación descendente" },
];

export const CUSTOMER_SORT_FIELD_MAP: Record<string, string> = {
  ip: "direccionIp",
  nombre: "nombreCompleto",
  fechapago: "creadoEn",
};

export const ESTADO_CLIENTE_LABELS: Record<string, string> = {
  ACTIVO: "Activo",
  PENDIENTE_ACTIVO: "Pendiente",
  PAGO_PENDIENTE: "Pago pend.",
  MOROSO: "Moroso",
  ATRASADO: "Atrasado",
  SUSPENDIDO: "Suspendido",
  DESINSTALADO: "Desinstalado",
  EN_INSTALACION: "Instalando",
};

export const ESTADO_CLIENTE_COBRANZA_LABELS: Record<string, string> = {
  AL_DIA: "Al día",
  PAGO_PENDIENTE: "Pago pend.",
  MOROSO: "Moroso",
  ATRASADO: "Atrasado",
};

export const CLASIFICACION_CREDITO_LABELS: Record<
  ClasificacionCliente,
  string
> = {
  CONFIABLE: "Confiable",
  NO_APROBABLE: "No aprobable",
  RIESGO_ALTO: "Alto",
  RIESGO_MEDIO: "Medio",
};
