import { ReporteFacturacionFiltersDto } from "@/Crm/features/reports/reportes.interfaces";
import type { ReporteFacturacionFormValues } from "../schemas/reporte-facturacion.schema";

// HELPERS

function optionalArray<T>(values: T[]): T[] | undefined {
  return values.length > 0 ? values : undefined;
}

function toBackendPeriodo(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  /**
   * UI:
   * 2026-08
   *
   * API:
   * 202608
   */
  return value.replace("-", "");
}

// MAPPER

export function toReporteFacturacionFiltersDto(
  values: ReporteFacturacionFormValues,
): ReporteFacturacionFiltersDto {
  return {
    periodoDesde: toBackendPeriodo(values.periodoDesde),

    periodoHasta: toBackendPeriodo(values.periodoHasta),

    mesesProyeccion: Number(values.mesesProyeccion),

    estadosFactura: optionalArray(values.estadosFactura),

    zonaIds: optionalArray(values.zonaIds),

    creadorIds: optionalArray(values.creadorIds),

    clienteId: values.clienteId ?? undefined,

    metodosPago: optionalArray(values.metodosPago),

    origenesPago: optionalArray(values.origenesPago),

    cobradorIds: optionalArray(values.cobradorIds),

    rutaIds: optionalArray(values.rutaIds),
  };
}
