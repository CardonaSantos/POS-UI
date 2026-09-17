import * as React from "react";

import { ResponsiveBar } from "@nivo/bar";

import type { NivoBarData } from "./bar-chart.interface";

interface BarChartNivoProps {
  data: NivoBarData;
  keys: string[];

  indexBy?: string;

  height?: number;

  axisBottomLabel?: string;
  axisLeftLabel?: string;

  groupMode?: "grouped" | "stacked";

  padding?: number;
  innerPadding?: number;

  enableLabel?: boolean;

  tickRotation?: number;

  showLegend?: boolean;

  ariaLabel?: string;

  /**
   * Colores opcionales.
   *
   * Si no se pasan, usamos tokens semánticos
   * del sistema.
   */
  colors?: string[];

  /**
   * En nuestros dashboards normalmente contamos
   * unidades enteras: clientes, instalaciones, etc.
   */
  integerAxis?: boolean;
}

const DEFAULT_COLORS = [
  "hsl(var(--app-success,160 84% 39%))",
  "hsl(var(--app-danger,var(--destructive)))",
];

const NIVO_THEME = {
  text: {
    fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
    fontSize: 10,
  },

  axis: {
    domain: {
      line: {
        stroke: "transparent",
      },
    },

    ticks: {
      line: {
        stroke: "transparent",
      },

      text: {
        fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
        fontSize: 9,
      },
    },

    legend: {
      text: {
        fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
        fontSize: 10,
      },
    },
  },

  grid: {
    line: {
      stroke: "hsl(var(--app-border,var(--border)))",
      strokeWidth: 1,
      strokeOpacity: 0.35,
    },
  },

  legends: {
    text: {
      fill: "hsl(var(--app-muted-foreground,var(--muted-foreground)))",
      fontSize: 9,
    },
  },

  tooltip: {
    container: {
      background: "hsl(var(--app-popover,var(--popover)))",

      color: "hsl(var(--app-popover-foreground,var(--popover-foreground)))",

      border: "1px solid hsl(var(--app-border,var(--border)))",

      borderRadius: 8,

      boxShadow: "0 8px 24px rgba(0,0,0,0.20)",

      fontSize: 10,

      padding: "7px 9px",
    },
  },
};

export const BarChartNivo = ({
  data,
  keys,

  indexBy = "label",

  height = 320,

  axisBottomLabel,
  axisLeftLabel,

  groupMode = "grouped",

  padding = 0.35,
  innerPadding = 3,

  enableLabel = false,

  tickRotation = 0,

  showLegend = true,

  ariaLabel = "Gráfica de barras",

  colors = DEFAULT_COLORS,

  integerAxis = true,
}: BarChartNivoProps) => {
  /**
   * Buscamos el mayor valor real del dataset.
   */
  const maxDataValue = React.useMemo(() => {
    let max = 0;

    for (const item of data) {
      for (const key of keys) {
        const value = Number(item[key] ?? 0);

        if (Number.isFinite(value) && value > max) {
          max = value;
        }
      }
    }

    return max;
  }, [data, keys]);

  /**
   * Evitamos ejes absurdos como:
   *
   * 0
   * 0.1
   * 0.2
   * ...
   * 1
   *
   * cuando realmente estamos contando operaciones.
   */
  const integerTicks = React.useMemo(() => {
    if (!integerAxis) {
      return undefined;
    }

    if (maxDataValue <= 0) {
      return [0, 1];
    }

    if (maxDataValue <= 5) {
      return Array.from({ length: maxDataValue + 1 }, (_, index) => index);
    }

    const step = Math.ceil(maxDataValue / 4);

    const maxTick = Math.ceil(maxDataValue / step) * step;

    return Array.from(
      {
        length: maxTick / step + 1,
      },
      (_, index) => index * step,
    );
  }, [integerAxis, maxDataValue]);

  const maxValue =
    integerAxis && integerTicks?.length
      ? integerTicks[integerTicks.length - 1]
      : "auto";

  return (
    <div style={{ height }} className="min-w-0">
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        groupMode={groupMode}
        margin={{
          top: 12,
          right: 18,
          bottom: showLegend
            ? axisBottomLabel
              ? 64
              : 52
            : axisBottomLabel
              ? 42
              : 28,
          left: axisLeftLabel ? 52 : 34,
        }}
        padding={padding}
        innerPadding={innerPadding}
        valueScale={{
          type: "linear",
          min: 0,
          max: maxValue,
        }}
        indexScale={{
          type: "band",
          round: true,
        }}
        colors={colors}
        colorBy="id"
        theme={NIVO_THEME}
        borderRadius={3}
        borderWidth={0}
        enableGridX={false}
        enableGridY
        enableLabel={enableLabel}
        labelSkipWidth={16}
        labelSkipHeight={16}
        axisBottom={{
          tickSize: 0,
          tickPadding: 7,
          tickRotation,
          legend: axisBottomLabel,
          legendPosition: "middle",
          legendOffset: 34,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 7,
          tickRotation: 0,
          tickValues: integerTicks,
          legend: axisLeftLabel,
          legendPosition: "middle",
          legendOffset: -42,
        }}
        legends={
          showLegend
            ? [
                {
                  dataFrom: "keys",

                  anchor: "bottom",

                  direction: "row",

                  justify: false,

                  translateY: 52,

                  itemsSpacing: 16,

                  itemWidth: 115,

                  itemHeight: 14,

                  itemDirection: "left-to-right",

                  symbolSize: 8,

                  symbolShape: "circle",
                },
              ]
            : []
        }
        animate
        motionConfig="gentle"
        role="application"
        ariaLabel={ariaLabel}
      />
    </div>
  );
};
