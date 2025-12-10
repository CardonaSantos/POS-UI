// BarChartNivo.tsx
import { ResponsiveBar } from "@nivo/bar";
import { NivoBarData } from "./bar-chart.interface";

interface BarChartNivoProps {
  data: NivoBarData;
  keys: string[];
  indexBy?: string;
  height?: number;
  axisBottomLabel?: string;
  axisLeftLabel?: string;
  isDark?: boolean;
  colors?: string[];
}

const getNivoTheme = (isDark: boolean) => ({
  textColor: isDark ? "#e5e7eb" : "#0f172a",
  fontSize: 11,
  axis: {
    domain: {
      line: {
        stroke: isDark ? "#4b5563" : "#e5e7eb",
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: isDark ? "#4b5563" : "#9ca3af",
        strokeWidth: 1,
      },
      text: {
        fill: isDark ? "#cbd5f5" : "#4b5563",
      },
    },
  },
  grid: {
    line: {
      stroke: isDark ? "#1f2937" : "#e5e7eb",
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
      background: isDark ? "#020617" : "#ffffff",
      color: isDark ? "#e5e7eb" : "#111827",
      fontSize: 11,
      borderRadius: 6,
      boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
      padding: "6px 9px",
    },
  },
});

export const BarChartNivo = ({
  data,
  keys,
  indexBy = "country",
  height = 320,
  axisBottomLabel,
  axisLeftLabel,
  isDark = false,
  colors = ["#13cd95"], // un solo color por defecto
}: BarChartNivoProps) => (
  <div style={{ height }}>
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{
        top: 24,
        right: 120,
        bottom: axisBottomLabel ? 48 : 32,
        left: axisLeftLabel ? 56 : 40,
      }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={colors}
      theme={getNivoTheme(isDark)}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: axisBottomLabel,
        legendPosition: "middle",
        legendOffset: 36,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: axisLeftLabel,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemsSpacing: 2,
          itemWidth: 80,
          itemHeight: 18,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
      role="application"
      ariaLabel="Bar chart"
    />
  </div>
);
