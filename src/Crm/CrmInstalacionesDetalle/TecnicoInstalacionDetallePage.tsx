import { useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppConfirmHandler } from "@/components/app/handlers";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

import { useGetDetalleInstalacionTecnica } from "../CrmHooks/hooks/instalaciones/instalaciones-hook";

import { InstalacionDetalleSkeleton } from "./components/instalacion-detalle-skeleton";
import { TecnicoInstalacionActionHost } from "./TecnicoInstalacionActionHost";

import {
  normalizeDetalleInstalacionTecnicaResponse,
  type InstalacionDetalleActionRequest,
} from "./tecnico-instalacion-detalle.utils";
import { TecnicoInstalacionDetalleView } from "./TecnicoInstalacionDetalleView ";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

export default function TecnicoInstalacionDetallePage() {
  const navigate = useNavigate();

  const { instalacionId: instalacionIdParam } = useParams<{
    instalacionId: string;
  }>();

  const instalacionId = Number(instalacionIdParam);

  const instalacionIdValido =
    Number.isInteger(instalacionId) && instalacionId > 0;

  const detalleQuery = useGetDetalleInstalacionTecnica(instalacionId);

  const detalle = useMemo(() => {
    if (!detalleQuery.data) return null;

    return normalizeDetalleInstalacionTecnicaResponse(detalleQuery.data);
  }, [detalleQuery.data]);

  const actionFlow = useAppConfirmHandler<InstalacionDetalleActionRequest>();

  const handleBack = useCallback(() => {
    navigate("/crm/instalaciones/tecnico");
  }, [navigate]);

  const handleAction = useCallback(
    (request: InstalacionDetalleActionRequest) => {
      actionFlow.open(request);
    },
    [actionFlow],
  );

  const handleActionCompleted = useCallback(async () => {
    actionFlow.setOpen(false);
    await detalleQuery.refetch();
  }, [actionFlow, detalleQuery]);

  if (!instalacionIdValido) {
    return (
      <AppContainer size="md" paddingX="sm" paddingY="sm">
        <AppEmptyState
          preset="empty"
          variant="soft"
          title="Instalación no válida"
          description="El identificador de la instalación no es válido."
          action={
            <AppButton size="sm" variant="outline" onClick={handleBack}>
              <ArrowLeft aria-hidden="true" />
              Volver
            </AppButton>
          }
        />
      </AppContainer>
    );
  }

  if (detalleQuery.isLoading) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <InstalacionDetalleSkeleton />
      </AppContainer>
    );
  }

  if (detalleQuery.error) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <AppDataState
          error={detalleQuery.error}
          onRetry={() => detalleQuery.refetch()}
        >
          <div />
        </AppDataState>
      </AppContainer>
    );
  }

  if (!detalle) {
    return (
      <AppContainer size="md" paddingX="sm" paddingY="sm">
        <AppEmptyState
          preset="empty"
          variant="soft"
          title="Instalación no encontrada"
          description="No fue posible obtener el detalle."
          action={
            <AppButton size="sm" variant="outline" onClick={handleBack}>
              <ArrowLeft aria-hidden="true" />
              Volver
            </AppButton>
          }
        />
      </AppContainer>
    );
  }

  return (
    <>
      <PageTransitionCrm
        titleHeader={`Instalación #${instalacionId}`}
        variant="fade-pure"
      >
        <AppDataState isFetching={detalleQuery.isFetching}>
          <TecnicoInstalacionDetalleView
            detalle={detalle}
            onBack={handleBack}
            onAction={handleAction}
          />
        </AppDataState>

        <TecnicoInstalacionActionHost
          detalle={detalle}
          request={actionFlow.target}
          open={actionFlow.isOpen}
          onOpenChange={actionFlow.setOpen}
          onCompleted={handleActionCompleted}
        />
      </PageTransitionCrm>
    </>
  );
}
