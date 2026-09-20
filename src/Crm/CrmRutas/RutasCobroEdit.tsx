"use client";

import * as React from "react";

import { ArrowLeft, Trash2, Users } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import type { RowSelectionState, VisibilityState } from "@tanstack/react-table";

import { toast } from "sonner";

import { AppForm } from "@/components/app/form";

import { useAppDisclosure } from "@/components/app/handlers";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppGrid, AppGridItem } from "@/components/app/primitives/app-grid";

import { AppDataTable } from "@/components/app/table/app-data-table";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";

import type { ClienteInternetFromCreateRuta } from "@/Crm/features/rutas/rutas.interfaces";

import type { RutaEditDetail } from "@/Crm/features/rutas/ruta-edit.types";

import type { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";

import { useDeleteRuta } from "@/Crm/CrmHooks/hooks/use-rutas/use-rutas";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { type SortDir, type SortField } from "./types/types";

import {
  RutasClientesFilters,
  type RutasClientesFiltersState,
} from "./_components/rutas-clientes-filters";

import { createRutasClientesColumns } from "./_components/rutas-clientes.columns";

import { RutasEditCurrentClients } from "./_components/edit/rutas-edit-current-clients";

import { RutasEditFormCard } from "./_components/edit/rutas-edit-form-card";

import {
  INITIAL_RUTAS_COLUMN_VISIBILITY,
  RUTAS_PAGE_SIZE_OPTIONS,
} from "./_components/rutas_create_constants";

import {
  rutaEditDetailToFormValues,
  rutaEditFormToPayload,
} from "./common/rutas-edit-mapper";

import {
  rutaEditSchema,
  type RutaEditFormValues,
} from "./schemas/rutas-edit.schema";

import { EstadoRuta } from "../features/rutas/rutas.interfaces";

import { formattMonedaGT } from "../Utils/formattMonedaGT";
import { useRutasEdit } from "../CrmHooks/hooks/use-rutas/useRutasEdit";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const EMPTY_FORM_VALUES: RutaEditFormValues = {
  nombreRuta: "",
  cobradorId: null,
  estadoRuta: EstadoRuta.ACTIVO,
  observaciones: "",
  clientes: [],
};

function getClienteAmount(cliente: ClienteInternetFromCreateRuta): number {
  const facturasTotal = (cliente.facturas ?? []).reduce(
    (sum, factura) => sum + Number(factura.montoFactura ?? 0),
    0,
  );

  if (facturasTotal > 0) {
    return facturasTotal;
  }

  return Number(cliente.saldoPendiente ?? 0);
}

function normalizeClientIds(values: Iterable<string | number>): number[] {
  return Array.from(values)
    .map(Number)
    .filter((value) => Number.isInteger(value) && value > 0)
    .sort((a, b) => a - b);
}

function createRouteAmounts(ruta: RutaEditDetail): Record<string, number> {
  return ruta.clientes.reduce<Record<string, number>>(
    (accumulator, cliente) => {
      accumulator[String(cliente.id)] = Number(cliente.saldoPendiente ?? 0);

      return accumulator;
    },
    {},
  );
}

function toZonaOptions(
  zonas: Array<{
    id: number;
    nombre: string;
    nombreRuta?: string;
    clientesCount?: number;
    clientes?: number;
  }>,
): AppOption[] {
  return zonas.map((zona) => {
    const nombre = zona.nombreRuta?.trim() || zona.nombre;

    const count = zona.clientesCount ?? zona.clientes;

    return {
      value: String(zona.id),

      label: typeof count === "number" ? `${nombre} (${count})` : nombre,
    };
  });
}

function toSectorOptions(
  sectores: Array<{
    id: number;
    nombre: string;
    clientesCount?: number;
  }>,
): AppOption[] {
  return sectores.map((sector) => ({
    value: String(sector.id),

    label:
      typeof sector.clientesCount === "number"
        ? `${sector.nombre} (${sector.clientesCount})`
        : sector.nombre,
  }));
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function RutasCobroEdit() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const rutaId = Number(id);

  const isValidRutaId = Number.isInteger(rutaId) && rutaId > 0;

  const vm = useRutasEdit(rutaId, empresaId);

  const deleteMutation = useDeleteRuta(rutaId);

  const deleteDialog = useAppDisclosure();

  const discardDialog = useAppDisclosure();

  const form = useForm<RutaEditFormValues>({
    resolver: zodResolver(rutaEditSchema),

    defaultValues: EMPTY_FORM_VALUES,

    mode: "onChange",
  });

  /*
   * Evita que un refetch automático del detalle
   * sobrescriba cambios todavía no guardados.
   */
  const initializedRutaIdRef = React.useRef<number | null>(null);

  const [selectedClientAmounts, setSelectedClientAmounts] = React.useState<
    Record<string, number>
  >({});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(INITIAL_RUTAS_COLUMN_VISIBILITY);

  const columns = React.useMemo(() => createRutasClientesColumns(), []);

  const watchedClientes =
    useWatch({
      control: form.control,
      name: "clientes",
    }) ?? [];

  const selectedClientIds = React.useMemo(
    () => new Set(watchedClientes.map(String)),
    [watchedClientes],
  );

  const selectedCount = selectedClientIds.size;

  const totalACobrar = React.useMemo(() => {
    return Array.from(selectedClientIds).reduce(
      (total, clienteId) =>
        total + Number(selectedClientAmounts[clienteId] ?? 0),
      0,
    );
  }, [selectedClientIds, selectedClientAmounts]);

  /* ------------------------------------------------------------------------ */
  /* Inicialización de formulario                                             */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    if (!vm.ruta) {
      return;
    }

    if (initializedRutaIdRef.current === vm.ruta.id) {
      return;
    }

    const defaultValues = rutaEditDetailToFormValues(vm.ruta);

    form.reset(defaultValues);

    setSelectedClientAmounts(createRouteAmounts(vm.ruta));

    initializedRutaIdRef.current = vm.ruta.id;

    void form.trigger();
  }, [vm.ruta, form]);

  /*
   * Si hay cambios sin guardar y se recarga/cierra
   * el navegador, dejamos actuar la advertencia nativa.
   */
  React.useEffect(() => {
    if (!form.formState.isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [form.formState.isDirty]);

  /* ------------------------------------------------------------------------ */
  /* Options                                                                  */
  /* ------------------------------------------------------------------------ */

  const cobradorOptions = React.useMemo<AppOption[]>(() => {
    const options = vm.cobradores.map((cobrador) => ({
      value: String(cobrador.id),
      label: cobrador.nombre,
    }));

    /*
     * Si el cobrador actual dejó de aparecer
     * en el catálogo, conservamos su opción
     * para no mostrar el select vacío.
     */
    if (
      vm.ruta?.cobrador &&
      !options.some((option) => option.value === String(vm.ruta?.cobrador?.id))
    ) {
      options.unshift({
        value: String(vm.ruta.cobrador.id),
        label: vm.ruta.cobrador.nombre,
      });
    }

    return options;
  }, [vm.cobradores, vm.ruta?.cobrador]);

  const zonaOptions = React.useMemo<AppOption[]>(
    () => toZonaOptions(vm.zonas),
    [vm.zonas],
  );

  const sectorOptions = React.useMemo<AppOption[]>(
    () => toSectorOptions(vm.sectores),
    [vm.sectores],
  );

  /* ------------------------------------------------------------------------ */
  /* Selection                                                                */
  /* ------------------------------------------------------------------------ */

  const rowSelection = React.useMemo<RowSelectionState>(() => {
    const next: RowSelectionState = {};

    vm.clientes.forEach((cliente) => {
      const id = String(cliente.id);

      if (selectedClientIds.has(id)) {
        next[id] = true;
      }
    });

    return next;
  }, [vm.clientes, selectedClientIds]);

  const setSelectedClients = React.useCallback(
    (ids: Set<string>, amounts: Record<string, number>) => {
      const normalized = normalizeClientIds(ids);

      setSelectedClientAmounts(amounts);

      form.setValue("clientes", normalized, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const handleRowSelectionChange = React.useCallback(
    (next: RowSelectionState) => {
      const nextIds = new Set(selectedClientIds);

      const nextAmounts = {
        ...selectedClientAmounts,
      };

      /*
       * Solo modificamos los clientes
       * pertenecientes a la página actual.
       * Los seleccionados en otras páginas
       * permanecen intactos.
       */
      vm.clientes.forEach((cliente) => {
        const clienteId = String(cliente.id);

        const isNowSelected = Boolean(next[clienteId]);

        if (isNowSelected) {
          nextIds.add(clienteId);

          nextAmounts[clienteId] = getClienteAmount(cliente);

          return;
        }

        nextIds.delete(clienteId);

        delete nextAmounts[clienteId];
      });

      setSelectedClients(nextIds, nextAmounts);
    },
    [vm.clientes, selectedClientIds, selectedClientAmounts, setSelectedClients],
  );

  const handleRemoveCurrentClient = React.useCallback(
    (clienteId: string) => {
      const nextIds = new Set(selectedClientIds);

      const nextAmounts = {
        ...selectedClientAmounts,
      };

      nextIds.delete(clienteId);

      delete nextAmounts[clienteId];

      setSelectedClients(nextIds, nextAmounts);
    },
    [selectedClientIds, selectedClientAmounts, setSelectedClients],
  );

  const handleRestoreCurrentClient = React.useCallback(
    (clienteId: string) => {
      const cliente = vm.ruta?.clientes.find(
        (item) => String(item.id) === clienteId,
      );

      if (!cliente) {
        return;
      }

      const nextIds = new Set(selectedClientIds);

      const nextAmounts = {
        ...selectedClientAmounts,
      };

      nextIds.add(clienteId);

      nextAmounts[clienteId] = Number(cliente.saldoPendiente ?? 0);

      setSelectedClients(nextIds, nextAmounts);
    },
    [vm.ruta, selectedClientIds, selectedClientAmounts, setSelectedClients],
  );

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const filterState = React.useMemo<RutasClientesFiltersState>(
    () => ({
      search: vm.searchInput,

      estado: vm.estado,

      estadoCobranza: vm.estadoCobranza,

      zonasFacturacionIDs: vm.zonasFacturacionIDs,

      sectorIDs: vm.sectorIDs,

      sort: `${vm.sortBy}-${vm.sortDir}`,
    }),
    [
      vm.searchInput,
      vm.estado,
      vm.estadoCobranza,
      vm.zonasFacturacionIDs,
      vm.sectorIDs,
      vm.sortBy,
      vm.sortDir,
    ],
  );

  const handleSearchChange = (value: string) => {
    vm.setSearchInput(value);
  };

  const handleDebouncedSearchChange = (value: string) => {
    vm.setSearch(value);
    vm.setPage(1);
  };

  const handleEstadoChange = (value: string | null) => {
    vm.setEstado((value ?? "TODOS") as EstadoCliente | "TODOS");

    vm.setPage(1);
  };

  const handleEstadoCobranzaChange = (value: string | null) => {
    vm.setEstadoCobranza((value ?? "TODOS") as EstadoCobranzaCliente | "TODOS");

    vm.setPage(1);
  };

  const handleZonasChange = (values: string[]) => {
    vm.setZonasFacturacionIDs(values);

    vm.setPage(1);
  };

  const handleSectoresChange = (values: string[]) => {
    vm.setSectorIDs(values);
    vm.setPage(1);
  };

  const handleSortChange = (value: string | null) => {
    if (!value) {
      vm.setSortBy("nombre");
      vm.setSortDir("asc");
      vm.setPage(1);
      return;
    }

    const [field, direction] = value.split("-");

    const nextField: SortField = field === "saldo" ? "saldo" : "nombre";

    const nextDirection: SortDir = direction === "desc" ? "desc" : "asc";

    vm.setSortBy(nextField);
    vm.setSortDir(nextDirection);

    vm.setPage(1);
  };

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const navigateToList = React.useCallback(() => {
    navigate("/crm/ruta");
  }, [navigate]);

  const handleRequestLeave = React.useCallback(() => {
    if (form.formState.isDirty) {
      discardDialog.open();
      return;
    }

    navigateToList();
  }, [form.formState.isDirty, discardDialog, navigateToList]);

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSubmit: SubmitHandler<RutaEditFormValues> = async (values) => {
    if (!vm.ruta) {
      return;
    }

    try {
      /*
       * Usamos empresaId de la propia ruta,
       * no el del store, para evitar cambiar
       * accidentalmente su empresa.
       */
      const payload = rutaEditFormToPayload(values, vm.ruta.empresaId);

      await vm.update(payload);

      const normalizedValues: RutaEditFormValues = {
        ...values,

        nombreRuta: values.nombreRuta.trim(),

        observaciones: values.observaciones.trim(),

        clientes: normalizeClientIds(values.clientes),
      };

      /*
       * El guardado pasa a ser el nuevo
       * baseline del formulario.
       */
      form.reset(normalizedValues);

      void form.trigger();

      toast.success("Ruta actualizada correctamente");
    } catch (error) {
      console.error(error);

      toast.error(getApiErrorMessageAxios(error));
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleDeleteRuta = async () => {
    if (!isValidRutaId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(undefined);

      deleteDialog.close();

      toast.success("Ruta eliminada correctamente");

      navigate("/crm/ruta", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error(getApiErrorMessageAxios(error));
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Invalid ID                                                               */
  /* ------------------------------------------------------------------------ */

  if (!isValidRutaId) {
    return (
      <AppContainer size="full" paddingY="none" paddingX="none">
        <AppDataState
          isEmpty
          emptyTitle="Ruta no válida"
          emptyDescription="El identificador de la ruta no es válido."
          emptyAction={
            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              leftIcon={<ArrowLeft size={13} />}
              onClick={navigateToList}
            >
              Volver a rutas
            </AppButton>
          }
        />
      </AppContainer>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <AppContainer size="full" paddingY="none" paddingX="none">
        <AppDataState
          isLoading={vm.isLoadingRuta}
          error={vm.rutaError}
          isEmpty={!vm.isLoadingRuta && !vm.ruta}
          loadingVariant="skeleton-grid"
          loadingRows={4}
          emptyTitle="Ruta no encontrada"
          emptyDescription="No se encontró la ruta de cobro solicitada."
          errorTitle="No se pudo cargar la ruta"
          onRetry={vm.refetchRuta}
        >
          {vm.ruta ? (
            <AppForm<RutaEditFormValues> form={form} onSubmit={handleSubmit}>
              <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <AppButton
                      type="button"
                      variant="ghost"
                      size="xs"
                      leftIcon={<ArrowLeft size={13} />}
                      disabled={vm.isSubmitting || deleteMutation.isPending}
                      onClick={handleRequestLeave}
                    >
                      Volver
                    </AppButton>

                    <AppBadge
                      tone="info"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      Ruta #{vm.ruta.id}
                    </AppBadge>

                    <AppBadge
                      tone="success"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {selectedCount} seleccionados
                    </AppBadge>

                    <AppBadge
                      tone="warning"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {formattMonedaGT(totalACobrar)} a cobrar
                    </AppBadge>
                  </div>

                  <AppButton
                    type="button"
                    variant="danger"
                    size="xs"
                    leftIcon={<Trash2 size={13} />}
                    disabled={vm.isSubmitting || deleteMutation.isPending}
                    onClick={deleteDialog.open}
                  >
                    Eliminar ruta
                  </AppButton>
                </div>

                {/* Validación de clientes */}
                {form.formState.errors.clientes?.message ? (
                  <AppAlert tone="warning" title="Selección de clientes">
                    {form.formState.errors.clientes.message}
                  </AppAlert>
                ) : null}

                {/* Datos generales */}
                <RutasEditFormCard
                  ruta={vm.ruta}
                  cobradorOptions={cobradorOptions}
                  selectedCount={selectedCount}
                  totalACobrar={totalACobrar}
                  isSaving={vm.isSubmitting}
                  onCancel={handleRequestLeave}
                />

                {/* Filtros */}
                <RutasClientesFilters
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
                  onClearFilters={vm.clearFilters}
                  onRefetch={vm.refetchAll}
                />

                {/* Gestión de clientes */}
                <AppGrid
                  cols={{
                    base: 1,
                    xl: 12,
                  }}
                  gap="sm"
                  align="start"
                >
                  {/* Clientes originales */}
                  <AppGridItem
                    span={{
                      base: "full",
                      xl: 4,
                    }}
                  >
                    <RutasEditCurrentClients
                      clientes={vm.ruta.clientes}
                      selectedClientIds={selectedClientIds}
                      isDisabled={vm.isSubmitting}
                      onRemove={handleRemoveCurrentClient}
                      onRestore={handleRestoreCurrentClient}
                    />
                  </AppGridItem>

                  {/* Tabla de clientes */}
                  <AppGridItem
                    span={{
                      base: "full",
                      xl: 8,
                    }}
                  >
                    <AppCard
                      variant="outline"
                      size="xs"
                      radius="md"
                      title="Clientes asignables"
                      description="Selecciona los clientes que deben pertenecer a la ruta."
                      icon={<Users size={15} />}
                      action={
                        <AppBadge
                          tone="neutral"
                          appearance="soft"
                          size="xs"
                          radius="full"
                        >
                          {vm.total} encontrados
                        </AppBadge>
                      }
                    >
                      <AppDataTable<ClienteInternetFromCreateRuta>
                        data={vm.clientes}
                        columns={columns}
                        getRowId={(row) => String(row.id)}
                        isLoading={vm.isInitialClientes}
                        isFetching={vm.isFetchingClientes}
                        error={vm.clientesError}
                        onRetry={vm.refetchClientes}
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
                        rowSelection={rowSelection}
                        onRowSelectionChange={handleRowSelectionChange}
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={setColumnVisibility}
                        enableRowSelection
                        enableColumnVisibility
                        enableColumnPinning={false}
                        enableSorting={false}
                        enableVirtualization
                        stickyHeader
                        density="xs"
                        maxHeight="62vh"
                        emptyTitle="Sin clientes"
                        emptyDescription="No hay clientes que coincidan con los filtros actuales."
                      />
                    </AppCard>
                  </AppGridItem>
                </AppGrid>
              </div>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppContainer>

      {/* Eliminar */}
      <AppConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        title="Eliminar ruta de cobro"
        description="Esta acción eliminará la ruta. Confirma únicamente si ya no debe utilizarse."
        confirmText="Sí, eliminar ruta"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={deleteMutation.isPending}
        disabled={deleteMutation.isPending}
        preventClose={deleteMutation.isPending}
        closeOnConfirm={false}
        onConfirm={handleDeleteRuta}
        size="sm"
        footerAlign="between"
      >
        {vm.ruta ? (
          <div className="space-y-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            <div className="flex items-center justify-between gap-3">
              <span>Ruta</span>

              <span className="font-medium text-[hsl(var(--app-foreground))]">
                {vm.ruta.nombreRuta}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span>Clientes</span>

              <span className="font-medium text-[hsl(var(--app-foreground))]">
                {vm.ruta.clientes.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span>Estado</span>

              <span className="font-medium text-[hsl(var(--app-foreground))]">
                {vm.ruta.estadoRuta}
              </span>
            </div>
          </div>
        ) : null}
      </AppConfirmDialog>

      {/* Salir sin guardar */}
      <AppConfirmDialog
        open={discardDialog.isOpen}
        onOpenChange={discardDialog.setOpen}
        preset="warning"
        tone="warning"
        title="Descartar cambios"
        description="Hay cambios en la ruta que todavía no han sido guardados."
        confirmText="Descartar y salir"
        cancelText="Seguir editando"
        onConfirm={navigateToList}
        size="sm"
        footerAlign="between"
      />
    </>
  );
}
