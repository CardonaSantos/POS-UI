"use client";

import * as React from "react";
import { Map, RefreshCw, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppAsyncAction } from "@/components/app/handlers";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { CRM } from "@/hooks/indexCalls";

import type { FindRutasAsignadasResult } from "./rutas-asignadas.type";
import {
  getRutasAsignadasInitialData,
  normalizeRutasAsignadas,
  RutaAsignadaRow,
} from "./rutas-asignadas.helpers";
import { RutasAsignadasTable } from "./rutas-asignadas-table";

function StatCard({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  isLoading?: boolean;
}) {
  return (
    <AppCard variant="outline" size="xs" className="px-3 py-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppInline align="center" gap="xs" className="min-w-0">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <span className="truncate text-[11px] font-medium leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </span>
        </AppInline>

        <span className="shrink-0 text-sm font-bold tabular-nums leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
          {isLoading ? <AppSkeleton className="h-4 w-10" /> : value}
        </span>
      </AppInline>
    </AppCard>
  );
}

export default function RutasAsignadasMain() {
  const navigate = useNavigate();
  const userID = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const { useApiQuery: useCrmQuery } = CRM;

  const rutasQuery = useCrmQuery<FindRutasAsignadasResult>(
    ["rutas-asignadas", userID],
    "ruta-cobro/rutas-cobros-asignadas",
    { params: { id: userID } },
    {
      initialData: getRutasAsignadasInitialData(),
      retry: 1,
    },
  );

  const refreshAction = useAppAsyncAction(
    async () => {
      await rutasQuery.refetch();
    },
    { preventConcurrent: true },
  );

  const rutasData = React.useMemo(
    () => normalizeRutasAsignadas(rutasQuery.data),
    [rutasQuery.data],
  );

  const rutas = rutasData.rutas;
  const totales = rutasData.totales;

  const handleStartRuta = React.useCallback(
    (ruta: RutaAsignadaRow) => {
      navigate(`/crm/cobros-en-ruta/${ruta.id}`);
    },
    [navigate],
  );

  const isInitialLoading = rutasQuery.isFetching && rutas.length === 0;

  return (
    <PageTransitionCrm
      titleHeader="Mis rutas de cobro"
      subtitle="Rutas asignadas al usuario actual"
      variant="fade-pure"
    >
      <AppStack gap="md">
        {rutasQuery.isError ? (
          <AppAlert
            tone="danger"
            size="sm"
            title="Error al cargar rutas"
            description={getApiErrorMessageAxios(rutasQuery.error)}
          />
        ) : null}

        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<RefreshCw size={13} />}
            loading={refreshAction.isLoading || rutasQuery.isFetching}
            loadingText="Actualizando..."
            onClick={() => refreshAction.run()}
          >
            Refrescar
          </AppButton>

          <AppGrid cols={{ base: 2 }} gap="xs" className="w-full sm:w-auto">
            <StatCard
              icon={<Map size={13} />}
              label="Rutas"
              value={totales.totalRutas}
              isLoading={isInitialLoading}
            />

            <StatCard
              icon={<User size={13} />}
              label="Clientes"
              value={totales.totalClientes}
              isLoading={isInitialLoading}
            />
          </AppGrid>
        </AppInline>

        <AppCard
          variant="outline"
          size="sm"
          title="Rutas asignadas"
          description={`${rutas.length} rutas disponibles para iniciar cobro`}
        >
          <RutasAsignadasTable
            rutas={rutas}
            isLoading={isInitialLoading}
            isFetching={rutasQuery.isFetching}
            onStart={handleStartRuta}
          />
        </AppCard>
      </AppStack>
    </PageTransitionCrm>
  );
}
