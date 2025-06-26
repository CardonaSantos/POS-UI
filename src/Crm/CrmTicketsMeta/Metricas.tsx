import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, TrendingUp, Target, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import {
  MetricChartsProps,
  Metrics,
  TicketMoment,
  TicketsActuales,
} from "./types";
import TicketsEnProcesoCard from "./TicketsEnProcesoTable";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
export type TicketResueltoDiaPivot = {
  dia: number;
} & Record<string, number>; // nombreTécnico -> cantidad

export default function MetricCharts({
  loading: externalLoading = false,
}: MetricChartsProps) {
  const [data, setData] = useState<Metrics[]>([]);
  const [dataScale, setDataScale] = useState<TicketResueltoDiaPivot[]>([]);
  const [dataTicketsActuales, setDataTicketsActuales] =
    useState<TicketsActuales | null>(null);
  const [dataTicketsEnProceso, setDataTicketsEnProceso] = useState<
    TicketMoment[]
  >([]);

  const [resueltosMes, setResueltosMes] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoading = loading || externalLoading;
  console.log("La data recibiendo ", data);
  console.log("La data del scale es: ", dataScale);
  console.log("data dataTicketsEnProceso en proceso: ", dataTicketsEnProceso);

  // Fetch data from API
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/metas-tickets/tickets-for-metricas`
      );

      setData(response.data.data);
      setDataScale(response.data.dataScale);
      setDataTicketsEnProceso(response.data.ticketsEnProceso);
      setDataTicketsActuales(response.data.ticketsActuales);
      setResueltosMes(response.data.resueltosDelMes);
    } catch (err) {
      const errorMessage = "Error al cargar las métricas";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Colors for charts
  const COLORS = [
    "#E53935", // Rojo vivo
    "#1E88E5", // Azul intenso
    "#43A047", // Verde brillante
    "#FDD835", // Amarillo fuerte
    "#FB8C00", // Naranja cálido
    "#8E24AA", // Morado destacado
  ];

  const ChartSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-full h-64" />
    </div>
  );

  console.log("Los tickets actuales son: ", dataTicketsActuales);
  const techNames = dataScale.length
    ? Object.keys(dataScale[0]).filter((k) => k !== "dia")
    : [];

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Métricas de Rendimiento</h2>
          <p className="text-muted-foreground">
            Análisis visual del desempeño de los técnicos
          </p>
        </div>
        <Button
          onClick={fetchMetrics}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button onClick={fetchMetrics} variant="outline" className="mt-2">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="gap-4 ">
        {dataTicketsActuales && (
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Tickets disponibles
                    </p>
                    <div className="text-2xl font-bold">
                      {dataTicketsActuales.tickets}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-transparent">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Asignados
                    </p>
                    <div className="text-2xl font-bold">
                      {dataTicketsActuales.ticketsAsignados}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-transparent">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      En proceso
                    </p>
                    <div className="text-2xl font-bold">
                      {dataTicketsActuales.ticketsEnProceso}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-transparent">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Resueltos del día
                    </p>
                    <div className="text-2xl font-bold">
                      {dataTicketsActuales.ticketsResueltos}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-transparent">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Resueltos del mes
                    </p>
                    <div className="text-2xl font-bold">{resueltosMes}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-transparent">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* LineChart - Proyección de Tickets */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-lg">Tickets Resueltos por Día</h2>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={dataScale} /* ← nuevo estado */
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dia"
                    label={{
                      value: "Días",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Tickets",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => `Día ${label}`}
                    formatter={(value, name) => [value, `${name} (resueltos)`]}
                  />
                  <Legend />

                  {/* Dibuja una línea por técnico en el mismo orden de 'data' */}
                  {techNames.map((name, idx) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {!isLoading && data.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="py-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                No hay datos disponibles
              </h3>
              <p className="mb-4 text-muted-foreground">
                No se encontraron métricas para mostrar en los gráficos.
              </p>
              <Button onClick={fetchMetrics} variant="outline">
                Cargar datos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <TicketsEnProcesoCard data={dataTicketsEnProceso} />
    </div>
  );
}
