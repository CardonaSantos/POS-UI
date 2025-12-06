// LineChartNivo.tsx
import { ResponsiveLine } from "@nivo/line";
import type { ChartDataLineNivo } from "./LineChart.interfaces";

interface LineChartNivoProps {
  data: ChartDataLineNivo;
  height?: number; // altura del chart en px
  axisBottomLabel?: string; // texto debajo del eje X
  axisLeftLabel?: string; // texto al lado del eje Y
  stacked?: boolean; // true = suma series / false = líneas independientes
}

export const LineChartNivo = ({
  data,
  height = 320,
  axisBottomLabel = "",
  axisLeftLabel = "",
  stacked = false,
}: LineChartNivoProps) => (
  <div style={{ height }}>
    <ResponsiveLine
      data={data}
      // margen interno del lienzo (deja espacio para labels y ticks)
      margin={{
        top: 24,
        right: 40,
        bottom: axisBottomLabel ? 50 : 30,
        left: axisLeftLabel ? 60 : 45,
      }}
      // X como puntos categóricos (fechas "DD/MM")
      xScale={{ type: "point" }}
      // Y lineal, desde 0 hasta el máximo
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked,
        reverse: false,
      }}
      // eje X
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45, // gira un poco las fechas si son muchas
        legend: axisBottomLabel,
        legendOffset: 40,
        legendPosition: "middle",
      }}
      // eje Y
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: axisLeftLabel,
        legendOffset: -45,
        legendPosition: "middle",
      }}
      // suavizar la línea un poco
      curve="monotoneX"
      pointSize={6}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "seriesColor" }}
      enablePoints={true}
      useMesh={true} // mejora el hover
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
