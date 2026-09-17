"use client";

import * as React from "react";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Inbox,
  Minus,
  RefreshCw,
} from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";

import type {
  DashboardTicketsActividad,
  DashboardTicketsActividadParams,
  DashboardTicketsActividadPreset,
  DashboardTicketsGranularidad,
} from "@/Crm/features/chart-types/tickets-chart";

/* ============================================================
 * TYPES
 * ============================================================ */

type DashboardTicketsView = "FLUJO" | "PRIORIDAD";

type PriorityDataset = "CREADOS" | "RESUELTOS";

interface DashboardTicketsActivityProps {
  data?: DashboardTicketsActividad;

  params: DashboardTicketsActividadParams;

  isLoading: boolean;
  isFetching?: boolean;

  onPresetChange: (preset: DashboardTicketsActividadPreset) => void;

  customRangeControl?: React.ReactNode;
}

type SupportFlowPoint = {
  id: string;

  seriesId: string | number;
  seriesColor: string;

  data: {
    x: string | number;
    y: number;
    yFormatted: string;
  };
};

/* ============================================================
 * PRESETS
 * ============================================================ */

const PRESETS: Array<{
  value: DashboardTicketsActividadPreset;
  label: string;
}> = [
  {
    value: "7D",
    label: "7D",
  },
  {
    value: "30D",
    label: "30D",
  },
  {
    value: "12M",
    label: "12M",
  },
  {
    value: "HISTORICO",
    label: "Todo",
  },
];

/* ============================================================
 * COLORS
 * ============================================================
 *
 * Los colores ahora respetan nuestros tokens.
 *
 * Si un token semántico no existe todavía,
 * usamos un fallback HSL.
 * ============================================================ */

const FLOW_COLORS = [
  "hsl(var(--app-success, 160 84% 39%))",
  "hsl(var(--app-primary, var(--primary)))",
];

const PRIORITY_COLORS: Record<"BAJA" | "MEDIA" | "ALTA" | "URGENTE", string> = {
  BAJA: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",

  MEDIA: "hsl(var(--app-info, 217 91% 60%))",

  ALTA: "hsl(var(--app-warning, 38 92% 50%))",

  URGENTE: "hsl(var(--app-danger,var(--destructive)))",
};

const PRIORITY_KEYS = ["BAJA", "MEDIA", "ALTA", "URGENTE"] as const;

/* ============================================================
 * NIVO THEME
 * ============================================================ */

