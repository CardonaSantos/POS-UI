import { ResponsiveAreaBump } from "@nivo/bump";

// interface LineChartNivoProps {
//   data: AreaBumpData;
//   //   height?: number; // altura del chart en px
//   //   axisBottomLabel?: string; // texto debajo del eje X
//   //   axisLeftLabel?: string; // texto al lado del eje Y
//   //   stacked?: boolean; // true = suma series / false = líneas independientes
// }

const data = [
  {
    id: "JavaScript",
    data: [
      {
        x: "13/11",
        y: 557,
      },
    ],
  },

  {
    id: "JavaScript",
    data: [
      {
        x: "03/12",
        y: 2,
      },
    ],
  },
];

export const MyAreaBump = () => (
  <ResponsiveAreaBump /* or AreaBump for fixed dimensions */
    data={data}
    margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
    colors={{ scheme: "category10" }}
    blendMode="multiply"
  />
);
