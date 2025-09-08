// /features/rutas-cobro/api.ts
import {
  useApiQuery,
  useApiMutation,
} from "@/hooks/genericoCall/genericoCallHook";
import type {
  ClienteInternetFromCreateRuta,
  EstadoCliente,
  FacturacionZona,
  Sector,
} from "../rutas-types";
import type { SortDir, SortField } from "../types/types";
import { UseQueryResult } from "@tanstack/react-query";

// Paginado genérico
export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
};

// Filtros que mandará el cliente al server
// api.ts
export type ClientesRutaParams = {
  search?: string;
  estado?: EstadoCliente;
  zonaIds?: number[]; // ← multi
  sectorIds?: number[]; // ← multi
  sortBy?: SortField;
  sortDir?: SortDir;
  page?: number;
  perPage?: number;
  empresaId?: number; // si tu backend lo usa
};

// Limpia undefined/null para no ensuciar la URL
// api.ts
const clean = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        !(Array.isArray(v) && v.length === 0) &&
        !(typeof v === "string" && v.trim() === "")
    )
  );

export const rutasCobroKeys = {
  base: ["rutas-cobro"] as const,
  clientes: (p?: Partial<ClientesRutaParams>) =>
    [...rutasCobroKeys.base, "clientes", p ?? {}] as const,
  zonas: () => [...rutasCobroKeys.base, "zonas"] as const,
  sectores: () => [...rutasCobroKeys.base, "sectores"] as const,
} as const;

// —— Queries —— //
export function useClientesRuta(
  params: Partial<ClientesRutaParams>
): UseQueryResult<Paged<ClienteInternetFromCreateRuta>, Error> {
  const initialPaged: Paged<ClienteInternetFromCreateRuta> = {
    items: [],
    total: 0,
    page: params.page ?? 1,
    perPage: params.perPage ?? 10,
  };

  return useApiQuery<Paged<ClienteInternetFromCreateRuta>>(
    rutasCobroKeys.clientes(params),
    "/internet-customer/get-customers-ruta",
    { params: clean(params) },
    {
      // En v5, placeholderData debe devolver TData, no undefined:
      placeholderData: (prev) => prev ?? initialPaged,
      initialData: initialPaged,
      retry: 1,
    }
  );
}

export function useZonasFacturacion() {
  return useApiQuery<FacturacionZona[]>(
    rutasCobroKeys.zonas(),
    "/facturacion-zona/get-zonas-facturacion-to-ruta",
    undefined,
    { initialData: [], retry: 1 }
  );
}

export function useSectoresSelect() {
  return useApiQuery<Sector[]>(
    rutasCobroKeys.sectores(),
    "/sector/sectores-to-select",
    undefined,
    { initialData: [], retry: 1 }
  );
}

// —— Mutations —— //
export type CrearRutaDTO = {
  nombreRuta: string;
  empresaId: number;
  clientes: number[];
  observaciones?: string;
  cobradorId?: number; // ← opcional
};

export function useCrearRutaMutation() {
  return useApiMutation<void, CrearRutaDTO>("post", "/ruta-cobro");
}
