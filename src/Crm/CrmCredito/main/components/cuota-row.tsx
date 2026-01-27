import {
  CreditoCuotaResponse,
  CuotaResponse,
  EstadoCuota,
} from "@/Crm/features/credito/credito-interfaces";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { cn } from "@/lib/utils";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Timer,
} from "lucide-react";

const estadoCuotaConfig: Record<
  EstadoCuota,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  PAGADA: {
    label: "Pagada",
    className: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  PARCIAL: {
    label: "Parcial",
    className: "bg-blue-100 text-blue-700",
    icon: Timer,
  },
  VENCIDA: {
    label: "Vencida",
    className: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

interface Props {
  cuota: CuotaResponse;
  handleSelectCuota: (cuota: CreditoCuotaResponse) => void;
  handleDesSelectCuota: () => void;
}

export function CuotaRow({
  cuota,
  // handleDesSelectCuota,
  handleSelectCuota,
}: Props) {
  const config = estadoCuotaConfig[cuota.estado];
  const StatusIcon = config.icon;
  const montoPendiente =
    Number.parseFloat(cuota.montoTotal) - Number.parseFloat(cuota.montoPagado);

  formattShortFecha;
  return (
    <div
      className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-2 md:gap-4 py-2.5 px-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
      onClick={() => handleSelectCuota(cuota)}
    >
      <span className="text-xs font-medium text-muted-foreground w-6">
        #{cuota.numeroCuota}
      </span>

      <div className="flex items-center gap-1.5 min-w-0">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm truncate">
          {formattShortFecha(cuota.fechaVenc)}
        </span>
      </div>

      <span className="text-sm font-medium text-right">
        {formattMonedaGT(cuota.montoTotal)}
      </span>

      <span
        className={cn(
          "text-sm text-right hidden md:block",
          Number.parseFloat(cuota.montoPagado) > 0
            ? "text-emerald-600"
            : "text-muted-foreground",
        )}
      >
        {formattMonedaGT(cuota.montoPagado)}
      </span>

      <span
        className={cn(
          "text-sm text-right",
          montoPendiente > 0 ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {montoPendiente > 0 ? formattMonedaGT(montoPendiente) : "-"}
      </span>

      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
          config.className,
        )}
      >
        <StatusIcon className="h-3 w-3" />
        <span className="hidden sm:inline">{config.label}</span>
      </span>
    </div>
  );
}
