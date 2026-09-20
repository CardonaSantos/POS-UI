import { ReporteTicketsFiltersDto } from "@/Crm/features/reports/reportes.interfaces";
import type { ReporteTicketsFormValues } from "../schemas/reporte-tickets.schema";

function optionalArray<T>(values: T[]): T[] | undefined {
  return values.length > 0 ? values : undefined;
}

export function toReporteTicketsFiltersDto(
  values: ReporteTicketsFormValues,
): ReporteTicketsFiltersDto {
  const hasPeriodo =
    values.periodo.start.length > 0 && values.periodo.end.length > 0;

  return {
    fechaDesde: hasPeriodo ? values.periodo.start : undefined,

    fechaHasta: hasPeriodo ? values.periodo.end : undefined,

    agrupacion: values.agrupacion,

    estados: optionalArray(values.estados),

    prioridades: optionalArray(values.prioridades),

    etiquetaIds: optionalArray(values.etiquetaIds),

    tecnicoIds: optionalArray(values.tecnicoIds),

    clienteId: values.clienteId ?? undefined,
  };
}
