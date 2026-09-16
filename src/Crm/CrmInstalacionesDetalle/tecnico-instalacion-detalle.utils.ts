import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import {
  formattFechaWithMinutes,
  formattShortFecha,
} from "@/utils/formattFechas";

/**
 * Acciones que pertenecen a la pantalla operativa
 * de la instalación.
 *
 * revelarCredenciales sigue existiendo en el contrato
 * del detalle por compatibilidad, pero ya no es una
 * acción ejecutable desde esta vista.
 *
 * La administración de una cuenta PPPoE existente
 * se realiza desde:
 *
 * /crm/pppoe/cuentas/:cuentaPppoeId
 */
export type InstalacionDetalleActionKey = Exclude<
  keyof DetalleInstalacionTecnicaResponse["acciones"],
  "revelarCredenciales"
>;

export type InstalacionDetalleActionRequest = {
  action: InstalacionDetalleActionKey;
  instalacionId: number;
  accesoInternetId?: number;
};

export type EstadoVisual = {
  label: string;
  tone: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
};

export function normalizeDetalleInstalacionTecnicaResponse(
  data: DetalleInstalacionTecnicaResponse,
): DetalleInstalacionTecnicaResponse {
  const source = asRecord(data);
  const agendaSource = asRecord(source.agenda);
  const cobroSource = asRecord(source.cobro);
  const accessSource = Array.isArray(source.accesos) ? source.accesos : [];
  const evidenceSource = Array.isArray(source.evidencias)
    ? source.evidencias
    : [];

  return {
    ...data,
    agenda: {
      ...data.agenda,
      cancelacion: readNullableString(
        agendaSource.cancelacion ?? agendaSource.canceladaEn,
      ),
      activacionServicio: readNullableString(
        agendaSource.activacionServicio ?? agendaSource.servicioActivadoEn,
      ),
    },
    cobro: {
      ...data.cobro,
      costoInstalacion: readAmount(cobroSource.costoInstalacion),
      costoMateriales: readAmount(cobroSource.costoMateriales),
      costoManoObra: readAmount(cobroSource.costoManoObra),
      costoOtros: readAmount(cobroSource.costoOtros),
      montoCobradoCliente: readAmount(cobroSource.montoCobradoCliente),
      pendienteCobrar: readAmount(cobroSource.pendienteCobrar),
      notas: readNullableString(cobroSource.notas),
    },
    accesos: data.accesos.map((acceso, index) => {
      const current = asRecord(accessSource[index]);

      return {
        ...acceso,
        accesoInternetId:
          readPositiveInteger(current.accesoInternetId ?? current.id) ??
          acceso.accesoInternetId,
      };
    }),
    evidencias: data.evidencias.map((evidencia, index) => {
      const current = asRecord(evidenceSource[index]);

      return {
        ...evidencia,
        evidenciaId:
          readPositiveInteger(current.evidenciaId ?? current.id) ??
          evidencia.evidenciaId,
      };
    }),
  };
}

export function getEstadoVisual(
  estado: EstadoInstalacionCliente,
): EstadoVisual {
  switch (estado) {
    case EstadoInstalacionCliente.PROGRAMADA:
      return { label: "Programada", tone: "info" };
    case EstadoInstalacionCliente.REPROGRAMADA:
      return { label: "Reprogramada", tone: "warning" };
    case EstadoInstalacionCliente.EN_PROCESO:
      return { label: "En proceso", tone: "primary" };
    case EstadoInstalacionCliente.COMPLETADA:
      return { label: "Completada", tone: "success" };
    case EstadoInstalacionCliente.CANCELADA:
      return { label: "Cancelada", tone: "neutral" };
    case EstadoInstalacionCliente.FALLIDA:
      return { label: "Fallida", tone: "danger" };
    default:
      return { label: formatEnumValue(estado), tone: "neutral" };
  }
}

export function formatTipo(tipo: TipoInstalacionCliente) {
  return formatEnumValue(tipo);
}

export function formatEnumValue(value: string | null | undefined) {
  if (!value) return "Sin definir";

  const normalized = value.toLocaleLowerCase("es-GT").replace(/_/g, " ");
  return normalized.charAt(0).toLocaleUpperCase("es-GT") + normalized.slice(1);
}

export function formatDateTime(value: string | null | undefined) {
  if (!isValidDate(value)) return null;
  return formattFechaWithMinutes(value as string);
}

export function formatShortDate(value: string | null | undefined) {
  if (!isValidDate(value)) return null;
  return formattShortFecha(value as string);
}

export function getInstallationInitialTotal(
  detalle: DetalleInstalacionTecnicaResponse,
) {
  return (
    toFiniteAmount(detalle.servicioInternet?.precio) +
    // toFiniteAmount(detalle.cobro.costoInstalacion) +
    toFiniteAmount(detalle.cobro.costoMateriales) +
    toFiniteAmount(detalle.cobro.costoManoObra) +
    toFiniteAmount(detalle.cobro.costoOtros)
  );
}

export function getPrimaryWorkflowAction(
  detalle: DetalleInstalacionTecnicaResponse,
): InstalacionDetalleActionKey | null {
  if (detalle.acciones.completar.habilitada) return "completar";
  if (detalle.acciones.iniciar.habilitada) return "iniciar";
  if (detalle.acciones.reprogramar.habilitada) return "reprogramar";
  return null;
}

export function getActionLabel(action: InstalacionDetalleActionKey): string {
  switch (action) {
    case "iniciar":
      return "Iniciar instalación";

    case "completar":
      return "Finalizar instalación";

    case "reprogramar":
      return "Reprogramar";

    case "cancelar":
      return "Cancelar instalación";

    case "subirEvidencia":
      return "Subir evidencias";

    case "reintentarPrealta":
      return "Reintentar prealta";

    default:
      return "Acción";
  }
}

export function getActionDisabledReason(
  detalle: DetalleInstalacionTecnicaResponse,
  action: InstalacionDetalleActionKey,
  hasHandler: boolean,
) {
  const config = detalle.acciones[action];

  if (!config.habilitada) {
    return config.motivo ?? "Acción no disponible.";
  }

  if (!hasHandler) {
    return "Acción pendiente de conectar.";
  }

  return undefined;
}

export function getCoordinatesUrl(
  latitud: number | null,
  longitud: number | null,
) {
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) return null;
  return `https://www.google.com/maps?q=${latitud},${longitud}`;
}

export function getEvidenceAlt(
  evidencia: DetalleInstalacionTecnicaResponse["evidencias"][number],
) {
  return (
    evidencia.titulo?.trim() ||
    evidencia.descripcion?.trim() ||
    `Evidencia ${formatEnumValue(evidencia.tipo)}`
  );
}

function isValidDate(value: string | null | undefined) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function toFiniteAmount(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function readAmount(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const record = asRecord(value);
  const parsed = Number(record.amount ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPositiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function readNullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
