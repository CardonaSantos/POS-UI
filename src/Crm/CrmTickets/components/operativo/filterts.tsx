import { useMemo, useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  EstadoTicketSoporte,
  PrioridadTicketSoporte,
} from "@/Crm/features/dashboard/dashboard-tickets";
import {
  downloadFile,
  useGenerateTicketReports,
} from "@/Crm/CrmHooks/hooks/use-reports/use-reports";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type ModoFechaTicketReport =
  | "ACTIVIDAD"
  | "APERTURA"
  | "CIERRE"
  | "ACTUALIZACION";

interface TecnicoOption {
  id: number;
  nombre: string;
}

export interface TicketReportPayload {
  fecha?: string;
  fechaInicio?: string;
  fechaFin?: string;
  empresaId?: number;
  tecnicoId?: number;
  estados?: EstadoTicketSoporte[];
  prioridades?: PrioridadTicketSoporte[];
  modoFecha?: ModoFechaTicketReport;
}

interface TicketReportTopBarProps {
  tecnicos?: TecnicoOption[];
}

const ESTADOS: EstadoTicketSoporte[] = [
  "NUEVO",
  "ABIERTA",
  "EN_PROCESO",
  "PENDIENTE",
  "PENDIENTE_CLIENTE",
  "PENDIENTE_TECNICO",
  "PENDIENTE_REVISION",
  "RESUELTA",
  "CERRADO",
  "ARCHIVADA",
  "CANCELADA",
];

const PRIORIDADES: PrioridadTicketSoporte[] = Object.values(
  PrioridadTicketSoporte,
);

const MODOS_FECHA: Array<{
  value: ModoFechaTicketReport;
  label: string;
}> = [
  { value: "ACTIVIDAD", label: "Actividad" },
  { value: "APERTURA", label: "Apertura" },
  { value: "CIERRE", label: "Cierre" },
  { value: "ACTUALIZACION", label: "Actualización" },
];

function getTodayInputDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TicketReportTopBar({
  tecnicos = [],
}: TicketReportTopBarProps) {
  const today = useMemo(() => getTodayInputDate(), []);

  const [fechaInicio, setFechaInicio] = useState(today);
  const [fechaFin, setFechaFin] = useState(today);
  const [modoFecha, setModoFecha] =
    useState<ModoFechaTicketReport>("ACTIVIDAD");

  const [empresaId, setEmpresaId] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");

  const [estado, setEstado] = useState<EstadoTicketSoporte | "TODOS">("TODOS");
  const [prioridad, setPrioridad] = useState<PrioridadTicketSoporte | "TODAS">(
    "TODAS",
  );

  const [loading, setLoading] = useState(false);
  const generatReport = useGenerateTicketReports();

  const isSingleDate = fechaInicio === fechaFin;

  const payload: TicketReportPayload = useMemo(() => {
    const body: TicketReportPayload = {
      modoFecha,
    };

    if (isSingleDate) {
      body.fecha = fechaInicio;
    } else {
      body.fechaInicio = fechaInicio;
      body.fechaFin = fechaFin;
    }

    if (empresaId) {
      body.empresaId = Number(empresaId);
    }

    if (tecnicoId) {
      body.tecnicoId = Number(tecnicoId);
    }

    if (estado !== "TODOS") {
      body.estados = [estado];
    }

    if (prioridad !== "TODAS") {
      body.prioridades = [prioridad];
    }

    return body;
  }, [
    fechaInicio,
    fechaFin,
    modoFecha,
    empresaId,
    tecnicoId,
    estado,
    prioridad,
    isSingleDate,
  ]);

  const handleReset = () => {
    setFechaInicio(today);
    setFechaFin(today);
    setModoFecha("ACTIVIDAD");
    setEmpresaId("");
    setTecnicoId("");
    setEstado("TODOS");
    setPrioridad("TODAS");
  };

  const handleExport = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Selecciona fecha inicial y fecha final");
      return;
    }

    if (fechaFin < fechaInicio) {
      toast.error("La fecha final no puede ser menor que la inicial");
      return;
    }

    try {
      setLoading(true);

      toast.promise(generatReport.mutateAsync(payload), {
        success: (data) => {
          downloadFile(data, `tickets_report_${Date.now()}"`);

          return "Reporte generado";
        },
        loading: "Generando...",
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border-b bg-white px-2 py-1.5 dark:bg-background">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-[125px] flex-col gap-0.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            Desde
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div className="flex min-w-[125px] flex-col gap-0.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            Hasta
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
          />
        </div>

        <div className="flex min-w-[130px] flex-col gap-0.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            Fecha por
          </label>
          <select
            value={modoFecha}
            onChange={(e) =>
              setModoFecha(e.target.value as ModoFechaTicketReport)
            }
            className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
          >
            {MODOS_FECHA.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {tecnicos.length > 0 && (
          <div className="flex min-w-[155px] flex-col gap-0.5">
            <label className="text-[11px] font-medium text-muted-foreground">
              Técnico
            </label>
            <select
              value={tecnicoId}
              onChange={(e) => setTecnicoId(e.target.value)}
              className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
            >
              <option value="">Todos</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.id} value={tecnico.id}>
                  {tecnico.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex min-w-[135px] flex-col gap-0.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value as EstadoTicketSoporte | "TODOS")
            }
            className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
          >
            <option value="TODOS">Todos</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-[115px] flex-col gap-0.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            Prioridad
          </label>
          <select
            value={prioridad}
            onChange={(e) =>
              setPrioridad(e.target.value as PrioridadTicketSoporte | "TODAS")
            }
            className="h-7 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary"
          >
            <option value="TODAS">Todas</option>
            {PRIORIDADES.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={loading}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Limpiar
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            disabled={loading}
            className="h-7 px-2 text-xs"
          >
            {loading ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="mr-1 h-3.5 w-3.5" />
            )}
            Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
