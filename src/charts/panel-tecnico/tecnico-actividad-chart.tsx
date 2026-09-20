import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Activity } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TecnicoPanelActividadDia } from "@/Crm/features/dashboard/panel-tecnico.types";

type Props = {
  data: TecnicoPanelActividadDia[];
};

const primaryColor = "hsl(var(--app-primary))";

const foregroundColor = "hsl(var(--app-foreground))";

const mutedColor = "hsl(var(--app-muted-foreground))";

const borderColor = "hsl(var(--app-border))";

const cardColor = "hsl(var(--app-card))";

export function TecnicoActividadChart({ data }: Props) {
  const hasActivity = data.some((item) => item.total > 0);

  return (
    <AppCard variant="outline" size="sm" radius="md" className="min-w-0 p-3">
      <AppStack gap="md">
        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <AppInline
          justify="between"
          align="start"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap={false}>
              <Activity className="size-4 shrink-0" aria-hidden="true" />

              <p className="text-sm font-semibold">Actividad del mes</p>
            </AppInline>

            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Trabajos completados por día
            </p>
          </div>

          <AppInline align="center" gap="sm" wrap>
            <AppInline align="center" gap="xs" wrap={false}>
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor: primaryColor,
                }}
              />

              <span className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Instalaciones
              </span>
            </AppInline>

            <AppInline align="center" gap="xs" wrap={false}>
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor: foregroundColor,
                }}
              />

              <span className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                Tickets
              </span>
            </AppInline>
          </AppInline>
        </AppInline>

        {/* ============================================= */}
        {/* CHART */}
        {/* ============================================= */}

        {data.length > 0 ? (
          <div className="h-[220px] w-full min-w-0 sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%" debounce={60}>
              <LineChart
                data={data}
                margin={{
                  top: 8,
                  right: 8,
                  bottom: 0,
                  left: -16,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke={borderColor}
                  strokeOpacity={0.55}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="etiqueta"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                  interval="preserveStartEnd"
                  tickMargin={8}
                  tick={{
                    fill: mutedColor,
                    fontSize: 10,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  tick={{
                    fill: mutedColor,
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  cursor={{
                    stroke: borderColor,
                    strokeDasharray: "3 3",
                  }}
                  contentStyle={{
                    backgroundColor: cardColor,
                    borderColor,
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  labelStyle={{
                    color: foregroundColor,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="instalaciones"
                  name="Instalaciones"
                  stroke={primaryColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey="tickets"
                  name="Tickets"
                  stroke={foregroundColor}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{
                    r: 3,
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {!hasActivity && data.length > 0 ? (
          <p className="text-center text-xs text-[hsl(var(--app-muted-foreground))]">
            Aún no hay trabajos completados durante este período.
          </p>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
