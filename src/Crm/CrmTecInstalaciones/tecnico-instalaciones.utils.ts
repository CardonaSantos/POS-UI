import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";
import type { InstalacionTecnicaAsignada } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import {
  formattFechaWithMinutes,
  formattShortFecha,
} from "@/utils/formattFechas";

const TERMINAL_STATES = new Set<EstadoInstalacionCliente>([
  EstadoInstalacionCliente.COMPLETADA,
  EstadoInstalacionCliente.CANCELADA,
  EstadoInstalacionCliente.FALLIDA,
]);

const PENDING_START_STATES = new Set<EstadoInstalacionCliente>([
  EstadoInstalacionCliente.PROGRAMADA,
  EstadoInstalacionCliente.REPROGRAMADA,
]);

type CobroResumenConExtras = InstalacionTecnicaAsignada["cobro"] & {
  costoMateriales?: number;
  costoManoObra?: number;
  costoOtros?: number;
};

export type InstalacionesSummaryData = {
  active: number;
  overdue: number;
  pendingStart: number;
  inProgress: number;
  completed: number;
};

export type AgendaDisplay = {
  text: string;
  emphasize: boolean;
};

export function buildInstalacionesSummary(
  instalaciones: InstalacionTecnicaAsignada[],
): InstalacionesSummaryData {
  return instalaciones.reduce<InstalacionesSummaryData>(
    (summary, instalacion) => {
      if (!isTerminalInstallation(instalacion.estado)) {
        summary.active += 1;
      }

      if (isOverdueInstallation(instalacion)) {
        summary.overdue += 1;
      } else if (isPendingStart(instalacion.estado)) {
        summary.pendingStart += 1;
      }

      if (instalacion.estado === EstadoInstalacionCliente.EN_PROCESO) {
        summary.inProgress += 1;
      }

      if (instalacion.estado === EstadoInstalacionCliente.COMPLETADA) {
        summary.completed += 1;
      }

      return summary;
    },
    {
      active: 0,
      overdue: 0,
      pendingStart: 0,
      inProgress: 0,
      completed: 0,
    },
  );
}

export function isTerminalInstallation(estado: EstadoInstalacionCliente) {
  return TERMINAL_STATES.has(estado);
}

export function isPendingStart(estado: EstadoInstalacionCliente) {
  return PENDING_START_STATES.has(estado);
}

export function isOverdueInstallation(
  instalacion: InstalacionTecnicaAsignada,
) {
  if (!isPendingStart(instalacion.estado)) return false;

  const scheduledAt = toValidDate(instalacion.agenda.programadaPara);
  return scheduledAt ? scheduledAt.getTime() < Date.now() : false;
}

/**
 * Total inicial operativo mostrado al técnico:
 * plan + costo de instalación + materiales + mano de obra + otros.
 *
 * Los tres costos detallados todavía no aparecen en el listado actual;
 * se toman como 0 hasta que el presenter los incluya.
 */
export function getInitialInstallationTotal(
  instalacion: InstalacionTecnicaAsignada,
) {
  const cobro = instalacion.cobro as CobroResumenConExtras;

  return (
    toAmount(instalacion.servicioInternet?.precio) +
    toAmount(cobro.costoInstalacion) +
    toAmount(cobro.costoMateriales) +
    toAmount(cobro.costoManoObra) +
    toAmount(cobro.costoOtros)
  );
}

export function getAgendaDisplay(
  instalacion: InstalacionTecnicaAsignada,
): AgendaDisplay {
  if (instalacion.estado === EstadoInstalacionCliente.COMPLETADA) {
    const date = formatShortDate(
      instalacion.agenda.finalizacionReal ??
        instalacion.agenda.inicioReal ??
        instalacion.agenda.programadaPara,
    );

    return {
      text: date ? `Finalizada ${date}` : "Finalización sin fecha",
      emphasize: false,
    };
  }

  if (instalacion.estado === EstadoInstalacionCliente.EN_PROCESO) {
    const date = formatDateWithMinutes(
      instalacion.agenda.inicioReal ?? instalacion.agenda.programadaPara,
    );

    return {
      text: date ? `Iniciada ${date}` : "Instalación en proceso",
      emphasize: false,
    };
  }

  const date = formatDateWithMinutes(instalacion.agenda.programadaPara);
  const overdue = isOverdueInstallation(instalacion);

  return {
    text: date
      ? overdue
        ? `Inicio vencido: ${date}`
        : `Iniciar ${date}`
      : "Hora de inicio pendiente",
    emphasize: overdue,
  };
}

export function getEstadoVisual(estado: EstadoInstalacionCliente) {
  switch (estado) {
    case EstadoInstalacionCliente.PROGRAMADA:
      return { label: "Programada", tone: "info" as const };
    case EstadoInstalacionCliente.REPROGRAMADA:
      return { label: "Reprogramada", tone: "warning" as const };
    case EstadoInstalacionCliente.EN_PROCESO:
      return { label: "En proceso", tone: "primary" as const };
    case EstadoInstalacionCliente.COMPLETADA:
      return { label: "Completada", tone: "success" as const };
    case EstadoInstalacionCliente.CANCELADA:
      return { label: "Cancelada", tone: "neutral" as const };
    case EstadoInstalacionCliente.FALLIDA:
      return { label: "Fallida", tone: "danger" as const };
    default:
      return { label: formatEnumValue(estado), tone: "neutral" as const };
  }
}

export function formatTipo(tipo: TipoInstalacionCliente) {
  return formatEnumValue(tipo);
}

function formatEnumValue(value: string) {
  const normalized = value.toLocaleLowerCase("es-GT").replace(/_/g, " ");
  return normalized.charAt(0).toLocaleUpperCase("es-GT") + normalized.slice(1);
}

function formatDateWithMinutes(value: string | null) {
  if (!toValidDate(value)) return null;
  return formattFechaWithMinutes(value as string);
}

function formatShortDate(value: string | null) {
  if (!toValidDate(value)) return null;
  return formattShortFecha(value as string);
}

function toValidDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toAmount(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}
