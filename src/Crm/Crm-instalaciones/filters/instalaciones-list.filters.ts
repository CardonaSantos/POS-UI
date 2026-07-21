import type {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";
import { FiltrarClienteInstalacionesParams } from "@/Crm/features/instalaciones/filter";

export type InstalacionesDateRange = {
  start: string | null;
  end: string | null;
};

export type InstalacionesListFiltersState = {
  estado: EstadoInstalacionCliente | null;
  tipo: TipoInstalacionCliente | null;

  fechaProgramada: InstalacionesDateRange;
  fechaFinalizacion: InstalacionesDateRange;
};

export const INSTALACIONES_LIST_FILTERS_DEFAULT: InstalacionesListFiltersState =
  {
    estado: null,
    tipo: null,

    fechaProgramada: {
      start: null,
      end: null,
    },

    fechaFinalizacion: {
      start: null,
      end: null,
    },
  };

type ToInstalacionesQueryParamsInput = {
  empresaId: number;

  pageIndex: number;
  pageSize: number;

  search: string;

  filters: InstalacionesListFiltersState;
};

function optionalString(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

export function toInstalacionesQueryParams({
  empresaId,
  pageIndex,
  pageSize,
  search,
  filters,
}: ToInstalacionesQueryParamsInput): FiltrarClienteInstalacionesParams {
  return {
    empresaId,

    // TanStack usa base 0 y la API base 1.
    page: pageIndex + 1,
    limit: pageSize,

    search: optionalString(search),

    estado: filters.estado ?? undefined,
    tipo: filters.tipo ?? undefined,

    fechaProgramadaDesde: optionalString(filters.fechaProgramada.start),

    fechaProgramadaHasta: optionalString(filters.fechaProgramada.end),

    fechaFinalizacionDesde: optionalString(filters.fechaFinalizacion.start),

    fechaFinalizacionHasta: optionalString(filters.fechaFinalizacion.end),
  };
}
