import { Link, useParams } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetPppoeCuentaDetalle } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import { PppoeCuentaDetailHeader } from "./pppoe-cuenta-detail-header";
import { PppoeCuentaDetailOverview } from "./pppoe-cuenta-detail-overview";
import { PppoeCuentaDetailActions } from "./pppoe-cuenta-detail-actions";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { PppoeCuentaOperacionesTab } from "./pppoe-cuenta-operaciones-tab";

type PppoeCuentaDetailContentProps = {
  cuentaPppoeId: number;
};

function PppoeCuentaDetailContent({
  cuentaPppoeId,
}: PppoeCuentaDetailContentProps) {
  const query = useGetPppoeCuentaDetalle(cuentaPppoeId);

  return (
    <PageTransitionCrm
      titleHeader={`Cuenta PPPoE #${cuentaPppoeId}`}
      variant="fade-pure"
    >
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          isEmpty={!query.data}
          onRetry={() => query.refetch()}
          loadingVariant="skeleton-grid"
          emptyTitle="Cuenta PPPoE no encontrada"
          emptyDescription="No existe una cuenta PPPoE accesible con este identificador."
          variant="plain"
          size="sm"
          minHeight="lg"
        >
          {query.data ? (
            <AppStack gap="md">
              {query.data ? (
                <AppStack gap="md">
                  <PppoeCuentaDetailActions
                    cuenta={query.data}
                    onDataChanged={async () => {
                      await query.refetch();
                    }}
                  />
                  <AppSeparator />
                  <PppoeCuentaDetailOverview cuenta={query.data} />

                  <PppoeCuentaOperacionesTab
                    cuentaPppoeId={query.data.cuentaPppoeId}
                  />
                </AppStack>
              ) : null}
            </AppStack>
          ) : null}
        </AppDataState>
      </AppContainer>
    </PageTransitionCrm>
  );
}

function InvalidPppoeCuentaId() {
  return (
    <AppContainer size="md" paddingX="sm" paddingY="sm">
      <AppCard variant="outline" size="sm" radius="md">
        <AppStack gap="sm">
          <div>
            <h1 className="text-lg font-semibold">Cuenta PPPoE no válida</h1>

            <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
              El identificador recibido no corresponde a una cuenta PPPoE
              válida.
            </p>
          </div>

          <div>
            <AppButton asChild variant="outline" size="sm">
              <Link to="/crm/pppoe/cuentas">Regresar al listado</Link>
            </AppButton>
          </div>
        </AppStack>
      </AppCard>
    </AppContainer>
  );
}

export default function PppoeCuentaDetailPage() {
  const { cuentaPppoeId } = useParams<{
    cuentaPppoeId: string;
  }>();

  const parsedId = Number(cuentaPppoeId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <InvalidPppoeCuentaId />;
  }

  return <PppoeCuentaDetailContent cuentaPppoeId={parsedId} />;
}
