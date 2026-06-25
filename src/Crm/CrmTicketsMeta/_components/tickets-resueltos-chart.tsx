"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Eye, EyeOff } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppCheckbox } from "@/components/app/primitives/app-checkbox";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";

import { TicketsDiaDetailDialog } from "./tickets-dia-detail-dialog";
import {
  getDayDetail,
  getTechNamesFromScale,
  TicketDiaDetail,
  TicketResueltoDiaPivot,
} from "./metricas.helpers";

interface TicketsResueltosChartProps {
  data: TicketResueltoDiaPivot[];
  isLoading?: boolean;
}

const TECH_COLORS = [
  "hsl(var(--app-primary))",
  "hsl(var(--app-success))",
  "hsl(var(--app-warning))",
  "hsl(var(--app-danger))",
  "hsl(var(--app-info))",
  "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
];

function ChartLoading() {
  return (
    <AppStack gap="sm">
      <AppSkeleton className="h-4 w-48" />
      <AppSkeleton className="h-[320px] w-full" />
    </AppStack>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce(
    (acc: number, item: any) => acc + Number(item.value ?? 0),
    0,
  );

  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-popover,var(--background)))] p-2 text-xs shadow-md">
      <p className="mb-1 font-semibold">Día {label}</p>
      <div className="space-y-1">
        {payload
          .filter((item: any) => Number(item.value ?? 0) > 0)
          .map((item: any) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4"
            >
              <span className="capitalize text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {item.name}
              </span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
      </div>
      <div className="mt-1 border-t border-[hsl(var(--app-border,var(--border)))] pt-1 font-semibold">
        Total: {total}
      </div>
    </div>
  );
}

export function TicketsResueltosChart({
  data,
  isLoading,
}: TicketsResueltosChartProps) {
  const techNames = React.useMemo(() => getTechNamesFromScale(data), [data]);

  const [visibleTechs, setVisibleTechs] = React.useState<string[]>([]);
  const [selectedDetail, setSelectedDetail] =
    React.useState<TicketDiaDetail | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  React.useEffect(() => {
    setVisibleTechs(techNames);
  }, [techNames]);

  const visibleTechSet = React.useMemo(
    () => new Set(visibleTechs),
    [visibleTechs],
  );

  const toggleTech = React.useCallback((name: string) => {
    setVisibleTechs((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  }, []);

  const showAll = React.useCallback(() => {
    setVisibleTechs(techNames);
  }, [techNames]);

  const hideAll = React.useCallback(() => {
    setVisibleTechs([]);
  }, []);

  const openDayDetail = React.useCallback((payload: any) => {
    const row =
      payload?.activePayload?.[0]?.payload ?? payload?.payload ?? null;
    const detail = getDayDetail(row);

    if (!detail) return;

    setSelectedDetail(detail);
    setDetailOpen(true);
  }, []);

  const hasData = data.length > 0;

  return (
    <>
      <AppCard
        variant="outline"
        size="sm"
        title="Tickets resueltos por día"
        action={
          <AppInline align="center" gap="xs">
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<Eye size={13} />}
              onClick={showAll}
              disabled={!hasData || visibleTechs.length === techNames.length}
            >
              Todos
            </AppButton>

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<EyeOff size={13} />}
              onClick={hideAll}
              disabled={!hasData || visibleTechs.length === 0}
            >
              Ocultar
            </AppButton>
          </AppInline>
        }
      >
        <AppStack gap="md">
          {isLoading ? (
            <ChartLoading />
          ) : !hasData ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<BarChart3 size={34} strokeWidth={1.5} />}
              title="No hay datos de tickets resueltos"
              description="Cuando existan resoluciones diarias, se mostrarán aquí por técnico."
              className="py-8"
            />
          ) : (
            <>
              <div
                className="h-[360px] w-full"
                role="img"
                aria-label="Gráfico de barras apiladas con tickets resueltos por día y técnico."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 12, right: 18, left: -10, bottom: 4 }}
                    onClick={openDayDetail}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--app-border,var(--border)))"
                    />
                    <XAxis
                      dataKey="dia"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={34}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {techNames
                      .filter((name) => visibleTechSet.has(name))
                      .map((name, index) => (
                        <Bar
                          key={name}
                          dataKey={name}
                          stackId="resueltos"
                          fill={TECH_COLORS[index % TECH_COLORS.length]}
                          radius={[3, 3, 0, 0]}
                          cursor="pointer"
                          name={name}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <AppGrid cols={{ base: 1, sm: 2, lg: 3 }} gap="xs">
                {techNames.map((name, index) => (
                  <label
                    key={name}
                    className="flex min-w-0 cursor-pointer items-center gap-2 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] px-2 py-1.5 text-xs hover:bg-[hsl(var(--app-muted,var(--muted))/0.35)]"
                  >
                    <AppCheckbox
                      checked={visibleTechs.includes(name)}
                      onCheckedChange={() => toggleTech(name)}
                    />

                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          TECH_COLORS[index % TECH_COLORS.length],
                      }}
                    />

                    <span className="min-w-0 truncate capitalize">{name}</span>
                  </label>
                ))}
              </AppGrid>
            </>
          )}
        </AppStack>
      </AppCard>

      <TicketsDiaDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        detail={selectedDetail}
      />
    </>
  );
}
