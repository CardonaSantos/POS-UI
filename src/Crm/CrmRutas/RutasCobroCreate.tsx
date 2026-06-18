"use client";

import * as React from "react";
import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataTable } from "@/components/app/table/app-data-table";
import {
  normalizeAppPayload,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { useRutasCreate } from "../CrmHooks/hooks/useRutasCreate";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";

import type { ClienteInternetFromCreateRuta } from "../features/rutas/rutas.interfaces";
import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "../features/cliente-interfaces/cliente-types";
import type { SortDir, SortField } from "../CrmRutas/types/types";

import {
  RutasCreateFilters,
  type RutasCreateFiltersState,
} from "./_components/rutas-create-filters";
import {
  RutasCreateFormCard,
  type RutaCreateFormState,
} from "./_components/rutas-create-form-card";
import { createRutasClientesColumns } from "./_components/rutas-create.columns";
import { AppOption } from "../CrmCustomers/customer-table.constants";
import { formattMonedaGT } from "../Utils/formattMonedaGT";
import {
  INITIAL_RUTAS_COLUMN_VISIBILITY,
  RUTAS_PAGE_SIZE_OPTIONS,
} from "./_components/rutas_create_constants";

function getClienteAmount(cliente: ClienteInternetFromCreateRuta) {
  const facturasTotal = (cliente.facturas ?? []).reduce(
    (sum, factura) => sum + Number(factura.montoFactura ?? 0),
    0,
  );

  return facturasTotal || Number(cliente.saldoPendiente ?? 0);
}

function toOptionList<T extends { id: number; nombre: string }>(
  items: T[] | undefined,
  options?: {
    withCount?: boolean;
    getCount?: (item: T) => number | undefined;
  },
): AppOption[] {
  return (items ?? []).map((item) => {
    const count = options?.getCount?.(item);

    return {
      value: String(item.id),
      label:
        options?.withCount && typeof count === "number"
          ? `${item.nombre} (${count})`
          : item.nombre,
    };
  });
}

export function RutasCobroCreate() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const vm = useRutasCreate(empresaId);

  const confirmDialog = useAppDisclosure();

  const routeForm = useAppStateHandlers<RutaCreateFormState>({
    nombreRuta: "",
    cobradorId: null,
    observaciones: "",
  });

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [selectedClientIds, setSelectedClientIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [selectedClientAmounts, setSelectedClientAmounts] = React.useState<
    Record<string, number>
  >({});

  const [columnVisibility, setColumnVisibility] = React.useState(
    INITIAL_RUTAS_COLUMN_VISIBILITY,
  );

  const { data: rawUsers = [] } = useGetUsersToSelect();

  const columns = React.useMemo(() => createRutasClientesColumns(), []);

  const cobradorOptions = React.useMemo<AppOption[]>(
    () =>
      rawUsers.map((user) => ({
        value: String(user.id),
        label: user.nombre,
      })),
    [rawUsers],
  );

  const zonaOptions = React.useMemo<AppOption[]>(
    () =>
      toOptionList(vm.zonas as any[], {
        withCount: true,
        getCount: (zona: any) => zona.clientesCount,
      }),
    [vm.zonas],
  );

  const sectorOptions = React.useMemo<AppOption[]>(
    () =>
      toOptionList(vm.sectores as any[], {
        withCount: true,
        getCount: (sector: any) => sector.clientesCount,
      }),
    [vm.sectores],
  );

  const selectedCount = selectedClientIds.size;

  const totalACobrar = React.useMemo(
    () =>
      Object.values(selectedClientAmounts).reduce(
        (sum, amount) => sum + Number(amount || 0),
        0,
      ),
    [selectedClientAmounts],
  );

  const canCreate =
    routeForm.state.nombreRuta.trim().length > 0 &&
    selectedCount > 0 &&
    !vm.isSubmitting;

  const filterState: RutasCreateFiltersState = React.useMemo(
    () => ({
      search: vm.search,
      estado: vm.estado,
      estadoCobranza: vm.estadoCobranza,
      zonasFacturacionIDs: vm.zonasFacturacionIDs,
      sectorIDs: vm.sectorIDs,
      sort: `${vm.sortBy}-${vm.sortDir}`,
    }),
    [
      vm.search,
      vm.estado,
      vm.estadoCobranza,
      vm.zonasFacturacionIDs,
      vm.sectorIDs,
      vm.sortBy,
      vm.sortDir,
    ],
  );

  const sorting: SortingState = React.useMemo(
    () => [
      {
        id: vm.sortBy,
        desc: vm.sortDir === "desc",
      },
    ],
    [vm.sortBy, vm.sortDir],
  );

  React.useEffect(() => {
    const next: RowSelectionState = {};

    vm.clientes.forEach((cliente) => {
      if (selectedClientIds.has(String(cliente.id))) {
        next[String(cliente.id)] = true;
      }
    });

    setRowSelection(next);
  }, [vm.clientes, selectedClientIds]);

  const handleResetPage = () => {
    vm.setPage(1);
  };

  const handleSearchChange = (value: string) => {
    vm.setSearch(value);
  };

  const handleDebouncedSearchChange = (value: string) => {
    vm.setSearch(value);
    handleResetPage();
  };

  const handleEstadoChange = (value: string | null) => {
    vm.setEstado((value ?? "TODOS") as EstadoCliente | "TODOS");
    handleResetPage();
  };

  const handleEstadoCobranzaChange = (value: string | null) => {
    vm.setEstadoCobranza((value ?? "TODOS") as EstadoCobranzaCliente | "TODOS");
    handleResetPage();
  };

  const handleZonasChange = (values: string[]) => {
    vm.setZonasFacturacionIDs(values);
    handleResetPage();
  };

  const handleSectoresChange = (values: string[]) => {
    vm.setSectorIDs(values);
    handleResetPage();
  };

  const handleSortChange = (value: string | null) => {
    if (!value) {
      vm.setSortBy("nombre" as SortField);
      vm.setSortDir("asc" as SortDir);
      handleResetPage();
      return;
    }

    const [field, direction] = value.split("-");

    vm.setSortBy(field as SortField);
    vm.setSortDir((direction === "desc" ? "desc" : "asc") as SortDir);
    handleResetPage();
  };

  const handleClearFilters = () => {
    vm.setSearch("");
    vm.setEstado("TODOS");
    vm.setEstadoCobranza("TODOS");
    vm.setZonasFacturacionIDs([]);
    vm.setSectorIDs([]);
    vm.setSortBy("nombre" as SortField);
    vm.setSortDir("asc" as SortDir);
    vm.setPage(1);
  };

  const handleSortingChange = (nextSorting: SortingState) => {
    const first = nextSorting[0];

    if (!first) {
      vm.setSortBy("nombre" as SortField);
      vm.setSortDir("asc" as SortDir);
      handleResetPage();
      return;
    }

    vm.setSortBy(first.id as SortField);
    vm.setSortDir((first.desc ? "desc" : "asc") as SortDir);
    handleResetPage();
  };

  const handleRowSelectionChange = (next: RowSelectionState) => {
    const nextClients = new Set(selectedClientIds);
    const nextAmounts = { ...selectedClientAmounts };

    vm.clientes.forEach((cliente) => {
      const id = String(cliente.id);
      const isNowSelected = Boolean(next[id]);
      const wasSelected = nextClients.has(id);

      if (isNowSelected && !wasSelected) {
        nextClients.add(id);
        nextAmounts[id] = getClienteAmount(cliente);
      }

      if (!isNowSelected && wasSelected) {
        nextClients.delete(id);
        delete nextAmounts[id];
      }
    });

    setSelectedClientIds(nextClients);
    setSelectedClientAmounts(nextAmounts);
    setRowSelection(next);
  };

  const handleClearSelection = () => {
    setSelectedClientIds(new Set());
    setSelectedClientAmounts({});
    setRowSelection({});
  };

  const handleCreateRuta = async () => {
    try {
      const clientesIds = Array.from(selectedClientIds);

      const payload = normalizeAppPayload(
        {
          nombreRuta: routeForm.state.nombreRuta,
          cobradorId: routeForm.state.cobradorId,
          observaciones: routeForm.state.observaciones,
          clientesIds,
        },
        {
          trimStrings: true,
          emptyStringToUndefined: true,
          removeUndefined: true,
        },
      ) as {
        nombreRuta: string;
        cobradorId?: string | number | null;
        observaciones?: string;
        clientesIds: string[];
      };

      await vm.create(payload);

      routeForm.patch({
        nombreRuta: "",
        cobradorId: null,
        observaciones: "",
      });

      handleClearSelection();
      confirmDialog.close();

      toast.success("Ruta creada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  return (
    <>
      <AppContainer size="full" paddingY="none" paddingX="none">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <AppBadge tone="info" appearance="soft">
              {vm.total} clientes encontrados
            </AppBadge>

            <AppBadge tone="success" appearance="soft">
              {selectedCount} seleccionados
            </AppBadge>

            <AppBadge tone="warning" appearance="soft">
              {formattMonedaGT(totalACobrar)} a cobrar
            </AppBadge>
          </div>

          <RutasCreateFormCard
            form={routeForm.state}
            cobradorOptions={cobradorOptions}
            selectedCount={selectedCount}
            totalACobrar={totalACobrar}
            isSubmitting={vm.isSubmitting}
            canCreate={canCreate}
            onFieldChange={(field, value) => routeForm.setField(field, value)}
            onOpenConfirm={confirmDialog.open}
          />

          <RutasCreateFilters
            filters={filterState}
            options={{
              zonas: zonaOptions,
              sectores: sectorOptions,
            }}
            isFetching={vm.isFetchingAny}
            onSearchChange={handleSearchChange}
            onSearchDebouncedChange={handleDebouncedSearchChange}
            onEstadoChange={handleEstadoChange}
            onEstadoCobranzaChange={handleEstadoCobranzaChange}
            onZonasChange={handleZonasChange}
            onSectoresChange={handleSectoresChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            onRefetch={vm.refetchAll}
          />

          <AppCard variant="outline" size="xs" radius="md">
            <AppDataTable<ClienteInternetFromCreateRuta>
              data={vm.clientes}
              columns={columns}
              getRowId={(row) => String(row.id)}
              isLoading={vm.isInitialClientes}
              isFetching={vm.isFetchingClientes}
              error={vm.errors?.[0]}
              onRetry={vm.refetchAll}
              paginationMode="server"
              pagination={{
                pageIndex: vm.page - 1,
                pageSize: vm.perPage,
                totalRows: vm.total,
                pageSizeOptions: RUTAS_PAGE_SIZE_OPTIONS,
                onPaginationChange: (pagination) => {
                  if (pagination.pageSize !== vm.perPage) {
                    vm.setPerPage(pagination.pageSize);
                    vm.setPage(1);
                    return;
                  }

                  vm.setPage(pagination.pageIndex + 1);
                },
              }}
              sorting={sorting}
              onSortingChange={handleSortingChange}
              rowSelection={rowSelection}
              onRowSelectionChange={handleRowSelectionChange}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              enableRowSelection
              enableColumnVisibility
              enableColumnPinning={false}
              enableVirtualization
              stickyHeader
              density="xs"
              maxHeight="62vh"
              emptyTitle="Sin clientes"
              emptyDescription="No hay clientes que coincidan con los filtros actuales."
            />
          </AppCard>
        </div>
      </AppContainer>

      <AppConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.setOpen}
        preset="confirm"
        tone="info"
        title="Confirmar creación de la ruta"
        description="Se creará una ruta de cobro con los clientes seleccionados."
        confirmText="Sí, crear ruta"
        cancelText="Cancelar"
        loadingText="Creando ruta..."
        isLoading={vm.isSubmitting}
        disabled={!canCreate}
        preventClose={vm.isSubmitting}
        closeOnConfirm={false}
        onConfirm={handleCreateRuta}
        size="sm"
        footerAlign="between"
      >
        <div className="space-y-2 text-xs text-[hsl(var(--app-muted-foreground))]">
          <div className="flex items-center justify-between gap-3">
            <span>Nombre</span>
            <span className="font-medium text-[hsl(var(--app-foreground))]">
              {routeForm.state.nombreRuta || "Sin nombre"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Clientes</span>
            <span className="font-medium text-[hsl(var(--app-foreground))]">
              {selectedCount}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Total estimado</span>
            <span className="font-medium text-[hsl(var(--app-foreground))]">
              {formattMonedaGT(totalACobrar)}
            </span>
          </div>
        </div>
      </AppConfirmDialog>
    </>
  );
}
