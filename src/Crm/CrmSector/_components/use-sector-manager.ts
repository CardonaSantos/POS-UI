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
  Municipio,
  Sector,
} from "../../features/cliente-interfaces/cliente-types";
import type { Departamentos } from "../../features/locations-interfaces/municipios_departamentos.interfaces";

import {
  buildSectorPayload,
  createEmptySectorForm,
  filterSectores,
  getSectorStats,
  normalizeDepartamentosResponse,
  normalizeMunicipiosResponse,
  normalizeSectoresResponse,
  sectorToForm,
  toDepartamentoOptions,
  toMunicipioOptions,
  validateSectorForm,
  type SectorFormState,
} from "./sector.helpers";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface SectorManagerState {
  sectores: Sector[];
  departamentos: Departamentos[];
  municipios: Municipio[];
  searchQuery: string;
  sectorForm: SectorFormState;
  selectedSector: Sector | null;
  hasLoaded: boolean;
  error: string | null;
}

function getInitialState(): SectorManagerState {
  return {
    sectores: [],
    departamentos: [],
    municipios: [],
    searchQuery: "",
    sectorForm: createEmptySectorForm(),
    selectedSector: null,
    hasLoaded: false,
    error: null,
  };
}

export function useSectorManager() {
  const createDialog = useAppDisclosure();
  const editDialog = useAppDisclosure();
  const detailDialog = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<Sector>();

  const state = useAppStateHandlers<SectorManagerState>(getInitialState());

  const stateRef = React.useRef(state);
  const createDialogRef = React.useRef(createDialog);
  const editDialogRef = React.useRef(editDialog);
  const detailDialogRef = React.useRef(detailDialog);
  const deleteDialogRef = React.useRef(deleteDialog);

  React.useEffect(() => {
    stateRef.current = state;
    createDialogRef.current = createDialog;
    editDialogRef.current = editDialog;
    detailDialogRef.current = detailDialog;
    deleteDialogRef.current = deleteDialog;
  });

  const loadSectores = React.useCallback(async () => {
    const response = await axios.get<unknown>(`${VITE_CRM_API_URL}/sector`);
    return normalizeSectoresResponse(response.data);
  }, []);

  const loadDepartamentos = React.useCallback(async () => {
    const response = await axios.get<unknown>(
      `${VITE_CRM_API_URL}/location/get-all-departamentos`,
    );

    return normalizeDepartamentosResponse(response.data);
  }, []);

  const loadMunicipios = React.useCallback(
    async (departamentoId: string | null) => {
      if (!departamentoId) {
        stateRef.current.setField("municipios", []);
        return [];
      }

      const response = await axios.get<unknown>(
        `${VITE_CRM_API_URL}/location/get-municipio/${Number(departamentoId)}`,
      );

      const municipios = normalizeMunicipiosResponse(response.data);
      stateRef.current.setField("municipios", municipios);

      return municipios;
    },
    [],
  );

  const loadAll = React.useCallback(async () => {
    stateRef.current.setField("error", null);

    try {
      const [sectores, departamentos] = await Promise.all([
        loadSectores(),
        loadDepartamentos(),
      ]);

      stateRef.current.setState({
        ...stateRef.current.state,
        sectores,
        departamentos,
        hasLoaded: true,
        error: null,
      });

      await loadMunicipios(stateRef.current.state.sectorForm.departamentoId);
    } catch (error) {
      console.error("Error al cargar sectores:", error);

      const message = "Error al cargar sectores.";

      stateRef.current.setField("error", message);
      stateRef.current.setField("hasLoaded", true);

      toast.error(message);
    }
  }, [loadDepartamentos, loadMunicipios, loadSectores]);

  const loadAction = useAppAsyncAction(
    async () => {
      await loadAll();
    },
    { preventConcurrent: true },
  );

  React.useEffect(() => {
    void loadAction.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patchSectorForm = React.useCallback(
    (patch: Partial<SectorFormState>) => {
      stateRef.current.setField("sectorForm", {
        ...stateRef.current.state.sectorForm,
        ...patch,
      });
    },
    [],
  );

  const resetSectorForm = React.useCallback(() => {
    stateRef.current.setField("sectorForm", createEmptySectorForm());
  }, []);

  const handleDepartamentoChange = React.useCallback(
    async (departamentoId: string | null) => {
      stateRef.current.setField("sectorForm", {
        ...stateRef.current.state.sectorForm,
        departamentoId,
        municipioId: "",
      });

      await loadMunicipios(departamentoId);
    },
    [loadMunicipios],
  );

  const handleMunicipioChange = React.useCallback(
    (municipioId: string | null) => {
      patchSectorForm({
        municipioId: municipioId ?? "",
      });
    },
    [patchSectorForm],
  );

  const setSearchQuery = React.useCallback((value: string) => {
    stateRef.current.setField("searchQuery", value);
  }, []);

  const clearSearch = React.useCallback(() => {
    stateRef.current.setField("searchQuery", "");
  }, []);

  const openCreateDialog = React.useCallback(async () => {
    const emptyForm = createEmptySectorForm();

    stateRef.current.setField("sectorForm", emptyForm);
    await loadMunicipios(emptyForm.departamentoId);

    createDialogRef.current.open();
  }, [loadMunicipios]);

  const openEditDialog = React.useCallback(
    async (sector: Sector) => {
      const form = sectorToForm(sector);

      stateRef.current.setField("sectorForm", form);
      stateRef.current.setField("selectedSector", sector);

      await loadMunicipios(form.departamentoId);

      editDialogRef.current.open();
    },
    [loadMunicipios],
  );

  const openDetailDialog = React.useCallback((sector: Sector) => {
    stateRef.current.setField("selectedSector", sector);
    detailDialogRef.current.open();
  }, []);

  const openDeleteDialog = React.useCallback((sector: Sector) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        deleteDialogRef.current.open(sector);
      }, 0);
    });
  }, []);

  const createAction = useAppAsyncAction(
    async () => {
      const form = stateRef.current.state.sectorForm;

      const errorMessage = validateSectorForm(form);
      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      await axios.post(`${VITE_CRM_API_URL}/sector`, buildSectorPayload(form));

      toast.success("El sector ha sido creado exitosamente");

      createDialogRef.current.close();
      resetSectorForm();
      await loadAll();
    },
    { preventConcurrent: true },
  );

  const updateAction = useAppAsyncAction(
    async () => {
      const form = stateRef.current.state.sectorForm;

      if (!form.id) {
        toast.info("Seleccione un sector para editar.");
        return;
      }

      const errorMessage = validateSectorForm(form);
      if (errorMessage) {
        toast.info(errorMessage);
        return;
      }

      await axios.patch(
        `${VITE_CRM_API_URL}/sector/update-sector/${form.id}`,
        buildSectorPayload(form),
      );

      toast.success("El sector ha sido editado exitosamente");

      editDialogRef.current.close();
      resetSectorForm();
      await loadAll();
    },
    { preventConcurrent: true },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      await deleteDialogRef.current.confirm(async (target) => {
        if (!target?.id) {
          toast.info("Seleccione un sector para eliminar.");
          return;
        }

        await axios.delete(`${VITE_CRM_API_URL}/sector/${target.id}`);

        toast.success("El sector ha sido eliminado exitosamente");

        await loadAll();
      });
    },
    { preventConcurrent: true },
  );

  const submitCreate = React.useCallback(async () => {
    await createAction.run();
  }, [createAction]);

  const submitEdit = React.useCallback(async () => {
    await updateAction.run();
  }, [updateAction]);

  const confirmDelete = React.useCallback(async () => {
    await deleteAction.run();
  }, [deleteAction]);

  const sectores = Array.isArray(state.state.sectores)
    ? state.state.sectores
    : [];

  const departamentos = Array.isArray(state.state.departamentos)
    ? state.state.departamentos
    : [];

  const municipios = Array.isArray(state.state.municipios)
    ? state.state.municipios
    : [];

  const filteredSectores = React.useMemo(
    () => filterSectores(sectores, municipios, state.state.searchQuery),
    [sectores, municipios, state.state.searchQuery],
  );

  const stats = React.useMemo(() => getSectorStats(sectores), [sectores]);

  const departamentoOptions = React.useMemo(
    () => toDepartamentoOptions(departamentos),
    [departamentos],
  );

  const municipioOptions = React.useMemo(
    () => toMunicipioOptions(municipios),
    [municipios],
  );

  const isLoading = loadAction.isLoading || !state.state.hasLoaded;

  const isMutating =
    createAction.isLoading || updateAction.isLoading || deleteAction.isLoading;

  return {
    state: state.state,

    sectores,
    departamentos,
    municipios,
    filteredSectores,
    stats,

    departamentoOptions,
    municipioOptions,

    isLoading,
    isMutating,
    isCreating: createAction.isLoading,
    isUpdating: updateAction.isLoading,
    isDeleting: deleteAction.isLoading,

    createDialog,
    editDialog,
    detailDialog,
    deleteDialog,

    loadAction,
    createAction,
    updateAction,
    deleteAction,

    loadAll,
    setSearchQuery,
    clearSearch,
    patchSectorForm,
    resetSectorForm,
    handleDepartamentoChange,
    handleMunicipioChange,

    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    openDeleteDialog,

    submitCreate,
    submitEdit,
    confirmDelete,
  };
}
