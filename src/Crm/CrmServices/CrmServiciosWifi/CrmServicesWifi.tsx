"use client";

import * as React from "react";
import axios from "axios";
import currency from "currency.js";
import { toast } from "sonner";
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppAsyncAction,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import ServicioTable from "./ServicioTable";
import type {
  NuevoServicioInternet,
  ServicioInternet,
} from "./servicio-internet.types";
import {
  CreateServicioInternetDialog,
  EditServicioInternetDialog,
} from "../_components/ServicioInternetDialog";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

function formatearMoneda(monto: number) {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
}

function createEmptyServicio(empresaId: number): NuevoServicioInternet {
  return {
    nombre: "",
    velocidad: "",
    precio: 0,
    estado: "ACTIVO",
    empresaId,
  };
}

interface ServicioInternetState {
  servicios: ServicioInternet[];
  searchServicio: string;
  nuevoServicio: NuevoServicioInternet;
  editingServicio: ServicioInternet | null;
  hasLoaded: boolean;
  error: string | null;
}

function normalizeServiciosResponse(raw: unknown): ServicioInternet[] {
  if (Array.isArray(raw)) return raw as ServicioInternet[];

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as ServicioInternet[];
    if (Array.isArray(record.items)) return record.items as ServicioInternet[];
    if (Array.isArray(record.servicios)) {
      return record.servicios as ServicioInternet[];
    }
  }

  return [];
}

