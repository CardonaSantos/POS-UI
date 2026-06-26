"use client";

import * as React from "react";
import { BarChart3, LineChart, MapPin } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { LineChartNivo } from "@/Crm/_charts/line-chart/LineChart";
import { BarChartNivo } from "@/Crm/_charts/bar-chart/BarChart";
import LocationsMaps from "./locations/locations-maps";

import type { ChartDataLineNivo } from "@/Crm/_charts/line-chart/LineChart.interfaces";
import type { NivoBarData } from "@/Crm/_charts/bar-chart/bar-chart.interface";
import type { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";

interface DashboardChartsGridProps {
  instalacionesMes: ChartDataLineNivo;
  instalacionesHistoricas: NivoBarData;
}

interface DashboardMapPanelProps {
  usuariosEnCampo: RealTimeLocationRaw[];
}

export function DashboardChartsGrid({
  instalacionesMes,
  instalacionesHistoricas,
}: DashboardChartsGridProps) {
  return (
    <section aria-label="Gráficas del dashboard" className="min-w-0">
      <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2">
        <DashboardChartCard
          title="Instalaciones vs desinstalaciones"
          icon={<LineChart className="h-3.5 w-3.5" />}
          badge="Mes"
        >
          <LineChartNivo
            data={instalacionesMes}
            height={190}
            axisBottomLabel="Día"
            axisLeftLabel="Clientes"
            stacked
          />
        </DashboardChartCard>

        <DashboardChartCard
          title="Instalaciones históricas"
          icon={<BarChart3 className="h-3.5 w-3.5" />}
          badge="Histórico"
        >
          <BarChartNivo
            data={instalacionesHistoricas}
            keys={["instalaciones"]}
            indexBy="label"
            axisLeftLabel="Clientes"
          />
        </DashboardChartCard>
      </div>
    </section>
  );
}

export function DashboardMapPanel({ usuariosEnCampo }: DashboardMapPanelProps) {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="lg"
      className="min-w-0 overflow-hidden"
      title={
        <AppInline gap="xs" align="center" className="min-w-0">
          <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--app-primary,var(--primary)))]" />
          <span className="truncate">Equipo en campo</span>
        </AppInline>
      }
      action={
        <AppBadge size="xs" tone="info" appearance="soft">
          {usuariosEnCampo.length} activos
        </AppBadge>
      }
    >
      <div className="h-[320px] min-w-0 overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] md:h-[380px] xl:h-[430px]">
        <MemoizedMap usuariosEnCampo={usuariosEnCampo} />
      </div>
    </AppCard>
  );
}

function DashboardChartCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="lg"
      className="min-w-0 overflow-hidden"
    >
      <AppStack gap="xs" className="min-w-0">
        <AppInline
          gap="xs"
          align="center"
          justify="between"
          className="min-w-0"
        >
          <AppInline gap="xs" align="center" className="min-w-0">
            <span className="text-[hsl(var(--app-primary,var(--primary)))]">
              {icon}
            </span>

            <h3 className="truncate text-[11px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
              {title}
            </h3>
          </AppInline>

          <AppBadge size="xs" tone="neutral" appearance="soft">
            {badge}
          </AppBadge>
        </AppInline>

        <div className="h-[205px] min-w-0 overflow-hidden">{children}</div>
      </AppStack>
    </AppCard>
  );
}

const MemoizedMap = React.memo(
  ({ usuariosEnCampo }: { usuariosEnCampo: RealTimeLocationRaw[] }) => (
    <LocationsMaps personas={usuariosEnCampo} />
  ),
  (prev, next) => {
    if (prev.usuariosEnCampo.length !== next.usuariosEnCampo.length) {
      return false;
    }

    return prev.usuariosEnCampo.every((prevUser, index) => {
      const nextUser = next.usuariosEnCampo[index];

      return (
        prevUser.latitud === nextUser.latitud &&
        prevUser.longitud === nextUser.longitud &&
        prevUser.usuarioId === nextUser.usuarioId
      );
    });
  },
);
