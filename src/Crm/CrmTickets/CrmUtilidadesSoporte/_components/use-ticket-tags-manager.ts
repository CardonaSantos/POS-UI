"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import type { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
import {
  createTagTicket,
  deleteTagTicket,
  getTagsTicket,
  updateTagTicket,
} from "./ticket-tags.api";
import {
  createEmptyTagForm,
  filterEtiquetas,
  getTagTicketStats,
  validateTagName,
} from "./ticket-tags.helpers";

interface TicketTagsState {
  etiquetas: EtiquetaTicket[];
  searchEtiqueta: string;
  formData: {
    nombre: string;
  };
  editingEtiqueta: EtiquetaTicket | null;
  hasLoaded: boolean;
  error: string | null;
}

function getInitialState(): TicketTagsState {
  return {
    etiquetas: [],
    searchEtiqueta: "",
    formData: createEmptyTagForm(),
    editingEtiqueta: null,
    hasLoaded: false,
    error: null,
  };
}

export function useTicketTagsManager() {
  const createDialog = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<EtiquetaTicket>();

  const state = useAppStateHandlers<TicketTagsState>(getInitialState());

  const stateRef = React.useRef(state);
  const createDialogRef = React.useRef(createDialog);
  const editDialogRef = React.useRef(editDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    stateRef.current = state;
    createDialogRef.current = createDialog;
    editDialogRef.current = editDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const loadTags = React.useCallback(async () => {
    stateRef.current.setField("error", null);

    try {
      const etiquetas = await getTagsTicket();

      stateRef.current.setState({
        ...stateRef.current.state,
        etiquetas,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      const message = "Error al cargar etiquetas.";

      stateRef.current.setField("error", message);
      stateRef.current.setField("hasLoaded", true);

      toast.error(message);
      console.error("Error loading tags:", error);
    }
  }, []);

  const loadAction = useAppAsyncAction(
    async () => {
      await loadTags();
    },
    {
      preventConcurrent: true,
    },
  );

  React.useEffect(() => {
    void loadAction.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSearchEtiqueta = React.useCallback((value: string) => {
    stateRef.current.setField("searchEtiqueta", value);
  }, []);

  const setNombre = React.useCallback((value: string) => {
    stateRef.current.setField("formData", {
      ...stateRef.current.state.formData,
      nombre: value,
    });
  }, []);

  const resetForm = React.useCallback(() => {
    stateRef.current.setField("formData", createEmptyTagForm());
  }, []);

  const openCreateDialog = React.useCallback(() => {
    stateRef.current.setField("editingEtiqueta", null);
    resetForm();
    createDialogRef.current.open();
  }, [resetForm]);

  const openEditDialog = React.useCallback((etiqueta: EtiquetaTicket) => {
    stateRef.current.setField("editingEtiqueta", etiqueta);
    stateRef.current.setField("formData", {
      nombre: etiqueta.nombre,
    });
    editDialogRef.current.open();
  }, []);

  const openDeleteDialog = React.useCallback((etiqueta: EtiquetaTicket) => {
    /*
      Importante:
      Se difiere la apertura porque usualmente viene desde un DropdownMenu.
      Así dejamos que Radix cierre el menú antes de montar el AlertDialog.
    */
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        deleteDialogRef.current.open(etiqueta);
      }, 0);
    });
  }, []);

  const openDeleteById = React.useCallback(
    (id: number) => {
      const etiqueta = stateRef.current.state.etiquetas.find(
        (item) => item.id === id,
      );

      if (!etiqueta) {
        toast.error("No se encontró la etiqueta seleccionada.");
        return;
      }

      openDeleteDialog(etiqueta);
    },
    [openDeleteDialog],
  );

  const createAction = useAppAsyncAction(
    async () => {
      const currentState = stateRef.current.state;
      const nombre = currentState.formData.nombre.trim();

      const errorMessage = validateTagName(currentState.etiquetas, nombre);

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      await createTagTicket({ nombre });

      toast.success("Etiqueta creada exitosamente.");
      createDialogRef.current.close();
      resetForm();
      await loadTags();
    },
    {
      preventConcurrent: true,
    },
  );

  const editAction = useAppAsyncAction(
    async () => {
      const currentState = stateRef.current.state;
      const target = currentState.editingEtiqueta;

      if (!target) {
        toast.error("Seleccione una etiqueta para editar.");
        return;
      }

      const nombre = currentState.formData.nombre.trim();

      const errorMessage = validateTagName(
        currentState.etiquetas,
        nombre,
        target.id,
      );

      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      await updateTagTicket(target.id, { nombre });

      toast.success("Etiqueta actualizada correctamente.");
      editDialogRef.current.close();
      stateRef.current.setField("editingEtiqueta", null);
      resetForm();
      await loadTags();
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      const target = deleteDialogRef.current.target;

      if (!target?.id) {
        toast.error("Seleccione una etiqueta para eliminar.");
        return;
      }

      await deleteDialogRef.current.confirm(async () => {
        await deleteTagTicket(target.id);

        toast.success("Etiqueta eliminada exitosamente.");

        /*
          No bloqueamos el cierre esperando la recarga.
          El confirm handler cierra el dialog y luego refrescamos.
        */
        void loadTags();
      });
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

  const etiquetas = Array.isArray(state.state.etiquetas)
    ? state.state.etiquetas
    : [];

  const filteredEtiquetas = React.useMemo(
    () => filterEtiquetas(etiquetas, state.state.searchEtiqueta),
    [etiquetas, state.state.searchEtiqueta],
  );

  const stats = React.useMemo(() => getTagTicketStats(etiquetas), [etiquetas]);

  const isLoading = loadAction.isLoading || !state.state.hasLoaded;

  const isMutating =
    createAction.isLoading || editAction.isLoading || deleteAction.isLoading;

  return {
    state: state.state,

    etiquetas,
    filteredEtiquetas,
    stats,

    isLoading,
    isMutating,

    createDialog,
    editDialog,
    deleteDialog,

    loadAction,
    createAction,
    editAction,
    deleteAction,

    loadTags,
    setSearchEtiqueta,
    setNombre,
    resetForm,

    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openDeleteById,

    submitCreate,
    submitEdit,
    confirmDelete,
  };
}
