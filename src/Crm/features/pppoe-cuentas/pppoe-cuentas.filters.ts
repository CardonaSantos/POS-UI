import type {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

import type { OrigenCuentaPppoe } from "./pppoe-cuentas.interfaces";

export type PppoeCuentasListFiltersState = {
  clienteId: number | null;

  servicioInternetId: number | null;

  mikrotikRouterId: number | null;

  perfilHomologacionId: number | null;

  estadoCuenta: EstadoCuentaPppoe | null;

  estadoAcceso: EstadoAccesoInternet | null;

  origen: OrigenCuentaPppoe | null;
};

export const PPPOE_CUENTAS_LIST_FILTERS_DEFAULT: PppoeCuentasListFiltersState =
  {
    clienteId: null,

    servicioInternetId: null,

    mikrotikRouterId: null,

    perfilHomologacionId: null,

    estadoCuenta: null,

    estadoAcceso: null,

    origen: null,
  };

/**
 * Query aceptado por:
 *
 * GET /pppoe-cuentas
 *
 * empresaId no se envía.
 * El backend lo obtiene del JWT.
 */
export type FiltrarPppoeCuentasParams = {
  page?: number;

  limit?: number;

  search?: string;

  clienteId?: number;

  servicioInternetId?: number;

  mikrotikRouterId?: number;

  perfilHomologacionId?: number;

  estadoCuenta?: EstadoCuentaPppoe;

  estadoAcceso?: EstadoAccesoInternet;

  origen?: OrigenCuentaPppoe;
};

type ToPppoeCuentasQueryParamsInput = {
  pageIndex: number;

  pageSize: number;

  search: string;

  filters: PppoeCuentasListFiltersState;
};

function optionalString(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

export function toPppoeCuentasQueryParams({
  pageIndex,
  pageSize,
  search,
  filters,
}: ToPppoeCuentasQueryParamsInput): FiltrarPppoeCuentasParams {
  return {
    page: pageIndex + 1,

    limit: pageSize,

    search: optionalString(search),

    clienteId: filters.clienteId ?? undefined,

    servicioInternetId: filters.servicioInternetId ?? undefined,

    mikrotikRouterId: filters.mikrotikRouterId ?? undefined,

    perfilHomologacionId: filters.perfilHomologacionId ?? undefined,

    estadoCuenta: filters.estadoCuenta ?? undefined,

    estadoAcceso: filters.estadoAcceso ?? undefined,

    origen: filters.origen ?? undefined,
  };
}
