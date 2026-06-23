"use client";
import { BarChart3, RefreshCw } from "lucide-react";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { MetricChartsProps } from "./types";
import TicketsEnProcesoCard from "./TicketsEnProcesoTable";
import { useMetricasRendimiento } from "./use-metricas-rendimiento";
import { MetricasKpiGrid } from "./metricas-kpi-grid";
import { TicketsResueltosChart } from "./tickets-resueltos-chart";

export default function Metricas({
  loading: externalLoading = false,
}: MetricChartsProps) {
  const vm = useMetricasRendimiento({ externalLoading });

  const hasAnyData =
    vm.state.dataScale.length > 0 ||
    vm.state.metrics.length > 0 ||
    Boolean(vm.state.ticketsActuales);

  return (
    <AppStack gap="md">
      <AppCard
        variant="outline"
        size="sm"
        title="Métricas de rendimiento"
        description="Análisis de tickets, avance operativo y resoluciones por técnico."
        action={
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={
              <RefreshCw
                size={13}
                className={vm.isLoading ? "animate-spin" : undefined}
              />
            }
            onClick={vm.reload}
            disabled={vm.isLoading}
          >
            Actualizar
          </AppButton>
        }
      >
        <AppStack gap="md">
          {vm.state.error && !vm.isLoading ? (
            <AppAlert
              tone="danger"
              title="No se pudieron cargar las métricas"
              description={vm.state.error}
              action={
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  onClick={vm.reload}
                >
                  Reintentar
                </AppButton>
              }
            />
          ) : null}

          <MetricasKpiGrid
            ticketsActuales={vm.state.ticketsActuales}
            resueltosDelMes={vm.state.resueltosDelMes}
          />

          <TicketsResueltosChart
            data={vm.state.dataScale}
            isLoading={vm.isLoading}
          />

          {!vm.isLoading && !vm.state.error && !hasAnyData ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<BarChart3 size={36} strokeWidth={1.5} />}
              title="No hay datos disponibles"
              description="No se encontraron métricas para mostrar en este período."
              action={
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  onClick={vm.reload}
                >
                  Cargar datos
                </AppButton>
              }
              className="py-8"
            />
          ) : null}
        </AppStack>
      </AppCard>

      <TicketsEnProcesoCard data={vm.state.ticketsEnProceso} />
    </AppStack>
  );
}
