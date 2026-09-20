import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppDisclosure } from "@/components/app/handlers";
import { useGetInstalacion } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { INSTALACIONES_ROUTES } from "../filters/routes";
import { InstalacionDetailView } from "./instalacion-detail-view";
import { isImageEvidence } from "./instalacion-utils.utils";
import { usePlantillasContrato } from "@/Crm/CrmCustomer/API/customer-profile.queries";
import { PlantillasInterface } from "@/Crm/features/plantilla-contratos/plantilla-contratos";

type InstalacionDetailContentProps = {
  instalacionId: number;
};

function InstalacionDetailContent({
  instalacionId,
}: InstalacionDetailContentProps) {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const query = useGetInstalacion(instalacionId, empresaId);
  const gallery = useAppDisclosure();
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(0);

  const { data: plantillasData } = usePlantillasContrato();

  const plantillas = React.useMemo<PlantillasInterface[]>(
    () => plantillasData ?? [],
    [plantillasData],
  );

  const imageEvidences = useMemo(
    () => (query.data?.evidencias ?? []).filter(isImageEvidence),
    [query.data?.evidencias],
  );

  const slides = useMemo(
    () =>
      imageEvidences.map((evidencia) => ({
        src: evidencia.media.cdnUrl!,
        alt:
          evidencia.descripcion ?? `Evidencia de instalación ${instalacionId}`,
      })),
    [imageEvidences, instalacionId],
  );

  const handleOpenEvidence = (index: number) => {
    if (!slides[index]) return;

    setActiveEvidenceIndex(index);
    gallery.open();
  };

  return (
    <PageTransitionCrm
      titleHeader={`Detalle de Instalación #${instalacionId}`}
      variant="fade-pure"
    >
      <AppContainer size="xl" paddingX="none" paddingY="none">
        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          isEmpty={!query.data}
          onRetry={() => query.refetch()}
          loadingVariant="skeleton-grid"
          emptyTitle="Instalación no encontrada"
          emptyDescription="No existe una instalación accesible con este identificador."
          variant="plain"
          size="sm"
          minHeight="lg"
        >
          {query.data ? (
            <InstalacionDetailView
              instalacion={query.data}
              empresaId={empresaId}
              onOpenEvidence={handleOpenEvidence}
              plantillas={plantillas}
            />
          ) : null}
        </AppDataState>
      </AppContainer>

      <Lightbox
        open={gallery.isOpen}
        close={gallery.close}
        index={activeEvidenceIndex}
        slides={slides}
        carousel={{ finite: true }}
      />
    </PageTransitionCrm>
  );
}

function InvalidInstalacionId() {
  return (
    <AppContainer size="md" paddingX="sm" paddingY="sm">
      <AppCard variant="outline" size="sm" radius="md">
        <AppStack gap="sm">
          <div>
            <h1 className="text-lg font-semibold">Instalación no válida</h1>
            <p className="text-sm">
              El identificador recibido no corresponde a una instalación válida.
            </p>
          </div>

          <div>
            <AppButton asChild variant="outline" size="sm">
              <Link to={INSTALACIONES_ROUTES.listado}>Regresar al listado</Link>
            </AppButton>
          </div>
        </AppStack>
      </AppCard>
    </AppContainer>
  );
}

export default function InstalacionDetailPage() {
  const { instalacionId } = useParams<{ instalacionId: string }>();
  const parsedId = Number(instalacionId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <InvalidInstalacionId />;
  }

  return <InstalacionDetailContent instalacionId={parsedId} />;
}
