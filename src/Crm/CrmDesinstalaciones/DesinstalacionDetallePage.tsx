import { useCallback } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";

import { useGetDesinstalacionDetalle } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import { DesinstalacionDetalleView } from "./DesinstalacionDetalleView";
import { DESINSTALACIONES_ROUTES } from "./table/routes.route";

function DesinstalacionDetallePage() {
  const navigate = useNavigate();

  const { desinstalacionId } = useParams<{
    desinstalacionId: string;
  }>();

  const id = Number(desinstalacionId);

  const idValido = Number.isInteger(id) && id > 0;

  const detalleQuery = useGetDesinstalacionDetalle(idValido ? id : 0);

  const handleBack = useCallback(() => {
    navigate(DESINSTALACIONES_ROUTES.listado);
  }, [navigate]);

  /*
   * Aquí únicamente dejamos preparado el contrato.
   *
   * El siguiente paso será conectarlo al
   * SubirEvidenciaDesinstalacionDialog.
   */
  const handleUploadEvidence = useCallback(() => {
    // abrir dialog
  }, []);

  if (!idValido) {
    return (
      <PageTransitionCrm titleHeader="Desinstalación" variant="fade-pure">
        <AppContainer size="full" paddingX="none" paddingY="none">
          <AppCard variant="outline" size="xs" radius="md">
            <p className="text-sm font-medium">Desinstalación no válida</p>
          </AppCard>
        </AppContainer>
      </PageTransitionCrm>
    );
  }

  if (detalleQuery.isPending) {
    return (
      <PageTransitionCrm
        titleHeader={`Desinstalación #${id}`}
        variant="fade-pure"
      >
        <AppContainer size="full" paddingX="none" paddingY="none">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="h-32 animate-pulse rounded-md bg-muted" />
            <div className="h-32 animate-pulse rounded-md bg-muted" />
          </div>
        </AppContainer>
      </PageTransitionCrm>
    );
  }

  if (detalleQuery.isError || !detalleQuery.data) {
    return (
      <PageTransitionCrm
        titleHeader={`Desinstalación #${id}`}
        variant="fade-pure"
      >
        <AppContainer size="full" paddingX="none" paddingY="none">
          <AppCard variant="outline" size="xs" radius="md">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                No se pudo cargar la desinstalación.
              </p>

              <AppButton
                size="xs"
                variant="outline"
                onClick={() => detalleQuery.refetch()}
              >
                Reintentar
              </AppButton>
            </div>
          </AppCard>
        </AppContainer>
      </PageTransitionCrm>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader={`Desinstalación #${id}`}
      variant="fade-pure"
    >
      <AppContainer size="full" paddingX="none" paddingY="none">
        <DesinstalacionDetalleView
          detalle={detalleQuery.data}
          onBack={handleBack}
          onUploadEvidence={handleUploadEvidence}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default DesinstalacionDetallePage;
