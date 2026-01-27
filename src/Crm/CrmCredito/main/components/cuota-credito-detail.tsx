"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  CircleDollarSign,
  CreditCard,
  Hash,
  Percent,
  Trash2,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
} from "lucide-react";
import {
  CuotaResponse,
  EstadoCuota,
} from "@/Crm/features/credito/credito-interfaces";

interface Props {
  cuota: CuotaResponse | null;
  onPagar?: (cuota: CuotaResponse) => void;
  onEliminar?: (cuota: CuotaResponse) => void;
  handleOpenPayment: () => void;
  handleSubmitDeletPayment: () => void;
}

const estadoConfig: Record<
  EstadoCuota,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDIENTE: {
    label: "Pendiente",
    icon: CircleDashed,
    className: "text-amber-500 bg-amber-500/10",
  },
  PARCIAL: {
    label: "Parcial",
    icon: Clock,
    className: "text-blue-500 bg-blue-500/10",
  },
  PAGADA: {
    label: "Pagada",
    icon: CheckCircle2,
    className: "text-emerald-500 bg-emerald-500/10",
  },
  VENCIDA: {
    label: "Vencida",
    icon: AlertCircle,
    className: "text-red-500 bg-red-500/10",
  },
};

function formatCurrency(value: string | number) {
  return `Q ${parseFloat(String(value)).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CuotaCreditoDetail({
  cuota,
  onEliminar,
  handleOpenPayment,
}: Props) {
  if (!cuota) {
    return (
      <div className="rounded-md border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Cuota no seleccionada</p>
      </div>
    );
  }

  const estado = estadoConfig[cuota.estado];
  const EstadoIcon = estado.icon;
  const montoPendiente =
    parseFloat(cuota.montoTotal) - parseFloat(cuota.montoPagado);
  const porcentajePagado =
    (parseFloat(cuota.montoPagado) / parseFloat(cuota.montoTotal)) * 100;
  const isPagada = cuota.estado === "PAGADA";

  return (
    <div className="rounded-md border border-border bg-card p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cuota {cuota.numeroCuota}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${estado.className}`}
        >
          <EstadoIcon className="h-3 w-3" />
          {estado.label}
        </span>
      </div>

      {/* Progress bar */}
      {!isPagada && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Progreso de pago</span>
            <span>{porcentajePagado.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${porcentajePagado}%` }}
            />
          </div>
        </div>
      )}

      {/* Details grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Vencimiento</p>
            <p className="text-sm font-medium">
              {format(new Date(cuota.fechaVenc), "dd/MM/yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Wallet className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Capital</p>
            <p className="text-sm font-medium">
              {formatCurrency(cuota.montoCapital)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Percent className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Interes</p>
            <p className="text-sm font-medium">
              {formatCurrency(cuota.montoInteres)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CircleDollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-medium">
              {formatCurrency(cuota.montoTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CreditCard className="mt-0.5 h-4 w-4 text-emerald-500" />
          <div>
            <p className="text-xs text-muted-foreground">Pagado</p>
            <p className="text-sm font-medium text-emerald-600">
              {formatCurrency(cuota.montoPagado)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CircleDollarSign className="mt-0.5 h-4 w-4 text-amber-500" />
          <div>
            <p className="text-xs text-muted-foreground">Pendiente</p>
            <p className="text-sm font-medium text-amber-600">
              {formatCurrency(montoPendiente)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 bg-transparent"
          onClick={handleOpenPayment}
          disabled={isPagada}
        >
          <Wallet className="h-4 w-4" />
          Pagar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          onClick={() => onEliminar?.(cuota)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CuotaCreditoDetail;
