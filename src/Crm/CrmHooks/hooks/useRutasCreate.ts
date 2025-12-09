import { useState, useMemo } from "react";
import { ITEMS_PER_PAGE, SortDir, SortField } from "../../CrmRutas/types/types";
import {
  Paged,
  useClientesRuta,
  useCrearRutaMutation,
  useSectoresSelect,
  useZonasFacturacion,
} from "../../CrmRutas/API/rutas-cobro.api";
import { ClienteInternetFromCreateRuta } from "../../CrmRutas/rutas-types";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { EstadoCliente } from "@/Crm/features/cliente-interfaces/cliente-types";
type ClientesPaged = Paged<ClienteInternetFromCreateRuta>;

export function useRutasCreate(empresaId: number) {
  const userID = useStoreCrm((state) => state.userIdCRM) ?? 0;
  // ---- UI state (server-side) ----
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<EstadoCliente | "TODOS">("TODOS");
  const [zonasFacturacionIDs, setZonasFacturacionIDs] = useState<string[]>([]);

  const [sectorIDs, setSectorIDs] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortField>("nombre");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<string[]>([]);

  const [page, setPage] = useState(1); // 1-based para el server
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);
  const toNumArray = (arr: string[]) =>
    arr.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0); // evita 0/NaN (ajusta si 0 fuese válido)
  // ---- Params para el server ----
  const params = useMemo(
    () => ({
      empresaId, // si el backend lo necesita
      search: search || undefined,
      estado: estado === "TODOS" ? undefined : estado,
      zonaIds: toNumArray(zonasFacturacionIDs), // ← OK
      sectorIds: toNumArray(sectorIDs), // ← OK
      sortBy,
      sortDir,
      page,
      perPage,
    }),
    [
      empresaId,
      search,
      estado,
      zonasFacturacionIDs,
      sectorIDs,
      sortBy,
      sortDir,
      page,
      perPage,
    ]
  );

  // ---- Queries ----
  const {
    data: clientesDataRaw,
    isLoading: isLoadingClientes,
    isFetching: isFetchingClientes,
    error: clientesError,
    refetch: refetchClientes,
  } = useClientesRuta(params);

  const clientesData = clientesDataRaw as ClientesPaged | undefined;

  const zonasQ = useZonasFacturacion();
  const sectoresQ = useSectoresSelect();

  const refetchAll = () => {
    refetchClientes();
    zonasQ.refetch();
    sectoresQ.refetch();
  };

  // ---- Derivados ----
  const isInitialClientes =
    isLoadingClientes && (clientesData?.items?.length ?? 0) === 0;

  const pageData = (clientesData?.items ??
    []) as ClienteInternetFromCreateRuta[];
  const total = clientesData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const areAllInPageSelected =
    pageData.length > 0 &&
    pageData.every((c) => selected.includes(String(c.id)));

  const totalACobrar = useMemo(
    () =>
      pageData
        .filter((c) => selected.includes(String(c.id)))
        .reduce((sum, c) => sum + (c.saldoPendiente || 0), 0),
    [pageData, selected]
  );

  // ---- Mutation crear ruta ----
  // useRutasCreate.ts (solo el create)
  const crearRuta = useCrearRutaMutation();

  const create = async (form: {
    nombreRuta: string;
    cobradorId?: string | number | null;
    observaciones?: string;
    clientesIds: string[]; // 👈 ahora obligatorio aquí
    asignadaPor?: number;
  }) => {
    const { nombreRuta, cobradorId, observaciones, clientesIds } = form;

    if (!nombreRuta.trim())
      throw new Error("El nombre de la ruta es obligatorio");
    if ((clientesIds?.length ?? 0) === 0)
      throw new Error("Seleccione al menos una factura");
    if (!empresaId) throw new Error("Empresa requerida");

    // Ajusta al DTO real de tu backend:
    // Si tu backend espera { facturas: number[] }:
    const payload: any /* CrearRutaDTO */ = {
      nombreRuta,
      cobradorId: cobradorId ? Number(cobradorId) : undefined,
      empresaId,
      clientesIds: clientesIds.map(Number), // 👈 importante
      observaciones: observaciones?.trim() || undefined,
      asignadoPor: userID,
    };

    await crearRuta.mutateAsync(payload);

    // refrescos
    refetchAll();

    // limpia filtros/paginación si quieres
    setSearch("");
    setPage(1);
  };

  // ---- Flags combinados ----
  const isFetchingAny =
    isFetchingClientes || zonasQ.isFetching || sectoresQ.isFetching;

  const errors = [clientesError, zonasQ.error, sectoresQ.error].filter(
    Boolean
  ) as any[];

  return {
    // data
    clientes: pageData,
    zonas: zonasQ.data ?? [],
    sectores: sectoresQ.data ?? [],
    total,
    totalPages,

    // ui (server-side)
    search,
    setSearch,
    estado,
    setEstado,
    zonasFacturacionIDs,
    setZonasFacturacionIDs,
    sectorIDs,
    setSectorIDs,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,

    // selección / totales
    selected,
    setSelected,
    areAllInPageSelected,
    totalACobrar,

    // paginación server-side
    page,
    setPage,
    perPage,
    setPerPage,

    // mutation
    create,
    isSubmitting: crearRuta.isPending,
    createError: crearRuta.error,

    // flags
    isFetchingAny,
    isInitialClientes,
    isFetchingClientes,
    errors,

    // refetch
    refetchClientes,
    refetchAll,
  };
}
