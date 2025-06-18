"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, TrendingUp, Target } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

interface Metrics {
  tecnicoId: number;
  nombre: string;
  correo: string;
  totalTickets: number;
  ticketsResueltos: number;
  ticketsPendientes: number;
  tasaResolucion: number; // %
  tiempoPromedioHrs: number; // horas
  ticketsPorDia: number;
  proyeccion: number;
  diasTranscurridos: number;
  totalDias: number;
}

interface MetricChartsProps {
  loading?: boolean;
}

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function MetricCharts({
  loading: externalLoading = false,
}: MetricChartsProps) {
  const [data, setData] = useState<Metrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loading || externalLoading;

  // Fetch data from API
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Metrics[]>(
        `${VITE_CRM_API_URL}/metas-tickets/tickets-for-metricas`
      );
      setData(response.data);
      toast.success("Métricas actualizadas correctamente");
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

  // Prepare data for BarChart (Resueltos vs Pendientes)
  const barChartData = data.map((metric) => ({
    nombre: metric.nombre,
    resueltos: metric.ticketsResueltos,
    pendientes: metric.ticketsPendientes,
    total: metric.totalTickets,
  }));

  // Prepare data for LineChart (Proyección diaria)
  const generateProjectionData = () => {
    if (data.length === 0) return [];

    const maxDias = Math.max(...data.map((m) => m.totalDias));
    const projectionData = [];

    for (let dia = 1; dia <= maxDias; dia++) {
      const dayData: any = { dia };

      data.forEach((metric) => {
        const ticketsProyectados = Math.min(
          Math.round(metric.ticketsPorDia * dia),
          metric.proyeccion
        );
        dayData[metric.nombre] = ticketsProyectados;
      });

      projectionData.push(dayData);
    }

    return projectionData;
  };

  const lineChartData = generateProjectionData();

  // Prepare data for RadialBarChart (Tasa de resolución)
  const radialChartData = data.map((metric, index) => ({
    nombre: metric.nombre,
    tasaResolucion: metric.tasaResolucion,
    fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate different colors
  }));

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const ChartSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Métricas de Rendimiento</h2>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* BarChart - Tickets Resueltos vs Pendientes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tickets Resueltos vs Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "resueltos" ? "Resueltos" : "Pendientes",
                    ]}
                    labelFormatter={(label) => `Técnico: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="resueltos" fill="#22c55e" name="Resueltos" />
                  <Bar dataKey="pendientes" fill="#ef4444" name="Pendientes" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* RadialBarChart - Tasa de Resolución */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tasa de Resolución
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={radialChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="tasaResolucion"
                  >
                    {radialChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index} + ${entry.nombre}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Tasa de Resolución"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* LineChart - Proyección de Tickets */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Proyección de Tickets Resueltos por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={lineChartData}
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
                    formatter={(value, name) => [value, `${name} (proyectado)`]}
                  />
                  <Legend />
                  {data.map((metric, index) => (
                    <Line
                      key={metric.tecnicoId}
                      type="monotone"
                      dataKey={metric.nombre}
                      stroke={COLORS[index % COLORS.length]}
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

        {/* Summary Cards */}
        {!isLoading && data.length > 0 && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.length}</div>
                <p className="text-xs text-muted-foreground">
                  Técnicos activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.reduce((acc, metric) => acc + metric.totalTickets, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.reduce(
                    (acc, metric) => acc + metric.ticketsResueltos,
                    0
                  )}{" "}
                  resueltos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Promedio Resolución
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    data.reduce(
                      (acc, metric) => acc + metric.tasaResolucion,
                      0
                    ) / data.length
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Tasa promedio</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && data.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron métricas para mostrar en los gráficos.
              </p>
              <Button onClick={fetchMetrics} variant="outline">
                Cargar datos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