const NIVO_THEME = {
  text: {
    fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
    fontSize: 10,
  },

  axis: {
    domain: {
      line: {
        stroke: "hsl(var(--app-border,var(--border)))",
        strokeWidth: 1,
      },
    },

    ticks: {
      line: {
        stroke: "hsl(var(--app-border,var(--border)))",
      },

      text: {
        fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
        fontSize: 9,
      },
    },
  },

  grid: {
    line: {
      stroke: "hsl(var(--app-border,var(--border)))",
      strokeWidth: 1,
      strokeOpacity: 0.45,
    },
  },

  tooltip: {
    container: {
      background: "hsl(var(--app-popover,var(--popover)))",

      color: "hsl(var(--app-popover-foreground,var(--popover-foreground)))",

      border: "1px solid hsl(var(--app-border,var(--border)))",

      borderRadius: 8,

      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",

      fontSize: 11,

      padding: "8px 10px",
    },
  },
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export function DashboardTicketsActivity({
  data,
  params,
  isLoading,
  isFetching = false,
  onPresetChange,
  customRangeControl,
}: DashboardTicketsActivityProps) {
  const [view, setView] = React.useState<DashboardTicketsView>("FLUJO");

  const [priorityDataset, setPriorityDataset] =
    React.useState<PriorityDataset>("CREADOS");

  /* ==========================================================
   * FLOW DATA
   * ========================================================== */

  const flowData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        id: "Creados",

        data: data.actividad.map((item) => ({
          x: item.periodo,
          y: item.creados,
        })),
      },

      {
        id: "Resueltos",

        data: data.actividad.map((item) => ({
          x: item.periodo,
          y: item.resueltos,
        })),
      },
    ];
  }, [data]);

  /* ==========================================================
   * PRIORITY DATA
   * ========================================================== */

  const priorityData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data.actividad.map((item) => {
      const values =
        priorityDataset === "CREADOS"
          ? item.prioridades.creados
          : item.prioridades.resueltos;

      return {
        periodo: item.periodo,

        BAJA: values.BAJA,

        MEDIA: values.MEDIA,

        ALTA: values.ALTA,

        URGENTE: values.URGENTE,
      };
    });
  }, [data, priorityDataset]);

  /* ==========================================================
   * TICKS
   * ========================================================== */

  const tickValues = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return getVisibleTicks(data.actividad.map((item) => item.periodo));
  }, [data]);

  /* ==========================================================
   * CHART KEY
   * ==========================================================
   *
   * Muy importante.
   *
   * Cuando pasamos:
   *
   * 12M -> 7D
   * 7D  -> 30D
   * etc.
   *
   * el dominio X cambia completamente.
   *
   * Forzamos un remount de Nivo al llegar el nuevo response
   * para evitar que intente interpolar categorías antiguas
   * contra categorías nuevas.
   * ========================================================== */

  const chartKey = React.useMemo(
    () =>
      [
        data?.periodo.preset,
        data?.periodo.granularidad,
        data?.periodo.desde,
        data?.periodo.hasta,
      ].join(":"),
    [
      data?.periodo.preset,
      data?.periodo.granularidad,
      data?.periodo.desde,
      data?.periodo.hasta,
    ],
  );

  /* ==========================================================
   * ACTIVITY STATES
   * ========================================================== */

  const hasFlowActivity =
    data?.actividad.some((item) => item.creados > 0 || item.resueltos > 0) ??
    false;

  const hasPriorityActivity = priorityData.some(
    (item) =>
      Number(item.BAJA) > 0 ||
      Number(item.MEDIA) > 0 ||
      Number(item.ALTA) > 0 ||
      Number(item.URGENTE) > 0,
  );

  /* ==========================================================
   * LOADING / ERROR
   * ========================================================== */

  if (isLoading && !data) {
    return <DashboardTicketsActivitySkeleton />;
  }

  if (!data) {
    return <DashboardTicketsActivityUnavailable />;
  }

  /* ==========================================================
   * METRICS
   * ========================================================== */

  const supportMetrics = [
    {
      label: "Creados",

      value: data.resumen.creados,

      comparison: data.comparativa?.creados.variacionPorcentaje,
    },

    {
      label: "Resueltos",

      value: data.resumen.resueltos,

      comparison: data.comparativa?.resueltos.variacionPorcentaje,
    },

    {
      label: "Pendientes",

      value: data.resumen.pendientesActuales,

      hint:
        data.resumen.pendientesMas48Horas > 0
          ? `${data.resumen.pendientesMas48Horas} >48h`
          : "Sin atraso",
    },

    {
      label: "Urgentes",

      value: data.resumen.urgentesPendientes,

      hint: `${data.resumen.altosPendientes} altos`,

      tone:
        data.resumen.urgentesPendientes > 0
          ? ("danger" as const)
          : ("default" as const),
    },
  ];

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="lg"
      className="h-full min-h-[250px] min-w-0 overflow-hidden p-2"
    >
      <div className="flex h-full min-h-0 flex-col gap-2">
        {/* ====================================================
         * HEADER
         * ==================================================== */}

        <div className="flex shrink-0 flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                Actividad de soporte
              </h3>

              {isFetching ? (
                <RefreshCw className="h-3 w-3 shrink-0 animate-spin text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />
              ) : null}
            </div>

            <div className="mt-0.5 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {formatRange(data.periodo.desde, data.periodo.hasta)}

              {" · "}

              {formatGranularity(data.periodo.granularidad)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1">
            <SegmentedControl
              value={view}
              options={[
                {
                  value: "FLUJO",
                  label: "Flujo",
                },
                {
                  value: "PRIORIDAD",
                  label: "Prioridad",
                },
              ]}
              onChange={(value) => setView(value as DashboardTicketsView)}
            />

            <div className="flex items-center rounded-md border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))]/20 p-0.5">
              {PRESETS.map((preset) => {
                const active = params.preset === preset.value;

                return (
                  <button
                    key={preset.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onPresetChange(preset.value)}
                    className={[
                      "h-6 rounded px-2 text-[9px] font-semibold transition-colors",

                      active
                        ? [
                            "bg-[hsl(var(--app-primary,var(--primary)))]",
                            "text-[hsl(var(--app-primary-foreground,var(--primary-foreground)))]",
                          ].join(" ")
                        : [
                            "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                            "hover:bg-[hsl(var(--app-muted,var(--muted)))]/70",
                            "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {preset.label}
                  </button>
                );
              })}

              {params.preset === "CUSTOM" ? (
                <span className="px-2 text-[9px] font-semibold text-[hsl(var(--app-primary,var(--primary)))]">
                  Rango
                </span>
              ) : null}
            </div>

            {customRangeControl}
          </div>
        </div>

        {/* ====================================================
         * METRICS
         * ==================================================== */}

        <div className="grid shrink-0 grid-cols-4 gap-1">
          {supportMetrics.map((metric) => (
            <SupportMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              comparison={metric.comparison}
              hint={metric.hint}
              tone={metric.tone}
            />
          ))}
        </div>

        {/* ====================================================
         * SECONDARY INFORMATION
         * ==================================================== */}

        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-[hsl(var(--app-border,var(--border)))] pb-1.5 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            Resolución promedio:
            <strong className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formatMinutes(data.tiempos.promedioResolucionMinutos)}
            </strong>
          </span>

          <span className="inline-flex items-center gap-1">
            Primera atención:
            <strong className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formatMinutes(data.tiempos.promedioPrimeraAtencionMinutos)}
            </strong>
          </span>

          {data.comparativa ? (
            <span className="ml-auto hidden text-[8px] lg:inline">
              Comparado con{" "}
              {formatRange(
                data.comparativa.periodoAnterior.desde,

                data.comparativa.periodoAnterior.hasta,
              )}
            </span>
          ) : null}
        </div>

        {/* ====================================================
         * CHART HEADER
         * ==================================================== */}

        <div className="flex shrink-0 items-center justify-between gap-2">
          {view === "FLUJO" ? (
            <ChartLegend
              items={[
                {
                  label: "Creados",
                  color: FLOW_COLORS[0],
                },

                {
                  label: "Resueltos",
                  color: FLOW_COLORS[1],
                },
              ]}
            />
          ) : (
            <>
              <ChartLegend
                items={[
                  {
                    label: "Baja",
                    color: PRIORITY_COLORS.BAJA,
                  },

                  {
                    label: "Media",
                    color: PRIORITY_COLORS.MEDIA,
                  },

                  {
                    label: "Alta",
                    color: PRIORITY_COLORS.ALTA,
                  },

                  {
                    label: "Urgente",
                    color: PRIORITY_COLORS.URGENTE,
                  },
                ]}
              />

              <SegmentedControl
                value={priorityDataset}
                options={[
                  {
                    value: "CREADOS",
                    label: "Creados",
                  },

                  {
                    value: "RESUELTOS",
                    label: "Resueltos",
                  },
                ]}
                onChange={(value) =>
                  setPriorityDataset(value as PriorityDataset)
                }
              />
            </>
          )}
        </div>

        {/* ====================================================
         * CHART
         * ==================================================== */}

        <div className="relative min-h-[115px] min-w-0 flex-1">
          {view === "FLUJO" ? (
            hasFlowActivity ? (
              <ResponsiveLine
                key={`flow:${chartKey}`}
                data={flowData}
                margin={{
                  top: 6,
                  right: 10,
                  bottom: 32,
                  left: 34,
                }}
                xScale={{
                  type: "point",
                }}
                yScale={{
                  type: "linear",
                  min: 0,
                  max: "auto",
                  stacked: false,
                }}
                colors={FLOW_COLORS}
                theme={NIVO_THEME}
                curve="monotoneX"
                lineWidth={2}
                animate
                motionConfig="gentle"
                enableGridX={false}
                enableGridY
                pointSize={5}
                pointColor={{
                  from: "seriesColor",
                }}
                pointBorderWidth={1}
                pointBorderColor={{
                  from: "seriesColor",
                }}
                useMesh
                enableSlices="x"
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 6,
                  tickRotation: 0,
                  tickValues,

                  format: (value) =>
                    formatPeriodLabel(String(value), data.periodo.granularidad),
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 5,
                  tickValues: 4,

                  format: (value) =>
                    Number.isInteger(Number(value)) ? String(value) : "",
                }}
                legends={[]}
                sliceTooltip={({ slice }) => (
                  <SupportFlowTooltip
                    period={String(slice.points[0]?.data.x ?? "")}
                    granularity={data.periodo.granularidad}
                    points={slice.points}
                  />
                )}
              />
            ) : (
              <SupportChartEmpty />
            )
          ) : hasPriorityActivity ? (
            <ResponsiveBar
              key={`priority:${priorityDataset}:${chartKey}`}
              data={priorityData}
              keys={[...PRIORITY_KEYS]}
              indexBy="periodo"
              groupMode="stacked"
              margin={{
                top: 6,
                right: 10,
                bottom: 32,
                left: 34,
              }}
              padding={0.34}
              innerPadding={1}
              valueScale={{
                type: "linear",
                min: 0,
                max: "auto",
              }}
              indexScale={{
                type: "band",
                round: true,
              }}
              colors={({ id }) =>
                PRIORITY_COLORS[String(id) as keyof typeof PRIORITY_COLORS] ??
                "hsl(var(--app-muted-foreground,var(--muted-foreground)))"
              }
              theme={NIVO_THEME}
              borderRadius={2}
              borderWidth={0}
              animate
              motionConfig="gentle"
              enableGridX={false}
              enableGridY
              enableLabel={false}
              axisBottom={{
                tickSize: 0,
                tickPadding: 6,
                tickRotation: 0,
                tickValues,

                format: (value) =>
                  formatPeriodLabel(String(value), data.periodo.granularidad),
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 5,
                tickValues: 4,

                format: (value) =>
                  Number.isInteger(Number(value)) ? String(value) : "",
              }}
              legends={[]}
              tooltip={({ id, value, color, indexValue }) => (
                <SupportPriorityTooltip
                  priority={String(id)}
                  value={value}
                  color={color}
                  period={String(indexValue)}
                  granularity={data.periodo.granularidad}
                  dataset={priorityDataset}
                />
              )}
              role="application"
              ariaLabel={`Tickets ${
                priorityDataset === "CREADOS" ? "creados" : "resueltos"
              } por prioridad`}
            />
          ) : (
            <SupportChartEmpty />
          )}

          {isFetching && data ? (
            <div className="pointer-events-none absolute inset-0 bg-[hsl(var(--app-background,var(--background)))]/5" />
          ) : null}
        </div>
      </div>
    </AppCard>
  );
}

