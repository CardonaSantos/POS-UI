import {
  CreditoCuotaResponse,
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
import { CUOTA_GRID } from "./credito-details";

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
  cuota: CreditoCuotaResponse;
  handleSelectCuota: (cuota: CreditoCuotaResponse) => void;
  handleDesSelectCuota: () => void;
}

export function CuotaRow({ cuota, handleSelectCuota }: Props) {
  const config = estadoCuotaConfig[cuota.estado];
  const StatusIcon = config.icon;

  const total = Number(cuota.montoTotal);
  const pagado = Number(cuota.montoPagado);
  const pendiente = Math.max(total - pagado, 0);

  const moraDias =
    cuota.moras?.reduce((max, m) => Math.max(max, m.diasMora), 0) ?? 0;

  const moraTotal =
    cuota.moras?.reduce((sum, m) => sum + Number(m.interes), 0) ?? 0;

  return (
    <div
      onClick={() => handleSelectCuota(cuota)}
      className={cn(
        "grid items-center px-3 py-2 border-b last:border-0",
        "hover:bg-muted/30 cursor-pointer text-[12px]",
        CUOTA_GRID,
      )}
    >
      {/* # */}
      <span className="text-muted-foreground">{cuota.numeroCuota}</span>

      {/* Fecha */}
      <span className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        {formattShortFecha(cuota.fechaVenc)}
      </span>

      {/* Total */}
      <span className="text-right font-medium">{formattMonedaGT(total)}</span>

      {/* Pagado */}
      <span className="text-right text-emerald-600">
        {formattMonedaGT(pagado)}
      </span>

      {/* Pendiente */}
      <span className="text-right">
        {pendiente > 0 ? formattMonedaGT(pendiente) : "—"}
      </span>

      {/* Mora */}
      <div className="text-right leading-tight">
        <span className={cn(moraTotal > 0 && "text-red-600 font-medium")}>
          {moraTotal > 0 ? formattMonedaGT(moraTotal) : "—"}
        </span>
        {moraDias > 0 && (
          <span className="block text-[10px] text-muted-foreground">
            {moraDias} días
          </span>
        )}
      </div>

      {/* Estado */}
      <div className="flex justify-center">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium",
            config.className,
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </span>
      </div>
    </div>
  );
}