function getInitialState(empresaId: number): ServicioInternetState {
  return {
    servicios: [],
    searchServicio: "",
    nuevoServicio: createEmptyServicio(empresaId),
    editingServicio: null,
    hasLoaded: false,
    error: null,
  };
}
function ServicioStatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <AppCard variant="outline" size="xs" className="px-3 py-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppInline align="center" gap="xs" className="min-w-0">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {label}
            </p>
            <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {description}
            </p>
          </div>
        </AppInline>

        <span className="shrink-0 text-sm font-bold tabular-nums leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
          {value}
        </span>
      </AppInline>
    </AppCard>
  );
}
export default function ServicioInternetManage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const createDialog = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<ServicioInternet>();

  const state = useAppStateHandlers<ServicioInternetState>(
    getInitialState(empresaId),
  );

  const stateRef = React.useRef(state);
  const empresaIdRef = React.useRef(empresaId);
  const createDialogRef = React.useRef(createDialog);
  const editDialogRef = React.useRef(editDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    stateRef.current = state;
    empresaIdRef.current = empresaId;
    createDialogRef.current = createDialog;
    editDialogRef.current = editDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const loadServicios = React.useCallback(async () => {
    stateRef.current.setField("error", null);

    try {
      const response = await axios.get<unknown>(
        `${VITE_CRM_API_URL}/servicio-internet/get-servicios-internet`,
      );

      const servicios = normalizeServiciosResponse(response.data);
      console.log("Lso servicios son: ", servicios);

      stateRef.current.setState({
        ...stateRef.current.state,
        servicios,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      console.error("Error al cargar servicios de internet:", error);

      const message =
        "No se pudieron conseguir los datos de los servicios. Intente nuevamente.";

      stateRef.current.setField("error", message);
      stateRef.current.setField("hasLoaded", true);

      toast.error("Error al cargar servicios");
    }
  }, []);

  const loadAction = useAppAsyncAction(
    async () => {
      await loadServicios();
    },
    {
      preventConcurrent: true,
    },
  );

  React.useEffect(() => {
    void loadAction.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAction = useAppAsyncAction(
    async (servicioData: NuevoServicioInternet) => {
      stateRef.current.setField("error", null);

      try {
        const payload = {
          nombre: servicioData.nombre.trim(),
          velocidad: servicioData.velocidad?.trim() || "",
          precio: Number(servicioData.precio ?? 0),
          estado: servicioData.estado,
          empresaId: empresaIdRef.current,
        };

        await axios.post(`${VITE_CRM_API_URL}/servicio-internet`, payload);

        toast.success("Nuevo servicio de internet creado");

        createDialogRef.current.close();
        stateRef.current.setField(
          "nuevoServicio",
          createEmptyServicio(empresaIdRef.current),
        );

        await loadServicios();
      } catch (error) {
        console.error("Error al crear servicio de internet:", error);

        stateRef.current.setField(
          "error",
          "Error al crear el servicio de internet. Intente nuevamente.",
        );

        toast.error("Error al crear servicio");
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const updateAction = useAppAsyncAction(
    async (updatedServicio: ServicioInternet) => {
      stateRef.current.setField("error", null);

      try {
        const payload = {
          nombre: updatedServicio.nombre.trim(),
          velocidad: updatedServicio.velocidad?.trim() || "",
          precio: Number(updatedServicio.precio ?? 0),
          estado: updatedServicio.estado,
          empresaId: empresaIdRef.current,
        };

        await axios.patch(
          `${VITE_CRM_API_URL}/servicio-internet/update-servicio-wifi/${updatedServicio.id}`,
          payload,
        );

        toast.success("Servicio de internet actualizado");

        editDialogRef.current.close();
        stateRef.current.setField("editingServicio", null);

        await loadServicios();
      } catch (error) {
        console.error("Error al actualizar servicio de internet:", error);

        stateRef.current.setField(
          "error",
          "Error al actualizar el servicio de internet. Intente nuevamente.",
        );

        toast.error("Error al actualizar servicio");
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      await deleteDialogRef.current.confirm(async (target) => {
        if (!target?.id) {
          toast.error("Seleccione un servicio para eliminar.");
          return;
        }

        stateRef.current.setField("error", null);

        try {
          await axios.delete(
            `${VITE_CRM_API_URL}/servicio-internet/remove-servicio/${target.id}`,
          );

          toast.success("Servicio de internet eliminado");

          await loadServicios();
        } catch (error) {
          console.error("Error al eliminar servicio de internet:", error);

          stateRef.current.setField(
            "error",
            "Error al eliminar el servicio de internet. Intente nuevamente.",
          );

          toast.error("Error al eliminar servicio");
        }
      });
    },
    {
      preventConcurrent: true,
    },
  );

  const openCreateDialog = React.useCallback(() => {
    stateRef.current.setField(
      "nuevoServicio",
      createEmptyServicio(empresaIdRef.current),
    );
    createDialogRef.current.open();
  }, []);

  const openEditDialog = React.useCallback((servicio: ServicioInternet) => {
    stateRef.current.setField("editingServicio", servicio);
    editDialogRef.current.open();
  }, []);

  const openDeleteDialogById = React.useCallback((id: number) => {
    const servicio = stateRef.current.state.servicios.find(
      (item) => item.id === id,
    );

    if (!servicio) {
      toast.error("No se encontró el servicio seleccionado.");
      return;
    }

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        deleteDialogRef.current.open(servicio);
      }, 0);
    });
  }, []);

  const submitCreate = React.useCallback(
    async (payload: NuevoServicioInternet) => {
      await createAction.run(payload);
    },
    [createAction],
  );

  const submitEdit = React.useCallback(
    async (payload: ServicioInternet) => {
      await updateAction.run(payload);
    },
    [updateAction],
  );

  const confirmDelete = React.useCallback(async () => {
    await deleteAction.run();
  }, [deleteAction]);

  const setSearchServicio = React.useCallback((value: string) => {
    stateRef.current.setField("searchServicio", value);
  }, []);

  const clearSearch = React.useCallback(() => {
    stateRef.current.setField("searchServicio", "");
  }, []);

  const servicios = Array.isArray(state.state.servicios)
    ? state.state.servicios
    : [];

  console.log("servicios formateados: ", servicios);

  const filteredServicios = React.useMemo(() => {
    const search = state.state.searchServicio.trim().toLowerCase();

    if (!search) return servicios;

    return servicios.filter((servicio) => {
      return (
        servicio.nombre.toLowerCase().includes(search) ||
        servicio.velocidad?.toLowerCase().includes(search)
      );
    });
  }, [servicios, state.state.searchServicio]);

  const stats = React.useMemo(() => {
    const totalServicios = servicios.length;
    const serviciosActivos = servicios.filter(
      (servicio) => servicio.estado === "ACTIVO",
    ).length;
    const totalClientes = servicios.reduce(
      (acc, servicio) => acc + (servicio.clientesCount || 0),
      0,
    );
    const ingresosMensuales = servicios.reduce(
      (acc, servicio) =>
        acc + Number(servicio.precio || 0) * (servicio.clientesCount || 0),
      0,
    );

    return {
      totalServicios,
      serviciosActivos,
      totalClientes,
      ingresosMensuales,
    };
  }, [servicios]);

  const isLoading = loadAction.isLoading || !state.state.hasLoaded;
  const isMutating =
    createAction.isLoading || updateAction.isLoading || deleteAction.isLoading;
  const isBusy = isLoading || isMutating;

  const statItems = React.useMemo(
    () => [
      {
        label: "Planes",
        value: stats.totalServicios,
        description: "Configurados",
        icon: <Wifi size={13} />,
      },
      {
        label: "Activos",
        value: stats.serviciosActivos,
        description: "Disponibles",
        icon: <Wifi size={13} />,
      },
      {
        label: "Clientes",
        value: stats.totalClientes,
        description: "Asignados",
        icon: <Users size={13} />,
      },
      {
        label: "Ingresos",
        value: formatearMoneda(stats.ingresosMensuales),
        description: "Mensual estimado",
        icon: <Wifi size={13} />,
        skeletonWidth: "w-20",
      },
    ],
    [stats],
  );

  return (
    <PageTransitionCrm
      titleHeader="Servicios de Internet"
      subtitle="Planes de internet configurados para clientes del CRM"
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppInline align="center" gap="xs" wrap className="w-full sm:w-auto">
            <AppInput
              value={state.state.searchServicio}
              onChange={(event) => setSearchServicio(event.target.value)}
              placeholder="Buscar servicios..."
              size="xs"
              fieldWidth="full"
              leftIcon={<Search size={13} />}
              className="sm:w-[260px]"
              disabled={isBusy}
            />

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<RefreshCw size={13} />}
              loading={loadAction.isLoading}
              loadingText="Actualizando..."
              disabled={isMutating}
              onClick={() => loadAction.run()}
            >
              Actualizar
            </AppButton>

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              disabled={isBusy || !state.state.searchServicio}
              onClick={clearSearch}
            >
              Limpiar
            </AppButton>
          </AppInline>

          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<Plus size={13} />}
            disabled={isBusy}
            onClick={openCreateDialog}
          >
            Nuevo plan
          </AppButton>
        </AppInline>

        {state.state.error ? (
          <AppAlert
            tone="danger"
            size="sm"
            icon={<AlertCircle size={15} />}
            title="Error"
            description={state.state.error}
          />
        ) : null}

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="xs">
          {statItems.map((item) => (
            <ServicioStatCard
              key={item.label}
              label={item.label}
              value={
                isLoading ? (
                  <AppSkeleton
                    className={`h-4 ${item.skeletonWidth ?? "w-10"}`}
                  />
                ) : (
                  item.value
                )
              }
              description={item.description}
              icon={item.icon}
            />
          ))}
        </AppGrid>

        <AppCard
          variant="outline"
          size="sm"
          title={
            <AppInline align="center" gap="xs">
              <Wifi size={15} className="text-[hsl(var(--app-primary))]" />
              <span>Planes de internet</span>
            </AppInline>
          }
          description="Planes disponibles y configuración comercial"
          action={
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<RefreshCw size={13} />}
              loading={loadAction.isLoading}
              loadingText="Actualizando..."
              disabled={isMutating}
              onClick={() => loadAction.run()}
            >
              Actualizar
            </AppButton>
          }
        >
          {isLoading && servicios.length === 0 ? (
            <AppStack align="center" gap="sm" className="py-10">
              <AppSkeleton className="h-8 w-8 rounded-full" />
              <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Cargando planes de internet...
              </p>
            </AppStack>
          ) : servicios.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<WifiOff size={34} strokeWidth={1.5} />}
              title="No hay planes de internet"
              description="Cree un nuevo plan para comenzar."
              action={
                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<Plus size={13} />}
                  onClick={openCreateDialog}
                >
                  Nuevo plan
                </AppButton>
              }
              className="py-10"
            />
          ) : filteredServicios.length === 0 ? (
            <AppEmptyState
              preset="search"
              variant="plain"
              size="sm"
              align="center"
              icon={<Search size={34} strokeWidth={1.5} />}
              title="Sin resultados"
              description={`No se encontraron planes para "${state.state.searchServicio}".`}
              action={
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  onClick={clearSearch}
                >
                  Limpiar búsqueda
                </AppButton>
              }
              className="py-10"
            />
          ) : (
            <ServicioTable
              servicios={filteredServicios}
              formatearMoneda={formatearMoneda}
              onEditClick={openEditDialog}
              onDeleteClick={openDeleteDialogById}
            />
          )}
        </AppCard>
      </AppStack>

      <CreateServicioInternetDialog
        open={createDialog.isOpen}
        onOpenChange={createDialog.setOpen}
        initialData={state.state.nuevoServicio}
        onSubmit={submitCreate}
        isLoading={createAction.isLoading}
        empresaId={empresaId}
      />

      <EditServicioInternetDialog
        open={editDialog.isOpen}
        onOpenChange={editDialog.setOpen}
        servicio={state.state.editingServicio}
        onSave={submitEdit}
        isLoading={updateAction.isLoading}
      />
      <AppConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar plan de internet"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={deleteAction.isLoading}
        preventClose={deleteAction.isLoading}
        closeOnConfirm={false}
        onConfirm={confirmDelete}
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Plan seleccionado:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {deleteDialog.target?.nombre ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Si hay clientes asociados a este plan, se perderá la relación con
          ellos.
        </p>
      </AppConfirmDialog>
    </PageTransitionCrm>
  );
}
