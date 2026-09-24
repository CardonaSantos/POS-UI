import { Link, useParams } from "react-router-dom";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppStack } from "@/components/app/primitives/app-stack";

import { TrackingAttendanceOverview } from "./tracking-attendance-overview";
import { TrackingAttendanceRouteMap } from "./tracking-attendance-route-map";
import { TrackingAttendanceSessions } from "./tracking-attendance-sessions";
import { useTrackingAttendanceDetailPage } from "./use-tracking-attendance-detail-page";

const JOURNEYS_ROUTE = "/crm/real-time-location?tab=jornadas";

function DetailContent({ asistenciaId }: { asistenciaId: number }) {
  const page = useTrackingAttendanceDetailPage(asistenciaId);
  const detail = page.detail;

  return (
    <PageTransitionCrm
      titleHeader={`Detalle de jornada #${asistenciaId}`}
      subtitle={detail?.tecnico.nombre ?? "Seguimiento e historial GPS"}
      fallbackBackTo={JOURNEYS_ROUTE}
      variant="fade-pure"
      actions={
        <AppButton
          type="button"
          size="xs"
          variant="outline"
          loading={page.isFetching}
          loadingText="Actualizando..."
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={() => void page.refetchAll()}
        >
          Actualizar
        </AppButton>
      }
    >
      <AppDataState
        isLoading={page.isLoading}
        isFetching={page.isFetching}
        error={page.error}
        isEmpty={!detail}
        onRetry={() => void page.refetchAll()}
        loadingVariant="skeleton-grid"
        emptyTitle="Jornada no encontrada"
        emptyDescription="No existe una jornada de tracking accesible con este identificador."
        variant="plain"
        size="sm"
        minHeight="lg"
      >
        {detail ? (
          <AppStack gap="md">
            <TrackingAttendanceOverview
              detail={detail}
              totalLocationPoints={page.totalLocationPoints}
            />

            {page.routeIsPartial ? (
              <AppAlert
                tone="warning"
                variant="soft"
                size="xs"
                icon={<AlertTriangle className="h-4 w-4" />}
                title="El recorrido mostrado es parcial"
                description={`La jornada posee ${page.totalLocationPoints} puntos GPS. Esta vista cargó ${page.loadedLocationPoints} de un máximo de ${page.routePointsLimit} por consulta.`}
              />
            ) : null}

            <TrackingAttendanceRouteMap locations={page.locations} />

            <TrackingAttendanceSessions
              detail={detail}
              locations={page.locations}
              totalLocations={page.totalLocationPoints}
            />
          </AppStack>
        ) : null}
      </AppDataState>
    </PageTransitionCrm>
  );
}

function InvalidAttendanceId() {
  return (
    <AppContainer size="md" paddingX="sm" paddingY="sm">
      <AppCard variant="outline" size="sm" radius="md">
        <AppStack gap="sm">
          <div>
            <h1 className="text-lg font-semibold">Jornada no válida</h1>
            <p className="text-sm text-muted-foreground">
              El identificador recibido no corresponde a una asistencia válida.
            </p>
          </div>

          <div>
            <AppButton asChild variant="outline" size="sm">
              <Link to={JOURNEYS_ROUTE}>Regresar a Jornadas</Link>
            </AppButton>
          </div>
        </AppStack>
      </AppCard>
    </AppContainer>
  );
}

export default function TrackingAttendanceDetailPage() {
  const { asistenciaId } = useParams<{ asistenciaId: string }>();
  const parsedId = Number(asistenciaId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <InvalidAttendanceId />;
  }

  return <DetailContent asistenciaId={parsedId} />;
}
