"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import {
  createMetaTicket,
  deleteMeta,
  getMetasTickets,
  getTecnicosMeta,
  updateMetaTickets,
} from "./api";
import type { MetaTecnicoTicket, Tecnicos } from "./types";
import {
  buildCreateMetaPayload,
  buildUpdateMetaPayload,
  canManageMetas,
  createEmptyMetaForm,
  getMetasSummary,
  mapTecnicosToOptions,
  metaToForm,
  type MetaTicketFormState,
  type MetasPageTab,
  validateMetaForm,
} from "./metas-tecnicos.helpers";

interface MetasTecnicosDataState {
  metas: MetaTecnicoTicket[];
  tecnicos: Tecnicos[];
  isLoadingMetas: boolean;
  isLoadingTecnicos: boolean;
  editingMeta: MetaTecnicoTicket | null;
  deletingMeta: MetaTecnicoTicket | null;
}

interface MetasTecnicosUiState {
  activeTab: MetasPageTab;
}

function safeMetas(value: unknown): MetaTecnicoTicket[] {
  return Array.isArray(value) ? value : [];
}

function safeTecnicos(value: unknown): Tecnicos[] {
  return Array.isArray(value) ? value : [];
}

export function useMetasTecnicosPage(userRol: string) {
  const mountedRef = React.useRef(false);

  const createDialog = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const deleteDialog = useAppDisclosure();

  const ui = useAppStateHandlers<MetasTecnicosUiState>({
    activeTab: "ticketsMeta",
  });

  const data = useAppStateHandlers<MetasTecnicosDataState>({
    metas: [],
    tecnicos: [],
    isLoadingMetas: true,
    isLoadingTecnicos: true,
    editingMeta: null,
    deletingMeta: null,
  });

  const form = useAppStateHandlers<MetaTicketFormState>(createEmptyMetaForm());

  const dataRef = React.useRef(data);
  const formRef = React.useRef(form);
  const createDialogRef = React.useRef(createDialog);
  const editDialogRef = React.useRef(editDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    dataRef.current = data;
    formRef.current = form;
    createDialogRef.current = createDialog;
    editDialogRef.current = editDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const loadMetas = React.useCallback(async () => {
    dataRef.current.setField("isLoadingMetas", true);

    try {
      const response = await getMetasTickets();
      dataRef.current.setField("metas", safeMetas(response));
    } catch (error) {
      toast.error("Error al cargar las metas.");
      console.error("Error loading metas:", error);
      dataRef.current.setField("metas", []);
    } finally {
      dataRef.current.setField("isLoadingMetas", false);
    }
  }, []);

  const loadTecnicos = React.useCallback(async () => {
    dataRef.current.setField("isLoadingTecnicos", true);

    try {
      const response = await getTecnicosMeta();
      dataRef.current.setField("tecnicos", safeTecnicos(response));
    } catch (error) {
      toast.error("Error al cargar técnicos.");
      console.error("Error loading tecnicos:", error);
      dataRef.current.setField("tecnicos", []);
    } finally {
      dataRef.current.setField("isLoadingTecnicos", false);
    }
  }, []);

  React.useEffect(() => {
    if (mountedRef.current) return;

    mountedRef.current = true;

    void loadMetas();
    void loadTecnicos();
  }, [loadMetas, loadTecnicos]);

  const resetForm = React.useCallback(() => {
    formRef.current.setState(createEmptyMetaForm());
  }, []);

  const openCreateDialog = React.useCallback(() => {
    resetForm();
    createDialogRef.current.open();
  }, [resetForm]);

  const openEditDialog = React.useCallback((meta: MetaTecnicoTicket) => {
    dataRef.current.setField("editingMeta", meta);
    formRef.current.setState(metaToForm(meta));
    editDialogRef.current.open();
  }, []);

  const openDeleteDialog = React.useCallback((meta: MetaTecnicoTicket) => {
    dataRef.current.setField("deletingMeta", meta);
    deleteDialogRef.current.open();
  }, []);

  const createAction = useAppAsyncAction(
    async () => {
      const currentForm = formRef.current.state;
      const errorMessage = validateMetaForm(currentForm);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      await createMetaTicket(buildCreateMetaPayload(currentForm));

      toast.success("Meta creada correctamente.");
      createDialogRef.current.close();
      resetForm();
      await loadMetas();
    },
    {
      preventConcurrent: true,
    },
  );

  const editAction = useAppAsyncAction(
    async () => {
      const target = dataRef.current.state.editingMeta;
      const currentForm = formRef.current.state;

      if (!target) {
        toast.error("No hay meta seleccionada para editar.");
        return;
      }

      const errorMessage = validateMetaForm(currentForm);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      await updateMetaTickets(target.id, buildUpdateMetaPayload(currentForm));

      toast.success("Meta actualizada correctamente.");
      editDialogRef.current.close();
      dataRef.current.setField("editingMeta", null);
      resetForm();
      await loadMetas();
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      const target = dataRef.current.state.deletingMeta;

      if (!target) {
        toast.error("No hay meta seleccionada para eliminar.");
        return;
      }

      await deleteMeta(target.id);

      toast.success("Meta eliminada correctamente.");
      deleteDialogRef.current.close();
      dataRef.current.setField("deletingMeta", null);
      await loadMetas();
    },
    {
      preventConcurrent: true,
    },
  );

  const submitCreate = React.useCallback(async () => {
    await createAction.run();
  }, [createAction]);

  const submitEdit = React.useCallback(async () => {
    await editAction.run();
  }, [editAction]);

  const confirmDelete = React.useCallback(async () => {
    await deleteAction.run();
  }, [deleteAction]);

  const operationLoading =
    createAction.isLoading || editAction.isLoading || deleteAction.isLoading;

  const metas = Array.isArray(data.state.metas) ? data.state.metas : [];
  const tecnicos = Array.isArray(data.state.tecnicos)
    ? data.state.tecnicos
    : [];

  const summary = React.useMemo(() => getMetasSummary(metas), [metas]);

  const tecnicoOptions = React.useMemo(
    () => mapTecnicosToOptions(tecnicos),
    [tecnicos],
  );

  const canManage = React.useMemo(() => canManageMetas(userRol), [userRol]);

  return {
    ui,
    data,
    form,

    metas,
    tecnicos,
    summary,
    tecnicoOptions,
    canManage,
    operationLoading,

    createDialog,
    editDialog,
    deleteDialog,

    createAction,
    editAction,
    deleteAction,

    submitCreate,
    submitEdit,
    confirmDelete,

    loadMetas,
    loadTecnicos,

    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    resetForm,
  };
}
