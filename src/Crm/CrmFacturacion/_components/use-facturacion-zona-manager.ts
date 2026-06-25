"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

import {
  useDeleteZona,
  useGetZonasFacturacion,
  usePatchZona,
  usePostZona,
} from "@/Crm/CrmHooks/hooks/use-zonas-facturacion/use-zonas-facturacion";

import {
  buildZonaPayload,
  createDefaultZona,
  filterZonas,
  getZonaStats,
  validateZonaForm,
  zonaToForm,
  type ZonaFormState,
} from "./facturacion-zona.helpers";

interface FacturacionZonaUiState {
  searchZona: string;
  zonaForm: ZonaFormState;
}

export function useFacturacionZonaManager(empresaId: number) {
  const createDialog = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<FacturacionZona>();

  const ui = useAppStateHandlers<FacturacionZonaUiState>({
    searchZona: "",
    zonaForm: createDefaultZona(empresaId),
  });

  const {
    data: zonas = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetZonasFacturacion();

  const { mutateAsync: postZona, isPending: isCreating } = usePostZona();
  const { mutateAsync: patchZona, isPending: isPatching } = usePatchZona();

  const deleteTargetId = deleteDialog.target?.id ?? 0;
  const { mutateAsync: deleteZona, isPending: isDeleting } =
    useDeleteZona(deleteTargetId);

  const uiRef = React.useRef(ui);
  const empresaIdRef = React.useRef(empresaId);
  const createDialogRef = React.useRef(createDialog);
  const editDialogRef = React.useRef(editDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    uiRef.current = ui;
    empresaIdRef.current = empresaId;
    createDialogRef.current = createDialog;
    editDialogRef.current = editDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const patchZonaForm = React.useCallback((patch: Partial<ZonaFormState>) => {
    uiRef.current.setField("zonaForm", {
      ...uiRef.current.state.zonaForm,
      ...patch,
    });
  }, []);

  const resetZonaForm = React.useCallback(() => {
    uiRef.current.setField("zonaForm", createDefaultZona(empresaIdRef.current));
  }, []);

  const openCreateDialog = React.useCallback(() => {
    uiRef.current.setField("zonaForm", createDefaultZona(empresaIdRef.current));
    createDialogRef.current.open();
  }, []);

  const openEditDialog = React.useCallback((zona: FacturacionZona) => {
    uiRef.current.setField("zonaForm", zonaToForm(zona));
    editDialogRef.current.open();
  }, []);

  const openDeleteDialog = React.useCallback((zona: FacturacionZona) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        deleteDialogRef.current.open(zona);
      }, 0);
    });
  }, []);

  const createAction = useAppAsyncAction(
    async () => {
      const form = uiRef.current.state.zonaForm;

      const errorMessage = validateZonaForm(form);
      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      await postZona(buildZonaPayload(form));
      toast.success("Nueva zona de facturación creada");

      createDialogRef.current.close();
      resetZonaForm();
      await refetch();
    },
    { preventConcurrent: true },
  );

  const updateAction = useAppAsyncAction(
    async () => {
      const form = uiRef.current.state.zonaForm;

      if (!form.id) {
        toast.info("Seleccione una zona para editar.");
        return;
      }

      const errorMessage = validateZonaForm(form);
      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      await patchZona({
        ...(buildZonaPayload(form) as NuevaFacturacionZona),
        id: form.id,
      } as FacturacionZona);

      toast.success("Zona de facturación actualizada");

      editDialogRef.current.close();
      resetZonaForm();
      await refetch();
    },
    { preventConcurrent: true },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      await deleteDialogRef.current.confirm(async (target) => {
        if (!target?.id) {
          toast.info("Seleccione una zona para eliminar.");
          return;
        }

        await deleteZona({} as FacturacionZona);
        toast.success("Zona de facturación eliminada");

        await refetch();
      });
    },
    { preventConcurrent: true },
  );

  const setSearchZona = React.useCallback((value: string) => {
    uiRef.current.setField("searchZona", value);
  }, []);

  const clearSearch = React.useCallback(() => {
    uiRef.current.setField("searchZona", "");
  }, []);

  const filteredZonas = React.useMemo(
    () => filterZonas(zonas, ui.state.searchZona),
    [zonas, ui.state.searchZona],
  );

  const stats = React.useMemo(() => getZonaStats(zonas), [zonas]);

  const submitCreate = React.useCallback(async () => {
    await createAction.run();
  }, [createAction]);

  const submitEdit = React.useCallback(async () => {
    await updateAction.run();
  }, [updateAction]);

  const confirmDelete = React.useCallback(async () => {
    await deleteAction.run();
  }, [deleteAction]);

  const isMutating =
    isCreating ||
    isPatching ||
    isDeleting ||
    createAction.isLoading ||
    updateAction.isLoading ||
    deleteAction.isLoading;

  return {
    ui: ui.state,
    zonas,
    filteredZonas,
    stats,

    isLoading,
    isFetching,
    isMutating,
    isCreating: isCreating || createAction.isLoading,
    isPatching: isPatching || updateAction.isLoading,
    isDeleting: isDeleting || deleteAction.isLoading,

    createDialog,
    editDialog,
    deleteDialog,

    createAction,
    updateAction,
    deleteAction,

    refetch,
    setSearchZona,
    clearSearch,
    patchZonaForm,
    resetZonaForm,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    submitCreate,
    submitEdit,
    confirmDelete,
  };
}
