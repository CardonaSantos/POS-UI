import { useState } from "react";

import { Plus, Router } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";

import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

import { AppInline } from "@/components/app/primitives/app-inline";

import { AppStack } from "@/components/app/primitives/app-stack";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import {
  useDeleteRouterMk,
  useGetMikroTiks,
} from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";

import type { MikrotikRoutersResponse } from "../features/mikro-tiks/mikrotiks.interfaces";
import MikroTiks from "./_components/mikrotiks-map";

const ROUTERS_BASE_PATH = "/crm/routers";

function RouterMainPage() {
  const navigate = useNavigate();

  const [mkToDelete, setMkToDelete] = useState<MikrotikRoutersResponse | null>(
    null,
  );

  const [openDelete, setOpenDelete] = useState(false);

  const { data: mks } = useGetMikroTiks();

  const mikrotiks = mks ?? [];

  const deleteMk = useDeleteRouterMk();

  const handleCreate = () => {
    navigate(`${ROUTERS_BASE_PATH}/nuevo`);
  };

  const handleSelectToEdit = (mk: MikrotikRoutersResponse) => {
    navigate(`${ROUTERS_BASE_PATH}/${mk.id}/editar`);
  };

  const handleOpenDelete = (mk: MikrotikRoutersResponse) => {
    setMkToDelete(mk);

    setOpenDelete(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open && deleteMk.isPending) {
      return;
    }

    setOpenDelete(open);

    if (!open) {
      setMkToDelete(null);
    }
  };

  const handleDelete = async () => {
    const routerId = mkToDelete?.id;

    if (!Number.isInteger(routerId) || !routerId || routerId <= 0) {
      toast.error("No se pudo identificar el router a eliminar.");

      return;
    }

    await toast.promise(deleteMk.mutateAsync(routerId), {
      loading: "Eliminando router...",

      success: "Router eliminado correctamente",

      error: (error) => getApiErrorMessageAxios(error),
    });

    setOpenDelete(false);

    setMkToDelete(null);
  };

  return (
    <PageTransitionCrm
      titleHeader="Routers MikroTik"
      subtitle="Administra la infraestructura MikroTik utilizada por los servicios de red y PPPoE."
      variant="fade-pure"
    >
      <AppStack gap="sm">
        {/* ================================= */}
        {/* TOOLBAR */}
        {/* ================================= */}

        <AppInline
          justify="between"
          align="center"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <AppInline align="center" gap="xs" wrap={false}>
            <Router
              size={16}
              aria-hidden="true"
              className="text-[hsl(var(--app-muted-foreground))]"
            />

            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Configura y administra los routers conectados al CRM.
            </p>
          </AppInline>

          <AppButton
            type="button"
            size="sm"
            leftIcon={<Plus size={15} aria-hidden="true" />}
            onClick={handleCreate}
          >
            Nuevo router
          </AppButton>
        </AppInline>

        {/* ================================= */}
        {/* LISTADO */}
        {/* ================================= */}

        <MikroTiks
          mikrotiks={mikrotiks}
          handleSelectToEdit={handleSelectToEdit}
          handleOpenDelete={handleOpenDelete}
        />
      </AppStack>

      {/* ================================= */}
      {/* ELIMINACIÓN */}
      {/* ================================= */}

      <AppConfirmDialog
        open={openDelete}
        onOpenChange={handleDeleteDialogChange}
        preset="delete"
        title="Eliminar router MikroTik"
        description={
          mkToDelete
            ? `Se eliminará el router "${mkToDelete.nombre}". Esta acción puede afectar configuraciones o servicios que dependan de él.`
            : undefined
        }
        confirmText="Eliminar router"
        loadingText="Eliminando..."
        onConfirm={handleDelete}
        isLoading={deleteMk.isPending}
        disabled={!mkToDelete}
        preventClose={deleteMk.isPending}
        closeOnConfirm={false}
      />
    </PageTransitionCrm>
  );
}

export default RouterMainPage;
