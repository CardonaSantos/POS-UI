"use client";

import React, { useState } from "react";
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
  Banknote,
} from "lucide-react";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  CreateCuotaPagoDto,
  PayMoraCuotaDto,
  usePayMoraCuota,
} from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditoCuotaResponse,
  EstadoMora,
  MoraCuota,
} from "@/Crm/features/credito/credito-interfaces";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { toast } from "sonner";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useQueryClient } from "@tanstack/react-query";
import { creditoQkeys } from "@/Crm/CrmHooks/hooks/use-credito/Qk";

type EstadoCuota = "PENDIENTE" | "PARCIAL" | "PAGADA" | "VENCIDA";

interface PagoCuotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cuota: CreditoCuotaResponse | null;
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
  const query = useQueryClient();
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const montoPendiente = cuota
    ? parseFloat(cuota.montoTotal) - parseFloat(cuota.montoPagado)
    : 0;

  const [moraSeleccionada, setMoraSeleccionada] = useState<MoraCuota | null>(
    null,
  );
  const [openPagarMora, setOpenPagarMora] = useState(false);
  const id = cuota?.creditoId ? cuota.creditoId : 0;
  const submitPayMoraCuota = usePayMoraCuota(id);

  if (!cuota) return null;

  const estado = estadoConfig[cuota.estado];
  const EstadoIcon = estado.icon;

  const total = parseFloat(cuota.montoTotal);
  const pagado = parseFloat(cuota.montoPagado);

  // const montoPendiente = total - pagado + moraTotal;

  const handlePayFullAmount = () => {};

  const moraTotal = Array.isArray(cuota.moras)
    ? cuota.moras.reduce((acc, mora) => acc + (Number(mora.interes) || 0), 0)
    : 0;

  const porcentajePagado =
    total > 0 ? Math.min((pagado / total) * 100, 100) : 0;

  const handleConfirm = () => {
    handleConfirmPayment();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenPagarMora = () => setOpenPagarMora(!openPagarMora);

  const handlePayMoraCuota = () => {
    if (!moraSeleccionada) {
      toast.warning("Debe seleccionar una mora cuota");
      return;
    }

    try {
      const dto: PayMoraCuotaDto = {
        moraId: moraSeleccionada.id,
        userId: userId,
      };

      toast.promise(submitPayMoraCuota.mutateAsync(dto), {
        success: "Mora registrada correctamente",
        error: (error) => getApiErrorMessageAxios(error),
        loading: "Registrando pago de mora....",
      });

      setOpenPagarMora(false);
      setMoraSeleccionada(null);
      // submitPayMoraCuota.ion
      query.invalidateQueries({
        queryKey: creditoQkeys.all,
      });

      query.invalidateQueries({
        queryKey: creditoQkeys.specific(cuota.creditoId),
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log("La cuota seleccionada es: ", cuota);

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1.5"
                      >
                        <Percent className="h-3 w-3 text-muted-foreground" />
                        <span>
                          Interés:{" "}
                          <span className="font-medium text-foreground">
                            {formattMonedaGT(moraTotal)}
                          </span>
                        </span>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-56 p-2 space-y-1">
                      {cuota.moras?.length ? (
                        cuota.moras.map((mora) => {
                          const isPagada = mora.estado === EstadoMora.PAGADA;
                          return (
                            <div
                              key={mora.id}
                              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-muted/50"
                            >
                              <div className="flex flex-col text-[11px] leading-tight">
                                <span className="font-medium text-foreground">
                                  {formattMonedaGT(mora.interes)}
                                </span>
                                <span className="text-muted-foreground">
                                  Día {mora.diasMora}
                                </span>
                              </div>

                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => {
                                  setMoraSeleccionada(mora);
                                  setOpenPagarMora(true);
                                }}
                                disabled={isPagada}
                              >
                                <Banknote size={16} />
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="py-2 text-[11px] text-muted-foreground text-center">
                          No hay moras
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
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

      <AdvancedDialogCRM
        open={openPagarMora}
        onOpenChange={setOpenPagarMora}
        title="¿Estás seguro de registrar el pago de esta mora?"
        description="Esta acción no se puede deshacer"
        confirmButton={{
          label: "Confirmar pago",
          disabled: submitPayMoraCuota.isPending,
          onClick: handlePayMoraCuota,
          loading: submitPayMoraCuota.isPending,
          loadingText: "Registrando pago...",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: submitPayMoraCuota.isPending,
          onClick: handleOpenPagarMora,
          variant: "destructive",
        }}
      />
    </Dialog>
  );
}
export default PagoCuotaDialog;
