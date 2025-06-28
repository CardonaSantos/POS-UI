import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  Ticket,
} from "lucide-react";
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
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
export type TicketResueltoDiaPivot = {
  dia: number;
} & Record<string, number>; // nombreTécnico -> cantidad

interface TicketResueltoDiaSelected {
  dia: number;
  [nombreTecnico: string]: number;
}

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
  const [selectedData, setSelectedData] =
    useState<TicketResueltoDiaPivot | null>(null);
  const [resueltosMes, setResueltosMes] = useState<number | null>(null);
  // al principio de tu componente
  const [showModal, setShowModal] = useState(false);

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

  const techNames = useMemo(
    () =>
      dataScale.length
        ? Object.keys(dataScale[0]).filter((k) => k !== "dia")
        : [],
    [dataScale] // ← solo cambia cuando llegan datos nuevos
  );
  // todos visibles por defecto
  const [visibleTechs, setVisibleTechs] = useState<string[]>(techNames);

  // cuando cambie la lista de técnicos (p. ej. al primer fetch) los sincronizamos
  useEffect(() => {
    setVisibleTechs(techNames); // ahora sí, solo cuando hay técnicos nuevos
  }, [techNames]);

  const handleDotClick = (dia: number) => {
    const found = dataScale.find((o) => o.dia === dia);
    if (!found) return;

    const total = techNames.reduce((sum, tech) => sum + (found[tech] ?? 0), 0);

    setSelectedData({ ...found, total }); // ← ahora sí cumple la interfaz
    setShowModal(true);
  };

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
                      // value: "Días",
                      position: "insideBottom",
                      offset: -10,
                    }}
                    onClick={() => setShowModal(true)}
                    style={{ cursor: "pointer" }}
                  />

                  <YAxis
                    onClick={() => setShowModal(true)}
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
                  {visibleTechs.map((name) => {
                    // mantenemos el índice original para que cada técnico conserve su color
                    const idx = techNames.indexOf(name);
                    const color = COLORS[idx % COLORS.length];

                    // puntos clicables
                    const CustomDot = (props: any) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={color}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDotClick(payload.dia)}
                        />
                      );
                    };

                    const CustomActiveDot = (props: any) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={color}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDotClick(payload.dia)}
                        />
                      );
                    };

                    return (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={color}
                        strokeWidth={2}
                        dot={<CustomDot />}
                        activeDot={<CustomActiveDot />}
                        className="hover:cursor-pointer"
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3 mb-4">
          {techNames.map((name) => (
            <label
              key={name}
              className="flex items-center gap-2 text-sm capitalize"
            >
              <Checkbox
                checked={visibleTechs.includes(name)}
                onCheckedChange={() =>
                  setVisibleTechs((prev) =>
                    prev.includes(name)
                      ? prev.filter((t) => t !== name)
                      : [...prev, name]
                  )
                }
              />
              {name}
            </label>
          ))}
        </div>
      </div>

      {showModal && selectedData && (
        <Dialog open onOpenChange={(open) => setShowModal(open)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <div className="text-center">
              <h2 className="font-semibold">Detalles del día</h2>
            </div>
            <div className="py-2">
              <ShowDaySelected day={selectedData} />
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowModal(false)}
                className="min-w-[100px]"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
type ShowDaySelectedProps = {
  day: TicketResueltoDiaSelected;
};
const ShowDaySelected = ({ day }: ShowDaySelectedProps) => {
  const tecnicos = Object.entries(day)
    .filter(([key]) => key !== "dia" && key !== "total")
    .map(([tecnico, count]) => ({ name: tecnico, resolved: count as number }));

  return (
    <div className="w-full space-y-4">
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r ">
        <CardHeader className="py-3 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            Día {day.dia}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Técnicos */}
      {tecnicos.length > 0 && (
        <div className="space-y-3">
          <div className="grid gap-2">
            {tecnicos.map(({ name, resolved }) => (
              <Card
                key={name}
                className="transition-colors bg-muted/30 hover:bg-muted/50"
              >
                <CardContent className="py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold capitalize">
                        {name}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-semibold dark:text-fuchsia-500 dark:bg-slate-900 text-rose-500"
                    >
                      <Ticket className="w-3 h-3 mr-1" />
                      {resolved}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Total */}
      <Card className="">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Total Resueltos
              </span>
            </div>
            <Badge className="px-2 py-0 text-lg text-white bg-green-600 hover:bg-green-700">
              {day.total}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
