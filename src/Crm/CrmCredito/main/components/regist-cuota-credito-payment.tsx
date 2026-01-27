"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  CircleDollarSign,
  Wallet,
  Percent,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
  CreditCard,
  X,
} from "lucide-react";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";
import { CreateCuotaPagoDto } from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { Textarea } from "@/components/ui/textarea";

type EstadoCuota = "PENDIENTE" | "PARCIAL" | "PAGADA" | "VENCIDA";

interface CuotaResponse {
  id: number;
  creditoId: number;
  numeroCuota: number;
  fechaVenc: string;
  montoCapital: string;
  montoInteres: string;
  montoTotal: string;
  estado: EstadoCuota;
  montoPagado: string;
}

interface PagoCuotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cuota: CuotaResponse | null;
  onConfirmPayment: (cuotaId: number, monto: number) => void;
  handleConfirmPayment: () => void;
  handleChangeProperty: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  payload: CreateCuotaPagoDto;
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

export function PagoCuotaDialog({
  open,
  onOpenChange,
  cuota,
  handleConfirmPayment,
  handleChangeProperty,
  payload,
}: PagoCuotaDialogProps) {
  const montoPendiente = cuota
    ? parseFloat(cuota.montoTotal) - parseFloat(cuota.montoPagado)
    : 0;

  if (!cuota) return null;

  const estado = estadoConfig[cuota.estado];
  const EstadoIcon = estado.icon;
  const porcentajePagado =
    (parseFloat(cuota.montoPagado) / parseFloat(cuota.montoTotal)) * 100;

  const handlePayFullAmount = () => {};

  const handleConfirm = () => {
    handleConfirmPayment();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 border-b border-border ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 " />
              </div>
              <div>
                <DialogTitle className="text-base">Registrar Pago</DialogTitle>
                <DialogDescription className="text-xs">
                  Cuota #{cuota.numeroCuota}
                </DialogDescription>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${estado.className}`}
            >
              <EstadoIcon className="h-3 w-3" />
              {estado.label}
            </span>
          </div>
        </DialogHeader>

        {/* Body - Grid Layout para partir a la mitad */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-5 space-y-5 bg-muted/10 border-r border-border/60">
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">Progreso de pago</span>
                <span>{porcentajePagado.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${porcentajePagado}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3  border border-border/50 rounded-lg shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Vencimiento
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formattShortFecha(cuota.fechaVenc)}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Total
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  {formattMonedaGT(cuota.montoTotal)}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Pagado
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CreditCard className="h-3.5 w-3.5" />
                  {formattMonedaGT(cuota.montoPagado)}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Pendiente
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                  <Wallet className="h-3.5 w-3.5" />
                  {formattMonedaGT(montoPendiente)}
                </div>
              </div>
            </div>

            {/* Desglose */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Desglose de cuota:
              </p>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded border">
                  <Wallet className="h-3 w-3 text-muted-foreground" />
                  <span>
                    Capital:{" "}
                    <span className="font-medium text-foreground">
                      {formattMonedaGT(cuota.montoCapital)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded border">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  <span>
                    Interés:{" "}
                    <span className="font-medium text-foreground">
                      {formattMonedaGT(cuota.montoInteres)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Formulario de pago */}
          <div className="p-5 flex flex-col justify-center space-y-4 ">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monto" className="text-sm font-semibold">
                  Monto a pagar
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs "
                  onClick={handlePayFullAmount}
                >
                  Pagar todo
                </Button>
              </div>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium group-focus-within:text-primary transition-colors">
                  Q
                </span>
                <Input
                  name="monto"
                  id="monto"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={payload.monto}
                  onChange={(e) => handleChangeProperty(e)}
                  className="pl-7 text-right font-medium text-lg h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="fechaPago"
                  className="text-xs text-muted-foreground"
                >
                  Fecha de pago
                </Label>
                <Input
                  name="fechaPago"
                  id="fechaPago"
                  type="date"
                  value={payload.fechaPago}
                  onChange={(e) => handleChangeProperty(e)}
                  className="font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="referencia"
                  className="text-xs text-muted-foreground"
                >
                  No. Referencia
                </Label>
                <Input
                  placeholder="#123456"
                  name="referencia"
                  id="referencia"
                  type="text"
                  value={payload.referencia}
                  onChange={(e) => handleChangeProperty(e)}
                  className="font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="observacion"
                className="text-xs text-muted-foreground"
              >
                Observaciones (Opcional)
              </Label>
              <Textarea
                placeholder="Escribe una nota aquí..."
                name="observacion"
                id="observacion"
                value={payload.observacion}
                onChange={(e) => handleChangeProperty(e)}
                className="font-medium resize-none min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border bg-muted/20">
          <div className="flex w-full gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none sm:w-32 gap-1.5  hover:bg-muted"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-none sm:w-40 gap-1.5 shadow-md"
              onClick={handleConfirm}
              disabled={!payload.monto || parseFloat(payload.monto) <= 0}
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default PagoCuotaDialog;
