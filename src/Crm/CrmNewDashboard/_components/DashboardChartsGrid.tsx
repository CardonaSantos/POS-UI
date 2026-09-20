"use client";

import * as React from "react";

import { BarChart3, CalendarDays, History } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { BarChartNivo } from "@/Crm/_charts/bar-chart/BarChart";

import type { NivoBarData } from "@/Crm/_charts/bar-chart/bar-chart.interface";

import type {
  DashboardActividadHistorica,
  DashboardActividadMes,
} from "@/Crm/features/chart-types/chart-interfaces";

interface DashboardChartsGridProps {
  instalacionesMes?: DashboardActividadMes;
  instalacionesHistoricas?: DashboardActividadHistorica;

  isMesLoading: boolean;
  isHistoricoLoading: boolean;
}

export function DashboardChartsGrid({
  instalacionesMes,
  instalacionesHistoricas,
  isMesLoading,
  isHistoricoLoading,
}: DashboardChartsGridProps) {
  /**
   * ============================================================
   * ACTIVIDAD DEL MES
   * ============================================================
   *
   * API:
   * {
   *   fecha: "2026-09-17",
   *   instalaciones: 3,
   *   desinstalaciones: 1
   * }
   *
   * Nivo:
   * {
   *   label: "17",
   *   Instalaciones: 3,
   *   Desinstalaciones: 1
   * }
   */
  const actividadMesData = React.useMemo<NivoBarData>(() => {
    if (!instalacionesMes) {
      return [];
    }

    return instalacionesMes.actividadDiaria.map((item) => ({
      label: formatDayLabel(item.fecha),

      Instalaciones: item.instalaciones,
      Desinstalaciones: item.desinstalaciones,
    }));
  }, [instalacionesMes]);

  /**
   * ============================================================
   * ACTIVIDAD HISTÓRICA
   * ============================================================
   *
   * API:
   * {
   *   mes: "2026-09",
   *   instalaciones: 8,
   *   desinstalaciones: 2
   * }
   *
   * Nivo:
   * {
   *   label: "Sep 26",
   *   Instalaciones: 8,
   *   Desinstalaciones: 2
   * }
   */
  const actividadHistoricaData = React.useMemo<NivoBarData>(() => {
    if (!instalacionesHistoricas) {
      return [];
    }

    return instalacionesHistoricas.actividadMensual.map((item) => ({
      label: formatMonthLabel(item.mes),

      Instalaciones: item.instalaciones,
      Desinstalaciones: item.desinstalaciones,
    }));
  }, [instalacionesHistoricas]);

  /**
   * Determinamos si realmente hubo actividad.
   *
   * No basta con revisar .length porque el servidor siempre
   * devuelve todos los días/meses, incluso cuando tienen 0.
   */
  const hasActividadMes = React.useMemo(
    () =>
      actividadMesData.some(
        (item) =>
          Number(item.Instalaciones ?? 0) > 0 ||
          Number(item.Desinstalaciones ?? 0) > 0,
      ),
    [actividadMesData],
  );

  const hasActividadHistorica = React.useMemo(
    () =>
      actividadHistoricaData.some(
        (item) =>
          Number(item.Instalaciones ?? 0) > 0 ||
          Number(item.Desinstalaciones ?? 0) > 0,
      ),
    [actividadHistoricaData],
  );

  /**
   * Badge dinámico del mes actual.
   *
   * Ejemplo:
   * Sep 2026
   */
  const mesActualLabel = instalacionesMes
    ? formatMonthYearLabel(instalacionesMes.periodo.hasta)
    : "Mes actual";

  const mesesHistoricos = instalacionesHistoricas?.periodo.meses ?? 12;

  return (
    <section
      aria-label="Gráficas de instalaciones y desinstalaciones"
      className="min-w-0"
    >
      {/*
       * Una sola columna deliberadamente.
       *
       * El gráfico diario puede tener hasta 31 grupos,
       * por lo que volver a dividirlo en dos columnas
       * reduciría demasiado su legibilidad.
       */}
      <div className="grid min-w-0 grid-cols-1 gap-3">
        {/*
         * ======================================================
         * ACTIVIDAD DEL MES
         * ======================================================
         */}
        <DashboardChartCard
          title="Actividad del mes"
          description="Instalaciones y desinstalaciones completadas por día"
          icon={<CalendarDays className="h-4 w-4" />}
          badge={mesActualLabel}
        >
          {isMesLoading ? (
            <DashboardChartSkeleton heightClassName="h-[320px] lg:h-[360px]" />
          ) : !instalacionesMes ? (
            <DashboardChartUnavailable />
          ) : (
            <AppStack gap="sm" className="min-w-0">
              <DashboardChartMetrics
                instalaciones={instalacionesMes.totales.instalaciones}
                desinstalaciones={instalacionesMes.totales.desinstalaciones}
              />

              {hasActividadMes ? (
                <div className="min-w-0">
                  <BarChartNivo
                    data={actividadMesData}
                    keys={["Instalaciones", "Desinstalaciones"]}
                    indexBy="label"
                    height={200}
                    groupMode="grouped"
                    axisBottomLabel="Día"
                    axisLeftLabel="Cantidad"
                    tickRotation={0}
                    padding={0.38}
                    innerPadding={3}
                    enableLabel={false}
                    showLegend
                    ariaLabel="Instalaciones y desinstalaciones completadas por día"
                  />
                </div>
              ) : (
                <DashboardChartEmptyState
                  title="Sin actividad este mes"
                  description="Todavía no hay instalaciones ni desinstalaciones completadas durante el período."
                  heightClassName="h-[280px] lg:h-[320px]"
                />
              )}
            </AppStack>
          )}
        </DashboardChartCard>

        {/*
         * ======================================================
         * ACTIVIDAD ÚLTIMOS 12 MESES
         * ======================================================
         */}
        <DashboardChartCard
          title="Actividad últimos 12 meses"
          description="Comparativa mensual de instalaciones y desinstalaciones completadas"
          icon={<History className="h-4 w-4" />}
          badge={`${mesesHistoricos} meses`}
        >
          {isHistoricoLoading ? (
            <DashboardChartSkeleton heightClassName="h-[300px] lg:h-[340px]" />
          ) : !instalacionesHistoricas ? (
            <DashboardChartUnavailable />
          ) : (
            <AppStack gap="sm" className="min-w-0">
              <DashboardChartMetrics
                instalaciones={instalacionesHistoricas.totales.instalaciones}
                desinstalaciones={
                  instalacionesHistoricas.totales.desinstalaciones
                }
                instalacionesHint={`Prom. ${formatAverage(
                  instalacionesHistoricas.totales.promedioInstalacionesMes,
                )}/mes`}
                desinstalacionesHint={`Prom. ${formatAverage(
                  instalacionesHistoricas.totales.promedioDesinstalacionesMes,
                )}/mes`}
              />

              {hasActividadHistorica ? (
                <div className="min-w-0">
                  <BarChartNivo
                    data={actividadHistoricaData}
                    keys={["Instalaciones", "Desinstalaciones"]}
                    indexBy="label"
                    height={200}
                    groupMode="grouped"
                    axisBottomLabel="Mes"
                    axisLeftLabel="Cantidad"
                    tickRotation={0}
                    padding={0.32}
                    innerPadding={3}
                    enableLabel={false}
                    showLegend
                    ariaLabel="Instalaciones y desinstalaciones completadas durante los últimos 12 meses"
                  />
                </div>
              ) : (
                <DashboardChartEmptyState
                  title="Sin actividad histórica"
                  description="No hay instalaciones ni desinstalaciones completadas en los últimos 12 meses."
                  heightClassName="h-[260px] lg:h-[300px]"
                />
              )}
            </AppStack>
          )}
        </DashboardChartCard>
      </div>
    </section>
  );
}

