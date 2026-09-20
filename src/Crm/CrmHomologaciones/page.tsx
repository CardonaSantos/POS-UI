import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { toast } from "sonner";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import {
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import { AppForm, AppFormInput, AppFormSubmit } from "@/components/app/form";

import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { useGetMikroTiks } from "@/Crm/CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { useGetServiciosWifi } from "@/Crm/CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";

import {
  useActualizarCodigoPerfil,
  useCambiarEstadoPerfil,
  useCrearPerfilHomologacion,
  usePerfilesHomologacion,
} from "@/Crm/CrmHooks/hooks/pppoe-homologaciones/pppoe-perfil-homologaciones";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type {
  PerfilHomologacionFilters,
  PerfilHomologacionListItem,
} from "../features/pppoe-homologaciones/intefaces";

import {
  type ActualizarCodigoPerfilFormValues,
  actualizarCodigoPerfilSchema,
  CREAR_PERFIL_HOMOLOGACION_DEFAULTS,
  type CrearPerfilHomologacionFormValues,
  crearPerfilHomologacionSchema,
} from "./schema/schema";

import { PerfilHomologacionForm } from "./form/perfil-homologacion-form";
import { PerfilesFilters } from "./filters/perfiles-filters";
import { PerfilesTable } from "./table/perfiles-table";

import {
  toActualizarCodigoPerfilPayload,
  toCrearPerfilHomologacionPayload,
} from "./common/mapper";

const FILTER_DEFAULTS: PerfilHomologacionFilters = {
  activo: null,
  mikrotikRouterId: null,
  servicioInternetId: null,
};

export default function PerfilesHomologacionPage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [editing, setEditing] = useState<PerfilHomologacionListItem | null>(
    null,
  );

  const [statusTarget, setStatusTarget] =
    useState<PerfilHomologacionListItem | null>(null);

  const createDialog = useAppDisclosure();

  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    resetPageOnSearch: true,
  });

  const filters =
    useAppStateHandlers<PerfilHomologacionFilters>(FILTER_DEFAULTS);

  /*
   * Opciones
   */
  const routersQuery = useGetMikroTiks();

  const serviciosQuery = useGetServiciosWifi();

  const routerOptions = useMemo(
    () =>
      (routersQuery.data ?? [])
        .filter((router) => router.empresaId === empresaId && router.activo)
        .map((router) => ({
          value: router.id,

          label: `${router.nombre} · ${router.host}`,
        })),
    [empresaId, routersQuery.data],
  );

  const servicioOptions = useMemo(
    () =>
      (serviciosQuery.data ?? []).map((servicio) => ({
        value: servicio.id,

        label: servicio.velocidad
          ? `${servicio.nombre} · ${servicio.velocidad}`
          : servicio.nombre,
      })),
    [serviciosQuery.data],
  );

  /*
   * Formularios
   */
  const createForm = useForm<CrearPerfilHomologacionFormValues>({
    resolver: zodResolver(crearPerfilHomologacionSchema),

    defaultValues: CREAR_PERFIL_HOMOLOGACION_DEFAULTS,

    mode: "onChange",
  });

  const editForm = useForm<ActualizarCodigoPerfilFormValues>({
    resolver: zodResolver(actualizarCodigoPerfilSchema),

    defaultValues: {
      codigoPerfil: "",
    },

    mode: "onChange",
  });

  /*
   * Query params
   */
  const queryParams = useMemo(
    () => ({
      page: table.pagination.pageIndex + 1,

      limit: table.pagination.pageSize,

      ...(table.serverSearch.trim()
        ? {
            search: table.serverSearch.trim(),
          }
        : {}),

      ...(filters.state.activo === null
        ? {}
        : {
            activo: filters.state.activo,
          }),

      ...(filters.state.mikrotikRouterId === null
        ? {}
        : {
            mikrotikRouterId: filters.state.mikrotikRouterId,
          }),

      ...(filters.state.servicioInternetId === null
        ? {}
        : {
            servicioInternetId: filters.state.servicioInternetId,
          }),
    }),
    [
      filters.state,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
    ],
  );

  /*
   * Queries / mutations
   */
  const perfilesQuery = usePerfilesHomologacion(queryParams, empresaId > 0);

  const createMutation = useCrearPerfilHomologacion();

  const updateMutation = useActualizarCodigoPerfil(editing?.id ?? null);

  const statusMutation = useCambiarEstadoPerfil(
    statusTarget?.id ?? null,

    statusTarget?.activo ? "desactivar" : "activar",
  );

  /*
   * Crear
   */
  const openCreate = () => {
    createForm.reset(CREAR_PERFIL_HOMOLOGACION_DEFAULTS);

    createDialog.open();
  };

  const handleCreateDialogOpenChange = (open: boolean) => {
    if (createMutation.isPending && !open) {
      return;
    }

    createDialog.setOpen(open);

    if (!open) {
      createForm.reset(CREAR_PERFIL_HOMOLOGACION_DEFAULTS);
    }
  };

  const onCreateSubmit: SubmitHandler<
    CrearPerfilHomologacionFormValues
  > = async (values) => {
    try {
      await toast.promise(
        createMutation.mutateAsync(toCrearPerfilHomologacionPayload(values)),
        {
          loading: "Registrando homologación...",

          success: "Homologación registrada",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      createForm.reset(CREAR_PERFIL_HOMOLOGACION_DEFAULTS);

      createDialog.setOpen(false);
    } catch {
      /*
       * El mutation/toast ya presenta
       * el error. Dejamos abierto el
       * formulario para corregirlo.
       */
    }
  };

  /*
   * Editar
   */
  const openEdit = (item: PerfilHomologacionListItem) => {
    setEditing(item);

    editForm.reset({
      codigoPerfil: item.codigoPerfil,
    });
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    if (updateMutation.isPending && !open) {
      return;
    }

    if (!open) {
      setEditing(null);

      editForm.reset({
        codigoPerfil: "",
      });
    }
  };

  const onEditSubmit: SubmitHandler<ActualizarCodigoPerfilFormValues> = async (
    values,
  ) => {
    if (!editing) {
      return;
    }

    try {
      await toast.promise(
        updateMutation.mutateAsync(toActualizarCodigoPerfilPayload(values)),
        {
          loading: "Actualizando código...",

          success: "Código actualizado",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      setEditing(null);

      editForm.reset({
        codigoPerfil: "",
      });
    } catch {
      /*
       * Mantener el modal abierto.
       */
    }
  };

  /*
   * Estado
   */
  const handleStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    try {
      await toast.promise(
        statusMutation.mutateAsync({
          actualizadoPorId: userId,
        }),
        {
          loading: statusTarget.activo ? "Desactivando..." : "Activando...",

          success: statusTarget.activo
            ? "Homologación desactivada"
            : "Homologación activada",

          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      setStatusTarget(null);
    } catch {
      /*
       * El confirm permanece abierto
       * para que el usuario pueda
       * reintentar o cerrarlo.
       */
    }
  };

  /*
   * Filtros
   */
  const changeFilter = <K extends keyof PerfilHomologacionFilters>(
    key: K,
    value: PerfilHomologacionFilters[K],
  ) => {
    filters.setField(key, value);

    table.resetPage();
  };

  const clearFilters = () => {
    filters.reset(FILTER_DEFAULTS);

    table.handleSearchChange("");

    table.handleDebouncedSearch("");

    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    Object.values(filters.state).some((value) => value !== null);

  return (
    <PageTransitionCrm titleHeader="Homologación de planes" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppInline justify="end" align="center" fullWidth>
            <AppButton
              type="button"
              size="sm"
              variant="primary"
              leftIcon={<Plus size={15} aria-hidden="true" />}
              onClick={openCreate}
            >
              Nueva homologación
            </AppButton>
          </AppInline>
          <PerfilesFilters
            search={table.search}
            filters={filters.state}
            routerOptions={routerOptions}
            servicioOptions={servicioOptions}
            isSearching={perfilesQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={table.handleSearchChange}
            onDebouncedSearchChange={table.handleDebouncedSearch}
            onFilterChange={changeFilter}
            onClear={clearFilters}
          />
          <PerfilesTable
            items={perfilesQuery.data?.data ?? []}
            totalRows={perfilesQuery.data?.meta.total ?? 0}
            table={table}
            isLoading={perfilesQuery.isPending}
            isFetching={perfilesQuery.isFetching}
            error={perfilesQuery.error}
            onRetry={() => perfilesQuery.refetch()}
            onEdit={openEdit}
            onToggleStatus={setStatusTarget}
          />
        </AppStack>

        {/* Crear */}
        <AppDialog
          open={createDialog.isOpen}
          onOpenChange={handleCreateDialogOpenChange}
        >
          <AppDialogContent size="md" viewport="compact">
            <AppDialogHeader>
              <AppDialogTitle>Nueva homologación</AppDialogTitle>

              <AppDialogDescription>
                Relacione un plan comercial con el perfil configurado en
                MikroTik.
              </AppDialogDescription>
            </AppDialogHeader>

            <AppDialogBody>
              <PerfilHomologacionForm
                form={createForm}
                routerOptions={routerOptions}
                servicioOptions={servicioOptions}
                isLoadingOptions={
                  routersQuery.isLoading || serviciosQuery.isLoading
                }
                isPending={createMutation.isPending}
                onCancel={() => handleCreateDialogOpenChange(false)}
                onSubmit={onCreateSubmit}
              />
            </AppDialogBody>
          </AppDialogContent>
        </AppDialog>

        {/* Editar código */}
        <AppDialog
          open={Boolean(editing)}
          onOpenChange={handleEditDialogOpenChange}
        >
          <AppDialogContent size="sm" viewport="compact">
            <AppDialogHeader>
              <AppDialogTitle>Editar código del perfil</AppDialogTitle>

              <AppDialogDescription>
                Modifique únicamente el código del perfil configurado en
                MikroTik.
              </AppDialogDescription>
            </AppDialogHeader>

            <AppDialogBody>
              <AppForm form={editForm} onSubmit={onEditSubmit}>
                <AppStack gap="sm">
                  <AppFormInput<ActualizarCodigoPerfilFormValues>
                    name="codigoPerfil"
                    label="Código del perfil"
                    placeholder="Ej. PLAN_20M"
                    maxLength={100}
                    autoComplete="off"
                    required
                  />

                  <AppInline justify="end" gap="xs" fullWidth>
                    <AppButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={updateMutation.isPending}
                      onClick={() => handleEditDialogOpenChange(false)}
                    >
                      Cancelar
                    </AppButton>

                    <AppFormSubmit<ActualizarCodigoPerfilFormValues>
                      size="sm"
                      loadingText="Guardando..."
                      disableWhenInvalid
                    >
                      Guardar cambio
                    </AppFormSubmit>
                  </AppInline>
                </AppStack>
              </AppForm>
            </AppDialogBody>
          </AppDialogContent>
        </AppDialog>

        {/* Activar / desactivar */}
        <AppConfirmDialog
          open={Boolean(statusTarget)}
          onOpenChange={(open) => {
            if (statusMutation.isPending && !open) {
              return;
            }

            if (!open) {
              setStatusTarget(null);
            }
          }}
          preset={statusTarget?.activo ? "delete" : "warning"}
          title={
            statusTarget?.activo
              ? "Desactivar homologación"
              : "Activar homologación"
          }
          description={
            statusTarget?.activo
              ? "No se usará en nuevas prealtas PPPoE. Las cuentas existentes no se eliminan."
              : "La homologación volverá a estar disponible para nuevas prealtas PPPoE."
          }
          confirmText={statusTarget?.activo ? "Desactivar" : "Activar"}
          loadingText={
            statusTarget?.activo ? "Desactivando..." : "Activando..."
          }
          isLoading={statusMutation.isPending}
          onConfirm={handleStatusChange}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}
