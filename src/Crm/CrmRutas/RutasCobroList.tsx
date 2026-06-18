"use client";
import * as React from "react";
import { toast } from "sonner";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataTable } from "@/components/app/table/app-data-table";
import {
  normalizeAppPayload,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { downloadExcelRutaCobro } from "./api";
import { EstadoRuta, type Ruta } from "../features/rutas/rutas.interfaces";
import {
  useCloseRuta,
  useDeleteRuta,
  useGetRutas,
} from "../CrmHooks/hooks/use-rutas/use-rutas";
import type { QueryRutasDto } from "../CrmHooks/hooks/use-rutas/Qk";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import {
  RutasListFilters,
  RutasListFiltersState,
} from "./_components/regists/rutas-list-filters";
import {
  INITIAL_RUTAS_LIST_COLUMN_VISIBILITY,
  RUTAS_LIST_PAGE_SIZE_OPTIONS,
} from "./_components/regists/rutas_list_consts_";
import { AppOption } from "../CrmCustomers/customer-table.constants";
import { createRutasListColumns } from "./_components/regists/rutas-list.columns";
import { RutasDetailDialog } from "./_components/regists/rutas-detail-dialog";

type RutasResponse = {
  data: Ruta[];
  meta: {
    currentPage: number;
    pageCount: number;
    pageSize: number;
    totalCount: number;
  };
};

function normalizeRutasResponse(raw: unknown): RutasResponse {
  if (
    raw &&
    typeof raw === "object" &&
    Array.isArray((raw as any).data) &&
    (raw as any).meta
  ) {
    return raw as RutasResponse;
  }

  if (Array.isArray(raw)) {
    return {
      data: raw as Ruta[],
      meta: {
        currentPage: 1,
        pageCount: 1,
        pageSize: raw.length || 10,
        totalCount: raw.length,
      },
    };
  }

  return {
    data: [],
    meta: {
      currentPage: 1,
      pageCount: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
}

export function RutasCobroList() {
  const filters = useAppStateHandlers<RutasListFiltersState>({
    search: "",
    serverSearch: "",
    estadoRuta: "TODOS",
    cobradorId: null,
  });

  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 10,
    initialDensity: "xs",
    initialColumnVisibility: INITIAL_RUTAS_LIST_COLUMN_VISIBILITY,
  });

  const detailDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<Ruta>();
  const closeDialog = useAppConfirmHandler<Ruta>();

  const [selectedRuta, setSelectedRuta] = React.useState<Ruta | null>(null);

  const queryDto: QueryRutasDto = React.useMemo(
    () =>
      normalizeAppPayload(
        {
          page: table.pagination.pageIndex + 1,
          limit: table.pagination.pageSize,
          nombreRuta: filters.state.serverSearch || undefined,
          cobrador: filters.state.cobradorId
            ? Number(filters.state.cobradorId)
            : undefined,
          estado:
            filters.state.estadoRuta && filters.state.estadoRuta !== "TODOS"
              ? (filters.state.estadoRuta as EstadoRuta)
              : undefined,
        },
        {
          removeUndefined: true,
          emptyStringToUndefined: true,
        },
      ) as QueryRutasDto,
    [
      table.pagination.pageIndex,
      table.pagination.pageSize,
      filters.state.serverSearch,
      filters.state.cobradorId,
      filters.state.estadoRuta,
    ],
  );

  const rutasQuery = useGetRutas(queryDto);
  const rutasResponse = React.useMemo(
    () => normalizeRutasResponse(rutasQuery.data),
    [rutasQuery.data],
  );

  const rutas = rutasResponse.data;
  const meta = rutasResponse.meta;

  const { data: rawUsers = [] } = useGetUsersToSelect();

  const closeRutaMutation = useCloseRuta(closeDialog.target?.id ?? 0);
  const deleteRutaMutation = useDeleteRuta(deleteDialog.target?.id ?? 0);

  const cobradorOptions = React.useMemo<AppOption[]>(
    () =>
      rawUsers.map((user) => ({
        value: String(user.id),
        label: user.nombre,
      })),
    [rawUsers],
  );

  const handleViewRuta = React.useCallback(
    (ruta: Ruta) => {
      setSelectedRuta(ruta);
      detailDialog.open();
    },
    [detailDialog],
  );

  const handleDownloadExcelRutaCobro = React.useCallback(async (ruta: Ruta) => {
    try {
      const response = await downloadExcelRutaCobro(ruta.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `ruta_${ruta.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Descarga exitosa");
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessageAxios(error));
    }
  }, []);

  const handleDeleteRuta = React.useCallback(async () => {
    await deleteDialog.confirm(async () => {
      await toast.promise(deleteRutaMutation.mutateAsync(), {
        loading: "Eliminando ruta...",
        success: () => "Registro eliminado",
        error: (error) => getApiErrorMessageAxios(error),
      });
    });
  }, [deleteDialog, deleteRutaMutation]);

  const handleCloseRuta = React.useCallback(async () => {
    await closeDialog.confirm(async () => {
      await toast.promise(closeRutaMutation.mutateAsync(), {
        loading: "Cerrando ruta...",
        success: () => "Ruta cerrada",
        error: (error) => getApiErrorMessageAxios(error),
      });
    });
  }, [closeDialog, closeRutaMutation]);

  const columns = React.useMemo(
    () =>
      createRutasListColumns({
        onView: handleViewRuta,
        onDelete: deleteDialog.open,
        onClose: closeDialog.open,
        onDownloadExcel: handleDownloadExcelRutaCobro,
      }),
    [
      handleViewRuta,
      deleteDialog.open,
      closeDialog.open,
      handleDownloadExcelRutaCobro,
    ],
  );

  const resetPage = () => {
    table.resetPage();
  };

  const handleSearchChange = (value: string) => {
    filters.setField("search", value);
  };

  const handleSearchDebouncedChange = (value: string) => {
    filters.setField("serverSearch", value);
    resetPage();
  };

  const handleEstadoChange = (value: string | null) => {
    filters.setField("estadoRuta", value ?? "TODOS");
    resetPage();
  };

  const handleCobradorChange = (value: string | null) => {
    filters.setField("cobradorId", value);
    resetPage();
  };

  const handleClearFilters = () => {
    filters.patch({
      search: "",
      serverSearch: "",
      estadoRuta: "TODOS",
      cobradorId: null,
    });

    resetPage();
  };

  return (
    <>
      <AppContainer size="full" paddingY="none" paddingX="none">
        <div className="space-y-3">
          <RutasListFilters
            filters={filters.state}
            cobradorOptions={cobradorOptions}
            isFetching={rutasQuery.isFetching}
            onSearchChange={handleSearchChange}
            onSearchDebouncedChange={handleSearchDebouncedChange}
            onEstadoChange={handleEstadoChange}
            onCobradorChange={handleCobradorChange}
            onClearFilters={handleClearFilters}
          />

          <AppCard variant="outline" size="xs" radius="md">
            <AppDataTable<Ruta>
              data={rutas}
              columns={columns}
              getRowId={(row) => String(row.id)}
              isLoading={rutasQuery.isLoading}
              isFetching={rutasQuery.isFetching}
              error={rutasQuery.error}
              onRetry={() => rutasQuery.refetch()}
              paginationMode="server"
              pagination={table.getPaginationConfig({
                totalRows: meta.totalCount,
                pageSizeOptions: RUTAS_LIST_PAGE_SIZE_OPTIONS,
              })}
              {...table.getDataTableStateProps()}
              enableRowSelection={false}
              enableColumnVisibility
              enableColumnPinning={false}
              enableVirtualization
              stickyHeader
              density={table.density}
              maxHeight="68vh"
              emptyTitle="Sin rutas"
              emptyDescription={
                filters.state.serverSearch
                  ? `No se encontraron resultados para "${filters.state.serverSearch}".`
                  : "No hay rutas de cobro registradas."
              }
            />
          </AppCard>
        </div>
      </AppContainer>

      <RutasDetailDialog
        open={detailDialog.isOpen}
        ruta={selectedRuta}
        onOpenChange={detailDialog.setOpen}
      />

      <AppConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        title="Confirmar eliminación de ruta"
        description="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar ruta"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={deleteRutaMutation.isPending}
        preventClose={deleteRutaMutation.isPending}
        closeOnConfirm={false}
        onConfirm={handleDeleteRuta}
        size="sm"
        footerAlign="between"
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
          Ruta seleccionada:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground))]">
            {deleteDialog.target?.nombreRuta ?? "Sin nombre"}
          </span>
        </p>
      </AppConfirmDialog>

      <AppConfirmDialog
        open={closeDialog.isOpen}
        onOpenChange={closeDialog.setOpen}
        preset="warning"
        tone="warning"
        title="Confirmar cierre de ruta"
        description="Una vez cerrada, la ruta ya no estará disponible para realizar más cobros."
        confirmText="Cerrar ruta"
        cancelText="Cancelar"
        loadingText="Cerrando..."
        isLoading={closeRutaMutation.isPending}
        preventClose={closeRutaMutation.isPending}
        closeOnConfirm={false}
        onConfirm={handleCloseRuta}
        size="sm"
        footerAlign="between"
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
          No se eliminarán los registros históricos, pero la ruta quedará
          cerrada.
        </p>
      </AppConfirmDialog>
    </>
  );
}