/**
 * ============================================================
 * CARD DEL CHART
 * ============================================================
 *
 * Utiliza el header nativo de AppCard para mantener
 * la misma estructura visual que el resto del dashboard.
 */
function DashboardChartCard({
  title,
  description,
  icon,
  badge,
  children,
}: {
  title: string;
  description: string;
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
      title={
        <AppInline gap="xs" align="center" className="min-w-0">
          <span className="shrink-0 text-[hsl(var(--app-primary,var(--primary)))]">
            {icon}
          </span>

          <span className="truncate text-xs font-semibold">{title}</span>
        </AppInline>
      }
      description={description}
      action={
        <AppBadge size="xs" tone="neutral" appearance="soft">
          {badge}
        </AppBadge>
      }
    >
      <div className="min-w-0">{children}</div>
    </AppCard>
  );
}

/**
 * ============================================================
 * MÉTRICAS DEL CHART
 * ============================================================
 *
 * No son Cards dentro de Cards.
 *
 * Son indicadores ligeros para contextualizar rápidamente
 * el gráfico.
 */
function DashboardChartMetrics({
  instalaciones,
  desinstalaciones,
  instalacionesHint,
  desinstalacionesHint,
}: {
  instalaciones: number;
  desinstalaciones: number;

  instalacionesHint?: string;
  desinstalacionesHint?: string;
}) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 sm:max-w-lg">
      <DashboardChartMetric
        label="Instalaciones"
        value={instalaciones}
        hint={instalacionesHint}
      />

      <DashboardChartMetric
        label="Desinstalaciones"
        value={desinstalaciones}
        hint={desinstalacionesHint}
      />
    </div>
  );
}

function DashboardChartMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))]/15 px-2 py-1.5">
      <AppInline gap="xs" align="center" className="mt-0.5 min-w-0">
        <div className="truncate text-[8px] font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </div>

        <span className="text-xs font-semibold tabular-nums leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
          {value}
        </span>

        {hint ? (
          <span className="truncate text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {hint}
          </span>
        ) : null}
      </AppInline>
    </div>
  );
}

/**
 * ============================================================
 * LOADING
 * ============================================================
 */
function DashboardChartSkeleton({
  heightClassName,
}: {
  heightClassName: string;
}) {
  return (
    <div className="min-w-0 animate-pulse" aria-hidden="true">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:max-w-lg">
        <div className="h-[58px] rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))]/50" />

        <div className="h-[58px] rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))]/50" />
      </div>

      <div
        className={[
          "min-w-0 rounded-[var(--app-radius-md)]",
          "bg-[hsl(var(--app-muted,var(--muted)))]/35",
          heightClassName,
        ].join(" ")}
      />
    </div>
  );
}

/**
 * ============================================================
 * ESTADO VACÍO
 * ============================================================
 */
function DashboardChartEmptyState({
  title,
  description,
  heightClassName,
}: {
  title: string;
  description: string;
  heightClassName: string;
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-center justify-center",
        "rounded-[var(--app-radius-md)]",
        "border border-dashed border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted)))]/10",
        heightClassName,
      ].join(" ")}
    >
      <AppStack gap="xs" align="center" className="max-w-md px-5 text-center">
        <BarChart3 className="h-5 w-5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

        <p className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          {title}
        </p>

        <p className="text-[11px] leading-relaxed text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {description}
        </p>
      </AppStack>
    </div>
  );
}

/**
 * ============================================================
 * NO DISPONIBLE
 * ============================================================
 *
 * Si loading terminó pero data sigue siendo undefined,
 * normalmente significa que la consulta falló.
 *
 * El warning global del dashboard ya avisará que algunos
 * recursos no pudieron actualizarse.
 */
function DashboardChartUnavailable() {
  return (
    <div className="flex h-[240px] min-w-0 items-center justify-center rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))]">
      <AppStack gap="xs" align="center" className="max-w-sm px-4 text-center">
        <BarChart3 className="h-5 w-5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

        <p className="text-xs font-semibold">Gráfica no disponible</p>

        <p className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          No fue posible obtener la información para esta gráfica.
        </p>
      </AppStack>
    </div>
  );
}

/**
 * ============================================================
 * FORMATTERS
 * ============================================================
 */

const MONTHS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

/**
 * 2026-09-17 -> 17
 */
function formatDayLabel(date: string) {
  const parts = date.split("-");

  const day = Number(parts[2]);

  if (!Number.isFinite(day)) {
    return date;
  }

  return String(day).padStart(2, "0");
}

/**
 * 2026-09 -> Sep 26
 */
function formatMonthLabel(value: string) {
  const [yearString, monthString] = value.split("-");

  const year = Number(yearString);
  const month = Number(monthString);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    month < 1 ||
    month > 12
  ) {
    return value;
  }

  return `${MONTHS_SHORT[month - 1]} ${String(year).slice(-2)}`;
}

/**
 * 2026-09-17 -> Sep 2026
 */
function formatMonthYearLabel(value: string) {
  const [yearString, monthString] = value.split("-");

  const year = Number(yearString);
  const month = Number(monthString);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    month < 1 ||
    month > 12
  ) {
    return "Mes actual";
  }

  return `${MONTHS_SHORT[month - 1]} ${year}`;
}

function formatAverage(value: number) {
  return new Intl.NumberFormat("es-GT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
