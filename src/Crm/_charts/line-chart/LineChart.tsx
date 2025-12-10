// LineChartNivo.tsx
import { ResponsiveLine } from "@nivo/line";
import type { ChartDataLineNivo } from "./LineChart.interfaces";

interface LineChartNivoProps {
  data: ChartDataLineNivo;
  height?: number;
  axisBottomLabel?: string;
  axisLeftLabel?: string;
  stacked?: boolean;
  /** modo oscuro (puedes pasarlo desde tu theme/store) */
  isDark?: boolean;
  /** colores de las series */
  colors?: string[];
}

const getNivoTheme = (isDark: boolean) => ({
  textColor: isDark ? "#e5e7eb" : "#0f172a", // tailwind: slate-200 / slate-900
  fontSize: 11,
  axis: {
    domain: {
      line: {
        stroke: isDark ? "#4b5563" : "#e5e7eb", // slate-600 / slate-200
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: isDark ? "#4b5563" : "#9ca3af", // slate-600 / gray-400
        strokeWidth: 1,
      },
      text: {
        fill: isDark ? "#cbd5f5" : "#4b5563", // slate-300 / slate-600
      },
    },
  },
  grid: {
    line: {
      stroke: isDark ? "#1f2937" : "#e5e7eb", // slate-800 / slate-200
      strokeWidth: 1,
    },
  },
  legends: {
    text: {
      fill: isDark ? "#e5e7eb" : "#4b5563",
    },
  },
  tooltip: {
    container: {
      background: isDark ? "#020617" : "#ffffff", // bg tooltip
      color: isDark ? "#e5e7eb" : "#111827",
      fontSize: 11,
      borderRadius: 6,
      boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
      padding: "6px 9px",
    },
  },
});

export const LineChartNivo = ({
  data,
  height = 320,
  axisBottomLabel = "",
  axisLeftLabel = "",
  stacked = false,
  isDark = false,
  colors = ["#16d099", "#474747", "#83e0c6"], // naranja, verde, azul
}: LineChartNivoProps) => (
  <div style={{ height }}>
    <ResponsiveLine
      data={data}
      margin={{
        top: 24,
        right: 40,
        bottom: axisBottomLabel ? 50 : 30,
        left: axisLeftLabel ? 60 : 45,
      }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked,
        reverse: false,
      }}
      colors={colors}
      theme={getNivoTheme(isDark)}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: axisBottomLabel,
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: axisLeftLabel,
        legendOffset: -45,
        legendPosition: "middle",
      }}
      curve="monotoneX"
      pointSize={6}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "seriesColor" }}
      enablePoints={true}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 60,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  </div>
);
