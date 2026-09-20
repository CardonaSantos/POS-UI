import type {
  AccionAuditoriaPppoe,
  EstadoCuentaPppoe,
  EstadoOperacionPppoe,
  EstadoPasoPppoe,
  TipoOperacionPppoe,
  TipoPasoPppoe,
} from "./instalacion-pppoe-auditoria.interfaces";

export type PppoeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const dateTimeFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Guatemala",
});

export function formatPppoeDate(value?: string | null): string {
  if (!value) return "Sin registrar";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Fecha inválida"
    : dateTimeFormatter.format(date);
}

export function formatPppoeDuration(value?: number | null): string {
  if (value == null) return "Sin duración";

  if (value < 1000) return `${value} ms`;

  const seconds = value / 1000;
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes} min ${remainingSeconds} s`;
}

export function humanizePppoeEnum(value?: string | null): string {
  if (!value) return "Sin registrar";

  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getOperationTitle(value: TipoOperacionPppoe): string {
  const titles: Record<TipoOperacionPppoe, string> = {
    CREAR_SECRET: "Crear cuenta PPPoE en MikroTik",
    ACTIVAR_SECRET: "Activar cuenta PPPoE",
    SUSPENDER_SERVICIO: "Suspender servicio PPPoE",
    ELIMINAR_SECRET: "Eliminar cuenta PPPoE",
  };

  return titles[value];
}

export function getStepTitle(value: TipoPasoPppoe): string {
  const titles: Record<TipoPasoPppoe, string> = {
    CONECTAR_ROUTER: "Conectar al router",
    BUSCAR_SECRET: "Buscar secret",
    AGREGAR_SECRET: "Agregar secret",
    CONFIRMAR_SECRET: "Confirmar secret",
    HABILITAR_SECRET: "Habilitar secret",
    DESHABILITAR_SECRET: "Deshabilitar secret",
    REMOVER_SESION_ACTIVA: "Remover sesión activa",
    ELIMINAR_SECRET: "Eliminar secret",
  };

  return titles[value];
}

export function getAuditTitle(value: AccionAuditoriaPppoe): string {
  return humanizePppoeEnum(value);
}

export function getOperationTone(value: EstadoOperacionPppoe): PppoeTone {
  switch (value) {
    case "EXITOSA":
      return "success";
    case "FALLIDA":
      return "danger";
    case "PARCIAL":
      return "warning";
    case "EJECUTANDO":
      return "info";
    case "AUTORIZADA":
      return "primary";
    case "CANCELADA":
      return "neutral";
    default:
      return "warning";
  }
}

export function getStepTone(value: EstadoPasoPppoe): PppoeTone {
  switch (value) {
    case "EXITOSO":
      return "success";
    case "FALLIDO":
      return "danger";
    case "EJECUTANDO":
      return "info";
    case "OMITIDO":
      return "neutral";
    default:
      return "warning";
  }
}

export function getAccountTone(value: EstadoCuentaPppoe): PppoeTone {
  switch (value) {
    case "ACTIVA":
      return "success";
    case "ERROR":
      return "danger";
    case "SUSPENDIDA":
    case "EN_SUSPENSION":
      return "warning";
    case "EN_ACTIVACION":
    case "EN_INSTALACION":
    case "PENDIENTE_ACTIVACION":
    case "PENDIENTE_CREACION":
      return "info";
    case "ELIMINADA":
    case "CANCELADA":
      return "neutral";
    default:
      return "warning";
  }
}

export function getAuditTone(value: AccionAuditoriaPppoe): PppoeTone {
  if (
    value === "OPERACION_FALLIDA" ||
    value === "REAUTENTICACION_FALLIDA" ||
    value === "SINCRONIZACION_FALLIDA" ||
    value === "DESINCRONIZACION_DETECTADA" ||
    value === "DESINSTALACION_RECHAZADA"
  ) {
    return "danger";
  }

  if (
    value === "OPERACION_PARCIAL" ||
    value === "PREALTA_CANCELADA" ||
    value === "CREACION_CANCELADA" ||
    value === "OPERACION_CANCELADA"
  ) {
    return "warning";
  }

  if (
    value === "OPERACION_EXITOSA" ||
    value === "SERVICIO_ACTIVADO" ||
    value === "SERVICIO_REACTIVADO" ||
    value === "SECRET_CREADO" ||
    value === "SECRET_HABILITADO" ||
    value === "REAUTENTICACION_EXITOSA" ||
    value === "SINCRONIZACION_EXITOSA" ||
    value === "PREALTA_CREADA"
  ) {
    return "success";
  }

  if (
    value === "OPERACION_INICIADA" ||
    value === "OPERACION_CREADA" ||
    value === "OPERACION_REINTENTADA" ||
    value === "OPERACION_RECUPERADA"
  ) {
    return "info";
  }

  return "neutral";
}

export function stringifyPppoeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "No fue posible representar estos datos.";
  }
}
