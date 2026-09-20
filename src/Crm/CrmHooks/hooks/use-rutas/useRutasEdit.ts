import { useMemo, useState } from "react";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";

import type { UpdateRutaPayload } from "@/Crm/features/rutas/ruta-edit.types";

import {
  ITEMS_PER_PAGE,
  type SortDir,
  type SortField,
} from "@/Crm/CrmRutas/types/types";

import {
  type ClientesRutaParams,
  useClientesRuta,
  useCobradoresRuta,
  useSectoresSelect,
  useZonasFacturacion,
} from "@/Crm/CrmRutas/API/rutas-cobro.api";
import { useGetRutaToEdit, useUpdateRuta } from "./use-rutas";

function toNumberIds(values: string[]): number[] {
  return values
    .map(Number)
    .filter((value) => Number.isInteger(value) && value > 0);
}

export function useRutasEdit(rutaId: number, empresaId: number) {
  /*
   * searchInput:
   * texto que está escribiendo el usuario.
   *
   * search:
   * texto ya debounceado que realmente llega al API.
   */
  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [estado, setEstado] = useState<EstadoCliente | "TODOS">("TODOS");

  const [estadoCobranza, setEstadoCobranza] = useState<
    EstadoCobranzaCliente | "TODOS"
  >("TODOS");

  const [zonasFacturacionIDs, setZonasFacturacionIDs] = useState<string[]>([]);

  const [sectorIDs, setSectorIDs] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortField>("nombre");

  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);

  const clientesParams = useMemo<ClientesRutaParams>(
    () => ({
      empresaId,

      search: search.trim() || undefined,

      estado: estado === "TODOS" ? undefined : estado,

      estadoCobranza: estadoCobranza === "TODOS" ? undefined : estadoCobranza,

      zonaIds: toNumberIds(zonasFacturacionIDs),

      sectorIds: toNumberIds(sectorIDs),

      sortBy,
      sortDir,

      page,
      perPage,
    }),
    [
      empresaId,
      search,
      estado,
      estadoCobranza,
      zonasFacturacionIDs,
      sectorIDs,
      sortBy,
      sortDir,
      page,
      perPage,
    ],
  );

  const rutaQuery = useGetRutaToEdit(rutaId);

  const clientesQuery = useClientesRuta(clientesParams, {
    enabled: empresaId > 0,
  });

  const zonasQuery = useZonasFacturacion();

  const sectoresQuery = useSectoresSelect();

  const cobradoresQuery = useCobradoresRuta();

  const updateMutation = useUpdateRuta(rutaId);

  const clientes = clientesQuery.data?.items ?? [];

  const total = clientesQuery.data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const update = async (payload: UpdateRutaPayload) => {
    if (!Number.isInteger(rutaId) || rutaId <= 0) {
      throw new Error("El identificador de la ruta no es válido");
    }

    if (!empresaId) {
      throw new Error("No se encontró la empresa activa");
    }

    await updateMutation.mutateAsync(payload);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");

    setEstado("TODOS");
    setEstadoCobranza("TODOS");

    setZonasFacturacionIDs([]);
    setSectorIDs([]);

    setSortBy("nombre");
    setSortDir("asc");

    setPage(1);
  };

  const refetchAll = async () => {
    await Promise.all([
      rutaQuery.refetch(),
      clientesQuery.refetch(),
      zonasQuery.refetch(),
      sectoresQuery.refetch(),
      cobradoresQuery.refetch(),
    ]);
  };

  const isLoadingRuta = rutaQuery.isLoading;

  const isInitialClientes = clientesQuery.isLoading && clientes.length === 0;

  const isFetchingAny =
    rutaQuery.isFetching ||
    clientesQuery.isFetching ||
    zonasQuery.isFetching ||
    sectoresQuery.isFetching ||
    cobradoresQuery.isFetching;

  const errors = [
    rutaQuery.error,
    clientesQuery.error,
    zonasQuery.error,
    sectoresQuery.error,
    cobradoresQuery.error,
  ].filter(Boolean);

  return {
    // ruta
    ruta: rutaQuery.data,
    rutaError: rutaQuery.error,
    isLoadingRuta,

    // clientes disponibles
    clientes,
    clientesError: clientesQuery.error,
    total,
    totalPages,

    // catálogos
    zonas: zonasQuery.data ?? [],
    sectores: sectoresQuery.data ?? [],
    cobradores: cobradoresQuery.data ?? [],

    // búsqueda
    searchInput,
    setSearchInput,
    search,
    setSearch,

    // filtros
    estado,
    setEstado,

    estadoCobranza,
    setEstadoCobranza,

    zonasFacturacionIDs,
    setZonasFacturacionIDs,

    sectorIDs,
    setSectorIDs,

    sortBy,
    setSortBy,

    sortDir,
    setSortDir,

    // paginación
    page,
    setPage,

    perPage,
    setPerPage,

    // mutation
    update,
    isSubmitting: updateMutation.isPending,
    updateError: updateMutation.error,

    // estados
    isInitialClientes,
    isFetchingClientes: clientesQuery.isFetching,
    isFetchingAny,
    errors,

    // acciones
    clearFilters,
    refetchAll,

    refetchRuta: rutaQuery.refetch,
    refetchClientes: clientesQuery.refetch,
  };
}
