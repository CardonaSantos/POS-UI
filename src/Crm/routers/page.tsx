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
  useDeactivateRouterMk,
  useGetMikroTiks,
  useReactivateRouterMk,
} from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";

import type { MikrotikRoutersResponse } from "../features/mikro-tiks/mikrotiks.interfaces";

import MikroTiks from "./_components/mikrotiks-map";

const ROUTERS_BASE_PATH = "/crm/routers";

function RouterMainPage() {
  const navigate = useNavigate();

  const [statusTarget, setStatusTarget] =
    useState<MikrotikRoutersResponse | null>(null);

  const [openStatus, setOpenStatus] = useState(false);

  const { data: mks } = useGetMikroTiks();

  const mikrotiks = mks ?? [];

  const deactivateMk = useDeactivateRouterMk();

  const reactivateMk = useReactivateRouterMk();

  const isStatusPending = deactivateMk.isPending || reactivateMk.isPending;

  const handleCreate = () => {
    navigate(`${ROUTERS_BASE_PATH}/nuevo`);
  };

  const handleSelectToEdit = (mk: MikrotikRoutersResponse) => {
    if (!mk.activo) {
      toast.error("El router está retirado. Reactívalo antes de editarlo.");

      return;
    }

    navigate(`${ROUTERS_BASE_PATH}/${mk.id}/editar`);
  };

  const handleOpenStatusChange = (mk: MikrotikRoutersResponse) => {
    setStatusTarget(mk);
    setOpenStatus(true);
  };

  const handleStatusDialogChange = (open: boolean) => {
    if (!open && isStatusPending) {
      return;
    }

    setOpenStatus(open);

    if (!open) {
      setStatusTarget(null);
    }
  };

  const handleStatusChange = async () => {
    const routerId = statusTarget?.id;

    if (!Number.isInteger(routerId) || !routerId || routerId <= 0) {
      toast.error("No se pudo identificar el router.");

      return;
    }

    if (!statusTarget) {
      return;
    }

    try {
      if (statusTarget.activo) {
        await toast.promise(deactivateMk.mutateAsync(routerId), {
          loading: "Retirando router...",

          success: "Router retirado correctamente",

          error: (error) => getApiErrorMessageAxios(error),
        });
      } else {
        await toast.promise(reactivateMk.mutateAsync(routerId), {
          loading: "Reactivando router...",

          success: "Router reactivado correctamente",

          error: (error) => getApiErrorMessageAxios(error),
        });
      }

      setOpenStatus(false);
      setStatusTarget(null);
    } catch {
      /*
       * El toast ya presenta el error.
       *
       * Conservamos el diálogo abierto
       * para permitir reintentar.
       */
    }
  };

  const isRetiring = statusTarget?.activo === true;

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
          handleOpenStatusChange={handleOpenStatusChange}
        />
      </AppStack>

      {/* ================================= */}
      {/* RETIRAR / REACTIVAR */}
      {/* ================================= */}

      <AppConfirmDialog
        open={openStatus}
        onOpenChange={handleStatusDialogChange}
        preset={isRetiring ? "delete" : "warning"}
        title={
          isRetiring ? "Retirar router MikroTik" : "Reactivar router MikroTik"
        }
        description={
          statusTarget
            ? isRetiring
              ? `El router "${statusTarget.nombre}" será retirado y dejará de estar disponible para nuevas operaciones. Su historial y relaciones se conservarán.`
              : `El router "${statusTarget.nombre}" volverá a estar disponible para conexiones SSH, operaciones y configuraciones que dependan de él.`
            : undefined
        }
        confirmText={isRetiring ? "Retirar router" : "Reactivar router"}
        loadingText={isRetiring ? "Retirando..." : "Reactivando..."}
        onConfirm={handleStatusChange}
        isLoading={isStatusPending}
        disabled={!statusTarget}
        preventClose={isStatusPending}
        closeOnConfirm={false}
      />
    </PageTransitionCrm>
  );
}

export default RouterMainPage;
