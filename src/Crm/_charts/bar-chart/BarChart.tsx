// BarChartNivo.tsx
import { ResponsiveBar } from "@nivo/bar";
import { NivoBarData } from "./bar-chart.interface";

interface BarChartNivoProps {
  data: NivoBarData;
  /**
   * Claves que se van a graficar como series (columnas).
   * Ejemplo: ["hot dog", "burger", "sandwich"]
   */
  keys: string[];
  /**
   * Campo que se usa como índice en el eje X.
   * En tu ejemplo es "country", pero para meses podrías usar "month".
   */
  indexBy?: string;
  /**
   * Altura del chart en px.
   */
  height?: number;
  axisBottomLabel?: string;
  axisLeftLabel?: string;
}

export const BarChartNivo = ({
  data,
  keys,
  indexBy = "country",
  height = 320,
  axisBottomLabel,
  axisLeftLabel,
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
