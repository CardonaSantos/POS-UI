"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import {
  useCreateTicketSoluciones,
  useDeleteTicketSoluciones,
  useGetTicketSoluciones,
  useUpdateTicketSoluciones,
} from "@/Crm/CrmHooks/hooks/use-ticket-soluciones/useTicketSoluciones";
import type { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import {
  CreateSolucionTicketDto,
  createSolucionTicketSchema,
} from "./form/zod";
import {
  buildUpdateSolucionPayload,
  createEmptySolucionTicketForm,
  solucionTicketToForm,
} from "./ticket-soluciones.helpers";

interface TicketSolucionesUiState {
  selectedResolucion: SolucionTicketItem | null;
}

export function useTicketSolucionesManager() {
  const createPanel = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<SolucionTicketItem>();

  const ui = useAppStateHandlers<TicketSolucionesUiState>({
    selectedResolucion: null,
  });

  const form = useForm<CreateSolucionTicketDto>({
    resolver: zodResolver(createSolucionTicketSchema),
    defaultValues: createEmptySolucionTicketForm(),
  });

  const { data, isLoading: isLoadingList } = useGetTicketSoluciones();

  const createMutation = useCreateTicketSoluciones();
  const updateMutation = useUpdateTicketSoluciones();

  const deleteMutation = useDeleteTicketSoluciones(
    deleteDialog.target?.id ?? 0,
  );

  const uiRef = React.useRef(ui);
  const formRef = React.useRef(form);
  const createPanelRef = React.useRef(createPanel);
  const editDialogRef = React.useRef(editDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    uiRef.current = ui;
    formRef.current = form;
    createPanelRef.current = createPanel;
    editDialogRef.current = editDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const ticketSolutions = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const resetForm = React.useCallback(() => {
    formRef.current.reset(createEmptySolucionTicketForm());
  }, []);

  const toggleCreatePanel = React.useCallback(() => {
    if (createPanelRef.current.isOpen) {
      createPanelRef.current.close();
      resetForm();
      return;
    }

    uiRef.current.setField("selectedResolucion", null);
    resetForm();
    createPanelRef.current.open();
  }, [resetForm]);

  const closeCreatePanel = React.useCallback(() => {
    createPanelRef.current.close();
    resetForm();
  }, [resetForm]);

  const selectForEdit = React.useCallback((regist: SolucionTicketItem) => {
    uiRef.current.setField("selectedResolucion", regist);
    formRef.current.reset(solucionTicketToForm(regist));
    createPanelRef.current.close();
    editDialogRef.current.open();
  }, []);

  const selectForDelete = React.useCallback((regist: SolucionTicketItem) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        deleteDialogRef.current.open(regist);
      }, 0);
    });
  }, []);

  const createAction = useAppAsyncAction(
    async (payload: CreateSolucionTicketDto) => {
      try {
        await createMutation.mutateAsync(payload);

        toast.success("Registro creado exitosamente.");
        closeCreatePanel();
      } catch (error) {
        toast.error(getApiErrorMessageAxios(error));
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const updateAction = useAppAsyncAction(
    async (payload: CreateSolucionTicketDto) => {
      const selected = uiRef.current.state.selectedResolucion;

      if (!selected?.id) {
        toast.info("Seleccione un registro.");
        return;
      }

      try {
        await updateMutation.mutateAsync(
          buildUpdateSolucionPayload(selected.id, payload),
        );

        toast.success("Registro actualizado correctamente.");
        editDialogRef.current.close();
        uiRef.current.setField("selectedResolucion", null);
        resetForm();
      } catch (error) {
        toast.error(getApiErrorMessageAxios(error));
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
          toast.info("Seleccione un registro.");
          return;
        }

        await deleteMutation.mutateAsync(target.id);

        toast.success("Registro eliminado.");
        resetForm();
      });
    },
    {
      preventConcurrent: true,
    },
  );

  const submitCreate = React.useCallback(
    async (payload: CreateSolucionTicketDto) => {
      await createAction.run(payload);
    },
    [createAction],
  );

  const submitEdit = React.useCallback(
    async (payload: CreateSolucionTicketDto) => {
      await updateAction.run(payload);
    },
    [updateAction],
  );

  const confirmDelete = React.useCallback(async () => {
    await deleteAction.run();
  }, [deleteAction]);

  const isCreating = createMutation.isPending || createAction.isLoading;
  const isUpdating = updateMutation.isPending || updateAction.isLoading;
  const isDeleting = deleteMutation.isPending || deleteAction.isLoading;
  const isMutating = isCreating || isUpdating || isDeleting;

  return {
    form,
    ticketSolutions,

    ui,
    createPanel,
    editDialog,
    deleteDialog,

    isLoadingList,
    isCreating,
    isUpdating,
    isDeleting,
    isMutating,

    resetForm,
    toggleCreatePanel,
    closeCreatePanel,
    selectForDelete,
    selectForEdit,

    submitCreate,
    submitEdit,
    confirmDelete,
  };
}
