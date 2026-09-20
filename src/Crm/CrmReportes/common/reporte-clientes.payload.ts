import { ReporteClientesFiltersDto } from "@/Crm/features/reports/reportes.interfaces";
import type { ReporteClientesFormValues } from "../schemas/reporte-clientes.schema";

// =====================================================
// HELPERS
// =====================================================

function optionalTrimmed(value: string): string | undefined {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : undefined;
}

function optionalId(value: number | null): number | undefined {
  return value ?? undefined;
}

function optionalDate(value: string): string | undefined {
  return value || undefined;
}

// MAPPER

export function toReporteClientesFiltersDto(
  values: ReporteClientesFormValues,
): ReporteClientesFiltersDto {
  return {
    search: optionalTrimmed(values.search),

    estado: values.estado ?? undefined,

    estadoCobranza: values.estadoCobranza ?? undefined,

    servicioInternetId: optionalId(values.servicioInternetId),

    sectorId: optionalId(values.sectorId),

    municipioId: optionalId(values.municipioId),

    departamentoId: optionalId(values.departamentoId),

    fechaCreadoDesde: optionalDate(values.creadoRange.start),

    fechaCreadoHasta: optionalDate(values.creadoRange.end),

    /**
     * No omitimos false.
     *
     * El filtro queda explícito y el backend
     * recibe exactamente la intención del usuario.
     */
    incluirEliminados: values.incluirEliminados,
  };
}