/* ============================================================
 * METRIC
 * ============================================================ */

function SupportMetric({
  label,
  value,
  comparison,
  hint,
  tone = "default",
}: {
  label: string;
  value: number;

  comparison?: number | null;

  hint?: string;

  tone?: "default" | "danger";
}) {
  return (
    <div
      className={[
        "min-w-0 rounded-md border px-2 py-1",

        tone === "danger"
          ? [
              "border-[hsl(var(--app-danger,var(--destructive)))]/25",
              "bg-[hsl(var(--app-danger,var(--destructive)))]/5",
            ].join(" ")
          : [
              "border-[hsl(var(--app-border,var(--border)))]",
              "bg-[hsl(var(--app-muted,var(--muted)))]/15",
            ].join(" "),
      ].join(" ")}
    >
      <div className="mt-0.5 flex min-w-0 items-center gap-1">
        <div className="truncate text-[7px] font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </div>

        <span
          className={[
            "text-[10px] font-semibold tabular-nums leading-none",

            tone === "danger"
              ? "text-[hsl(var(--app-danger,var(--destructive)))]"
              : "text-[hsl(var(--app-foreground,var(--foreground)))]",
          ].join(" ")}
        >
          {value}
        </span>

        {comparison !== undefined ? (
          <ComparisonValue value={comparison} />
        ) : hint ? (
          <span className="truncate text-[7px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================
 * COMPARISON
 * ============================================================ */

function ComparisonValue({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="truncate text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        sin base
      </span>
    );
  }

  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        <Minus className="h-2.5 w-2.5" />
        0%
      </span>
    );
  }

  const up = value > 0;

  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
      {up ? (
        <ArrowUpRight className="h-2.5 w-2.5" />
      ) : (
        <ArrowDownRight className="h-2.5 w-2.5" />
      )}
      {Math.abs(value).toLocaleString("es-GT", {
        maximumFractionDigits: 1,
      })}
      %
    </span>
  );
}

