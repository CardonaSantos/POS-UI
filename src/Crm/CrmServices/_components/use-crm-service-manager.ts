"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import type {
  NuevoTipoServicio,
  ServicioServiceManage,
  TipoServicio,
} from "../crm-service.types";

import {
  buildServicioPayload,
  buildTipoServicioPayload,
  createEmptyServicio,
  createEmptyTipoServicio,
  filterServicios,
  normalizeServiciosResponse,
  normalizeTiposServicioResponse,
  servicioToForm,
  validateServicioForm,
  validateTipoServicioForm,
  type ServicioFormState,
} from "./crm-service.helpers";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface CrmServiceState {
  servicios: ServicioServiceManage[];
  tiposServicio: TipoServicio[];
  searchServicio: string;
  servicioForm: ServicioFormState;
  tipoServicioForm: NuevoTipoServicio;
  hasLoaded: boolean;
  error: string | null;
}

function getInitialState(empresaId: number): CrmServiceState {
  return {
    servicios: [],
    tiposServicio: [],
    searchServicio: "",
    servicioForm: createEmptyServicio(empresaId),
    tipoServicioForm: createEmptyTipoServicio(),
    hasLoaded: false,
    error: null,
  };
}

export function useCrmServiceManager(empresaId: number) {
  const createServicioDialog = useAppDisclosure();
  const createTipoDialog = useAppDisclosure();
  const editServicioDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<ServicioServiceManage>();

  const state = useAppStateHandlers<CrmServiceState>(
    getInitialState(empresaId),
  );

  const stateRef = React.useRef(state);
  const empresaIdRef = React.useRef(empresaId);
  const createServicioDialogRef = React.useRef(createServicioDialog);
  const createTipoDialogRef = React.useRef(createTipoDialog);
  const editServicioDialogRef = React.useRef(editServicioDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    stateRef.current = state;
    empresaIdRef.current = empresaId;
    createServicioDialogRef.current = createServicioDialog;
    createTipoDialogRef.current = createTipoDialog;
    editServicioDialogRef.current = editServicioDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const loadTiposServicio = React.useCallback(async () => {
    const response = await axios.get<unknown>(
      `${VITE_CRM_API_URL}/tipo-servicio`,
    );

    return normalizeTiposServicioResponse(response.data);
  }, []);

  const loadServicios = React.useCallback(async () => {
    const response = await axios.get<unknown>(`${VITE_CRM_API_URL}/servicio`);

    return normalizeServiciosResponse(response.data);
  }, []);

  const loadAll = React.useCallback(async () => {
    stateRef.current.setField("error", null);

    try {
      const [tiposServicio, servicios] = await Promise.all([
        loadTiposServicio(),
        loadServicios(),
      ]);

      stateRef.current.setState({
        ...stateRef.current.state,
        tiposServicio,
        servicios,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      console.error(error);

      const message = "Error al obtener servicios.";

      stateRef.current.setField("error", message);
      stateRef.current.setField("hasLoaded", true);

      toast.error(message);
    }
  }, [loadServicios, loadTiposServicio]);

  const loadAction = useAppAsyncAction(
    async () => {
      await loadAll();
    },
    {
      preventConcurrent: true,
    },
  );

  React.useEffect(() => {
    void loadAction.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSearchServicio = React.useCallback((value: string) => {
    stateRef.current.setField("searchServicio", value);
  }, []);

  const clearSearch = React.useCallback(() => {
    stateRef.current.setField("searchServicio", "");
  }, []);

  const patchServicioForm = React.useCallback(
    (patch: Partial<ServicioFormState>) => {
      stateRef.current.setField("servicioForm", {
        ...stateRef.current.state.servicioForm,
        ...patch,
      });
    },
    [],
  );

  const patchTipoServicioForm = React.useCallback(
    (patch: Partial<NuevoTipoServicio>) => {
      stateRef.current.setField("tipoServicioForm", {
        ...stateRef.current.state.tipoServicioForm,
        ...patch,
      });
    },
    [],
  );

  const resetServicioForm = React.useCallback(() => {
    stateRef.current.setField(
      "servicioForm",
      createEmptyServicio(empresaIdRef.current),
    );
  }, []);

  const resetTipoServicioForm = React.useCallback(() => {
    stateRef.current.setField("tipoServicioForm", createEmptyTipoServicio());
  }, []);

  const openCreateServicio = React.useCallback(() => {
    resetServicioForm();
    createServicioDialogRef.current.open();
  }, [resetServicioForm]);

  const openCreateTipoServicio = React.useCallback(() => {
    resetTipoServicioForm();
    createTipoDialogRef.current.open();
  }, [resetTipoServicioForm]);

  const openEditServicio = React.useCallback(
    (servicio: ServicioServiceManage) => {
      stateRef.current.setField("servicioForm", servicioToForm(servicio));
      editServicioDialogRef.current.open();
    },
    [],
  );

  const openDeleteServicio = React.useCallback(
    (servicio: ServicioServiceManage) => {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          deleteDialogRef.current.open(servicio);
        }, 0);
      });
    },
    [],
  );

  const createServicioAction = useAppAsyncAction(
    async () => {
      const form = stateRef.current.state.servicioForm;

      const errorMessage = validateServicioForm(form);

      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      try {
        await axios.post(
          `${VITE_CRM_API_URL}/servicio`,
          buildServicioPayload(form),
        );

        toast.success("Servicio creado exitosamente");

        resetServicioForm();
        createServicioDialogRef.current.close();

        await loadAll();
      } catch (error) {
        console.error(error);
        toast.error("Error al crear servicio");
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const createTipoServicioAction = useAppAsyncAction(
    async () => {
      const form = stateRef.current.state.tipoServicioForm;

      const errorMessage = validateTipoServicioForm(form);

      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      try {
        await axios.post(
          `${VITE_CRM_API_URL}/tipo-servicio`,
          buildTipoServicioPayload(form),
        );

        toast.success("Nuevo tipo de servicio creado");

        resetTipoServicioForm();
        createTipoDialogRef.current.close();

        await loadAll();
      } catch (error) {
        console.error(error);
        toast.error("Error al crear tipo de servicio");
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const updateServicioAction = useAppAsyncAction(
    async () => {
      const form = stateRef.current.state.servicioForm;

      if (!form.id) {
        toast.info("Seleccione un servicio para editar.");
        return;
      }

      const errorMessage = validateServicioForm(form);

      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      try {
        await axios.patch(
          `${VITE_CRM_API_URL}/servicio/update-servicio/${form.id}`,
          buildServicioPayload(form),
        );

        toast.success("Servicio actualizado exitosamente");

        resetServicioForm();
        editServicioDialogRef.current.close();

        await loadAll();
      } catch (error) {
        console.error(error);
        toast.error("Error al actualizar servicio");
      }
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteServicioAction = useAppAsyncAction(
    async () => {
      await deleteDialogRef.current.confirm(async (target) => {
        if (!target?.id) {
          toast.info("Seleccione un servicio para eliminar.");
          return;
        }

        try {
          await axios.delete(
            `${VITE_CRM_API_URL}/servicio/delete-servicio/${target.id}`,
          );

          toast.success("Servicio eliminado exitosamente");

          await loadAll();
        } catch (error) {
          console.error(error);
          toast.error("Error al eliminar servicio");
        }
      });
    },
    {
      preventConcurrent: true,
    },
  );

  const submitCreateServicio = React.useCallback(async () => {
    await createServicioAction.run();
  }, [createServicioAction]);

  const submitCreateTipoServicio = React.useCallback(async () => {
    await createTipoServicioAction.run();
  }, [createTipoServicioAction]);

  const submitUpdateServicio = React.useCallback(async () => {
    await updateServicioAction.run();
  }, [updateServicioAction]);

  const confirmDeleteServicio = React.useCallback(async () => {
    await deleteServicioAction.run();
  }, [deleteServicioAction]);

  const servicios = Array.isArray(state.state.servicios)
    ? state.state.servicios
    : [];

  const tiposServicio = Array.isArray(state.state.tiposServicio)
    ? state.state.tiposServicio
    : [];

  const filteredServicios = React.useMemo(
    () => filterServicios(servicios, state.state.searchServicio),
    [servicios, state.state.searchServicio],
  );

  const tipoOptions = React.useMemo(
    () =>
      tiposServicio.map((tipo) => ({
        value: String(tipo.id),
        label: tipo.nombre,
      })),
    [tiposServicio],
  );

  const isLoading = loadAction.isLoading || !state.state.hasLoaded;

  const isMutating =
    createServicioAction.isLoading ||
    createTipoServicioAction.isLoading ||
    updateServicioAction.isLoading ||
    deleteServicioAction.isLoading;

  return {
    state: state.state,

    servicios,
    tiposServicio,
    tipoOptions,
    filteredServicios,

    isLoading,
    isMutating,

    createServicioDialog,
    createTipoDialog,
    editServicioDialog,
    deleteDialog,

    loadAction,
    createServicioAction,
    createTipoServicioAction,
    updateServicioAction,
    deleteServicioAction,

    setSearchServicio,
    clearSearch,
    patchServicioForm,
    patchTipoServicioForm,
    resetServicioForm,
    resetTipoServicioForm,

    openCreateServicio,
    openCreateTipoServicio,
    openEditServicio,
    openDeleteServicio,

    submitCreateServicio,
    submitCreateTipoServicio,
    submitUpdateServicio,
    confirmDeleteServicio,
  };
}
