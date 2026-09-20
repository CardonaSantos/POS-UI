import type {
  CrearDesinstalacionPayload,
  CrearDesinstalacionTecnicoPayload,
} from "@/Crm/features/desinstalaciones/crear-desinstalacion.payload";
import { CrearDesinstalacionFormValues } from "../schemas/crear-desinstalacion.schema";

/**
 * Convierte un identificador requerido del formulario
 * a un number seguro para el payload HTTP.
 *
 * Zod ya valida estos campos antes del submit, pero el
 * tipo inferido conserva `number | null` porque nuestros
 * AppFormSingleSelect trabajan naturalmente con null.
 */
function requirePositiveId(value: number | null, field: string): number {
  if (value === null || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} debe contener un identificador válido.`);
  }

  return value;
}

/**
 * Convierte texto vacío a undefined.
 *
 * El formulario conserva siempre string para mantener
 * un contrato estable con AppFormTextarea.
 */
function optionalTrimmed(value: string): string | undefined {
  const normalized = value.trim();

  return normalized || undefined;
}

/**
 * Convierte el datetime-local del formulario a ISO.
 *
 * Ejemplo:
 *
 * 2026-08-15T09:00
 *
 * se interpreta según la zona horaria local del navegador
 * y se envía como un instante ISO al backend.
 */
function toIsoDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("La fecha programada no es válida.");
  }

  return date.toISOString();
}

/**
 * Transforma la selección sencilla utilizada por RHF:
 *
 * tecnicoIds: [4, 7]
 * tecnicoResponsableId: 4
 *
 * al contrato requerido por el backend.
 */
function toTecnicosPayload(
  tecnicoIds: number[],
  tecnicoResponsableId: number | null,
): CrearDesinstalacionTecnicoPayload[] {
  return tecnicoIds.map((tecnicoId) => {
    const esResponsable = tecnicoResponsableId === tecnicoId;

    return {
      tecnicoId,

      rol: esResponsable ? "RESPONSABLE" : "APOYO",

      esResponsable,
    };
  });
}

export function toCrearDesinstalacionPayload(
  values: CrearDesinstalacionFormValues,
): CrearDesinstalacionPayload {
  const clienteId = requirePositiveId(values.clienteId, "clienteId");

  const accesoInternetId = requirePositiveId(
    values.accesoInternetId,
    "accesoInternetId",
  );

  const tecnicos = toTecnicosPayload(
    values.tecnicoIds,
    values.tecnicoResponsableId,
  );

  const observaciones = optionalTrimmed(values.observaciones);

  return {
    clienteId,

    accesoInternetId,

    ...(values.ticketId !== null
      ? {
          ticketId: values.ticketId,
        }
      : {}),

    tipo: values.tipo,

    motivo: values.motivo,

    fechaProgramada: toIsoDateTime(values.fechaProgramada),

    requiereRetiroEquipo: values.requiereRetiroEquipo,

    ...(observaciones !== undefined
      ? {
          observaciones,
        }
      : {}),

    ...(tecnicos.length > 0
      ? {
          tecnicos,
        }
      : {}),
  };
}