/* ============================================================
 * SEGMENTED CONTROL
 * ============================================================ */

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;

  options: Array<{
    value: string;
    label: string;
  }>;

  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center rounded-md border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))]/15 p-0.5">
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={[
              "h-6 rounded px-2 text-[9px] font-medium transition-colors",

              active
                ? [
                    "bg-[hsl(var(--app-background,var(--background)))]",
                    "text-[hsl(var(--app-foreground,var(--foreground)))]",
                    "shadow-sm",
                  ].join(" ")
                : [
                    "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                    "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
                  ].join(" "),
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * LEGEND
 * ============================================================ */

function ChartLegend({
  items,
}: {
  items: Array<{
    label: string;
    color: string;
  }>;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />

          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
 * FLOW TOOLTIP
 * ============================================================ */

function SupportFlowTooltip({
  period,
  granularity,
  points,
}: {
  period: string;

  granularity: DashboardTicketsGranularidad;

  points: readonly SupportFlowPoint[];
}) {
  return (
    <div className="min-w-[150px] rounded-lg border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-popover,var(--popover)))] p-2.5 shadow-xl">
      <div className="mb-2 border-b border-[hsl(var(--app-border,var(--border)))] pb-1.5 text-[9px] font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
        {formatPeriodLong(period, granularity)}
      </div>

      <div className="space-y-1.5">
        {points.map((point) => (
          <div
            key={point.id}
            className="flex items-center justify-between gap-5"
          >
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: point.seriesColor,
                }}
              />

              <span className="truncate">{String(point.seriesId)}</span>
            </span>

            <strong className="shrink-0 text-[10px] font-semibold tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
              {point.data.yFormatted}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * PRIORITY TOOLTIP
 * ============================================================ */

function SupportPriorityTooltip({
  priority,
  value,
  color,
  period,
  granularity,
  dataset,
}: {
  priority: string;

  value: number;

  color: string;

  period: string;

  granularity: DashboardTicketsGranularidad;

  dataset: PriorityDataset;
}) {
  return (
    <div className="min-w-[135px] rounded-lg border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-popover,var(--popover)))] p-2 shadow-xl">
      <div className="mb-1.5 text-[9px] font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
        {formatPeriodLong(period, granularity)}
      </div>

      <div className="flex items-center justify-between gap-4 text-[9px]">
        <span className="inline-flex items-center gap-1.5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />

          {formatPriority(priority)}
        </span>

        <strong className="tabular-nums">{value}</strong>
      </div>

      <div className="mt-1.5 border-t border-[hsl(var(--app-border,var(--border)))] pt-1 text-[8px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        Tickets {dataset === "CREADOS" ? "creados" : "resueltos"}
      </div>
    </div>
  );
}

/* ============================================================
 * EMPTY
 * ============================================================ */

function SupportChartEmpty() {
  return (
    <div className="flex h-full min-h-[110px] items-center justify-center rounded-md border border-dashed border-[hsl(var(--app-border,var(--border)))]">
      <div className="text-center">
        <Inbox className="mx-auto mb-1 h-4 w-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

        <p className="text-[9px] font-medium">Sin actividad en este período</p>
      </div>
    </div>
  );
}

/* ============================================================
 * SKELETON
 * ============================================================ */

function DashboardTicketsActivitySkeleton() {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="lg"
      className="h-full min-h-[250px] animate-pulse"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex justify-between">
          <div className="h-7 w-36 rounded bg-[hsl(var(--app-muted,var(--muted)))]/50" />

          <div className="h-7 w-48 rounded bg-[hsl(var(--app-muted,var(--muted)))]/40" />
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-10 rounded-md bg-[hsl(var(--app-muted,var(--muted)))]/40"
            />
          ))}
        </div>

        <div className="min-h-[110px] flex-1 rounded-md bg-[hsl(var(--app-muted,var(--muted)))]/30" />
      </div>
    </AppCard>
  );
}

/* ============================================================
 * UNAVAILABLE
 * ============================================================ */

function DashboardTicketsActivityUnavailable() {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="lg"
      className="h-full min-h-[250px]"
    >
      <div className="flex h-full items-center justify-center">
        <div className="max-w-xs text-center">
          <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-[hsl(var(--app-warning,38_92%_50%))]" />

          <p className="text-xs font-semibold">
            Actividad de soporte no disponible
          </p>

          <p className="mt-1 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            No fue posible obtener las métricas del período.
          </p>
        </div>
      </div>
    </AppCard>
  );
}

/* ============================================================
 * FORMATTERS
 * ============================================================ */

function getVisibleTicks(values: string[]) {
  if (values.length <= 12) {
    return values;
  }

  const maxTicks = 7;

  const step = Math.ceil(values.length / maxTicks);

  return values.filter(
    (_, index) => index % step === 0 || index === values.length - 1,
  );
}

function formatGranularity(value: DashboardTicketsGranularidad) {
  switch (value) {
    case "DIA":
      return "Diario";

    case "MES":
      return "Mensual";

    case "TRIMESTRE":
      return "Trimestral";

    case "ANIO":
      return "Anual";
  }
}

function formatPeriodLabel(
  value: string,
  granularity: DashboardTicketsGranularidad,
) {
  if (granularity === "DIA") {
    const [, month, day] = value.split("-");

    return `${day}/${month}`;
  }

  if (granularity === "MES") {
    const [year, month] = value.split("-");

    return `${MONTHS[Number(month) - 1]} ${year.slice(-2)}`;
  }

  if (granularity === "TRIMESTRE") {
    const [year, quarter] = value.split("-");

    return `${quarter} ${year.slice(-2)}`;
  }

  return value;
}

function formatPeriodLong(
  value: string,
  granularity: DashboardTicketsGranularidad,
) {
  if (granularity === "DIA") {
    return formatDate(value);
  }

  if (granularity === "MES") {
    const [year, month] = value.split("-");

    return `${MONTHS_LONG[Number(month) - 1]} ${year}`;
  }

  if (granularity === "TRIMESTRE") {
    const [year, quarter] = value.split("-");

    return `${quarter} · ${year}`;
  }

  return value;
}

function formatRange(desde: string, hasta: string) {
  return `${formatDateShort(desde)} – ${formatDateShort(hasta)}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${Number(day)} ${MONTHS_LONG[Number(month) - 1]} ${year}`;
}

function formatDateShort(value: string) {
  const [, month, day] = value.split("-");

  if (!month || !day) {
    return value;
  }

  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
}

function formatMinutes(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  const total = Math.round(value);

  if (total < 60) {
    return `${total} min`;
  }

  const hours = Math.floor(total / 60);

  const minutes = total % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function formatPriority(value: string) {
  switch (value) {
    case "BAJA":
      return "Baja";

    case "MEDIA":
      return "Media";

    case "ALTA":
      return "Alta";

    case "URGENTE":
      return "Urgente";

    default:
      return value;
  }
}

const MONTHS = [
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

const MONTHS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;
