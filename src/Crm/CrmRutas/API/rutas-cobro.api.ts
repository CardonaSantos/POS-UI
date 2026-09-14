import type { UseQueryResult } from "@tanstack/react-query";

import { CRM } from "@/hooks/indexCalls";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
  type Sector,
} from "@/Crm/features/cliente-interfaces/cliente-types";

import type { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

import type { ClienteInternetFromCreateRuta } from "@/Crm/features/rutas/rutas.interfaces";

import type { SortDir, SortField } from "../types/types";

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
};

export type ClientesRutaParams = {
  empresaId?: number;

  search?: string;

  estado?: EstadoCliente;
  estadoCobranza?: EstadoCobranzaCliente;

  zonaIds?: number[];
  sectorIds?: number[];

  sortBy?: SortField;
  sortDir?: SortDir;

  page?: number;
  perPage?: number;
};

export interface CobradorRuta {
  id: number;
  nombre: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
}

export type CrearRutaDTO = {
  nombreRuta: string;

  empresaId: number;

  clientesIds: number[];

  observaciones?: string;

  cobradorId?: number;

  asignadoPor: number;
};

const { useApiMutation: useCrmMutation, useApiQuery: useCrmQuery } = CRM;

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      if (typeof value === "string" && value.trim() === "") {
        return false;
      }

      return true;
    }),
  );
}

export const rutasCobroKeys = {
  base: ["rutas-cobro"] as const,

  clientes: (params?: Partial<ClientesRutaParams>) =>
    [...rutasCobroKeys.base, "clientes", params ?? {}] as const,

  zonas: () => [...rutasCobroKeys.base, "zonas"] as const,

  sectores: () => [...rutasCobroKeys.base, "sectores"] as const,

  cobradores: () => [...rutasCobroKeys.base, "cobradores"] as const,
} as const;

export function useClientesRuta(
  params: Partial<ClientesRutaParams>,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<Paged<ClienteInternetFromCreateRuta>, Error> {
  return useCrmQuery<Paged<ClienteInternetFromCreateRuta>>(
    rutasCobroKeys.clientes(params),
    "/internet-customer/get-customers-ruta",
    {
      params: clean(params),
    },
    {
      retry: 1,
      enabled: options?.enabled ?? true,
    },
  );
}

export function useZonasFacturacion() {
  return useCrmQuery<FacturacionZona[]>(
    rutasCobroKeys.zonas(),
    "/facturacion-zona/get-zonas-facturacion-to-ruta",
    undefined,
    {
      initialData: [],
      retry: 1,
    },
  );
}

export function useSectoresSelect() {
  return useCrmQuery<Sector[]>(
    rutasCobroKeys.sectores(),
    "/sector/sectores-to-select",
    undefined,
    {
      initialData: [],
      retry: 1,
    },
  );
}

export function useCobradoresRuta() {
  return useCrmQuery<CobradorRuta[]>(
    rutasCobroKeys.cobradores(),
    "/user/get-users-to-rutas",
    undefined,
    {
      initialData: [],
      retry: 1,
    },
  );
}

export function useCrearRutaMutation() {
  return useCrmMutation<unknown, CrearRutaDTO>("post", "/ruta-cobro");
}
