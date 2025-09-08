// src/components/charts/NivoBarDemo.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";

type Datum = {
  label: string; // eje X
  Efectivo: number; // serie 1
  Tarjeta: number; // serie 2
};

type Props = {
  title?: string;
  data: Datum[];
  className?: string;
};

export default function NivoBarDemo({
  title = "Ventas por método",
  data,
  className,
}: Props) {
  // tema visual alineado a shadcn (usa tus tokens tailwind)
  const theme = {
    textColor: "hsl(var(--muted-foreground))",
    fontSize: 12,
    axis: {
      domain: { line: { stroke: "hsl(var(--border))" } },
      ticks: {
        line: { stroke: "hsl(var(--border))" },
        text: { fill: "hsl(var(--muted-foreground))" },
      },
      legend: { text: { fill: "hsl(var(--muted-foreground))" } },
    },
    grid: { line: { stroke: "hsl(var(--muted))" } },
    tooltip: {
      container: {
        background: "hsl(var(--popover))",
        color: "hsl(var(--popover-foreground))",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
      },
    },
    legends: { text: { fill: "hsl(var(--muted-foreground))" } },
  } as const;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* IMPORTANTE: dale altura al contenedor */}
        <div className="h-72">
          <ResponsiveBar
            data={data}
            keys={["Efectivo", "Tarjeta"]}
            indexBy="label"
            margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
            padding={0.24}
            groupMode="grouped" // "stacked" si prefieres apilado
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={[
              "hsl(var(--chart-1))", // define estos tokens en tu CSS si quieres
              "hsl(var(--chart-2))",
            ]}
            enableLabel={false}
            axisBottom={{ tickRotation: 0 }}
            axisLeft={{ tickSize: 4, tickPadding: 6 }}
            gridYValues={5}
            theme={theme}
            borderRadius={6}
            animate={true}
            motionConfig="gentle" // animaciones suaves por defecto
            role="application"
            ariaLabel="Ventas por método"
            tooltip={({ id, value, indexValue }) => (
              <div className="px-3 py-2 text-sm">
                <div className="font-medium">{String(indexValue)}</div>
                <div className="opacity-80">
                  {String(id)}: Q {Number(value).toFixed(2)}
                </div>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
