"use client";
import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Coins, ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FrecuenciaPago,
  InteresTipo,
} from "@/Crm/features/credito/credito-interfaces";
import { CreditoFormValues } from "./schema.zod";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

interface CuotasPreviewProps {
  formValues: Partial<CreditoFormValues>;
}

interface CuotaGenerada {
  numero: number;
  fechaVencimiento: Date;
  montoCapital: number;
  montoInteres: number;
  montoTotal: number;
  saldoRestante: number;
}

function getDiasPorFrecuencia(
  frecuencia: FrecuenciaPago,
  intervaloDias: number,
): number {
  switch (frecuencia) {
    case FrecuenciaPago.SEMANAL:
      return 7;
    case FrecuenciaPago.QUINCENAL:
      return 15;
    case FrecuenciaPago.MENSUAL:
      return 30;
    case FrecuenciaPago.CUSTOM:
      return intervaloDias || 30;
    default:
      return 30;
  }
}

function calcularCuotasAutomaticas(
  montoCapital: number,
  interesPorcentaje: number,
  interesTipo: InteresTipo,
  plazoCuotas: number,
  fechaInicio: Date,
  frecuencia: FrecuenciaPago,
  intervaloDias: number,
): CuotaGenerada[] {
  const cuotas: CuotaGenerada[] = [];
  const dias = getDiasPorFrecuencia(frecuencia, intervaloDias);
  const capitalPorCuota = montoCapital / plazoCuotas;

  let saldoRestante = montoCapital;

  for (let i = 1; i <= plazoCuotas; i++) {
    let montoInteres: number;

    if (interesTipo === InteresTipo.FIJO) {
      // Interés fijo: se calcula sobre el capital total
      montoInteres = (montoCapital * interesPorcentaje) / 100 / plazoCuotas;
    } else {
      // Sobre saldo: se calcula sobre el saldo restante
      montoInteres = (saldoRestante * interesPorcentaje) / 100;
    }

    const montoCapitalCuota = capitalPorCuota;
    saldoRestante -= montoCapitalCuota;

    cuotas.push({
      numero: i,
      fechaVencimiento: addDays(fechaInicio, dias * i),
      montoCapital: montoCapitalCuota,
      montoInteres: montoInteres,
      montoTotal: montoCapitalCuota + montoInteres,
      saldoRestante: Math.max(0, saldoRestante),
    });
  }

  return cuotas;
}

function formatMoney(amount: number): string {
  return formattMonedaGT(amount);
}

export function CuotasPreview({ formValues }: CuotasPreviewProps) {
  const cuotas = useMemo(() => {
    const {
      tipoGeneracionCuotas,
      montoCapital,
      interesPorcentaje,
      interesTipo,
      plazoCuotas,
      fechaInicio,
      frecuencia,
      intervaloDias,
      cuotasCustom,
    } = formValues;

    // Si es manual, mapear las cuotas custom
    if (
      tipoGeneracionCuotas === "CUSTOM" &&
      cuotasCustom &&
      cuotasCustom.length > 0
    ) {
      let saldoRestante = cuotasCustom.reduce(
        (acc, c) => acc + (Number(c.montoCapital) || 0),
        0,
      );

      return cuotasCustom.map((c, index) => {
        const capital = Number(c.montoCapital) || 0;
        const interes = Number(c.montoInteres) || 0;
        saldoRestante -= capital;

        return {
          numero: c.numeroCuota || index + 1,
          fechaVencimiento: c.fechaVencimiento || new Date(),
          montoCapital: capital,
          montoInteres: interes,
          montoTotal: capital + interes,
          saldoRestante: Math.max(0, saldoRestante),
        };
      });
    }

    // Validar campos requeridos para generación automática
    const capitalOriginal = Number(montoCapital) || 0;
    const enganche = Number(formValues.engancheMonto) || 0;

    // ✅ capital real a financiar
    const capitalFinanciado = Math.max(capitalOriginal - enganche, 0);

    const interes = Number(interesPorcentaje) || 0;
    const cuotasNum = plazoCuotas || 0;

    if (capitalFinanciado <= 0 || cuotasNum <= 0 || !fechaInicio) {
      return [];
    }

    return calcularCuotasAutomaticas(
      capitalFinanciado,
      interes,
      interesTipo || InteresTipo.FIJO,
      cuotasNum,
      fechaInicio,
      frecuencia || FrecuenciaPago.MENSUAL,
      intervaloDias || 30,
    );
  }, [formValues]);

  const totales = useMemo(() => {
    return cuotas.reduce(
      (acc, c) => ({
        capital: acc.capital + c.montoCapital,
        interes: acc.interes + c.montoInteres,
        total: acc.total + c.montoTotal,
      }),
      { capital: 0, interes: 0, total: 0 },
    );
  }, [cuotas]);

  const engancheMonto = Number(formValues.engancheMonto) || 0;

  if (cuotas.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ListIcon className="size-4" />
          <span>Vista previa de cuotas</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Completa los campos para ver las cuotas generadas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ListIcon className="size-4" />
        <span>Vista previa ({cuotas.length} cuotas)</span>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-muted/30 p-2 text-xs">
        <div className="text-center">
          <p className="text-muted-foreground">Capital</p>
          <p className="font-medium">{formatMoney(totales.capital)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Interés</p>
          <p className="font-medium">{formatMoney(totales.interes)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Total</p>
          <p className="font-semibold">{formatMoney(totales.total)}</p>
        </div>
      </div>

      {/* Enganche */}
      {engancheMonto > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-green-50 p-2 text-xs dark:bg-green-950/30">
          <div className="flex items-center gap-1.5">
            <Coins className="size-3.5 text-green-600" />
            <span>Enganche</span>
          </div>
          <div className="text-right">
            <span className="font-medium text-green-700 dark:text-green-400">
              {formatMoney(engancheMonto)}
            </span>
            {formValues.engancheFecha && (
              <span className="ml-1 text-muted-foreground">
                ({format(formValues.engancheFecha, "dd/MM/yy", { locale: es })})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Lista de cuotas */}
      <div className="max-h-[400px] space-y-1.5 overflow-y-auto pr-1">
        {cuotas.map((cuota) => (
          <div
            key={cuota.numero}
            className="flex items-center justify-between rounded border border-border bg-background p-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium",
                )}
              >
                {cuota.numero}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="size-3" />
                <span>
                  {format(cuota.fechaVencimiento, "dd MMM yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatMoney(cuota.montoTotal)}</p>
              <p className="text-[10px] text-muted-foreground">
                C: {formatMoney(cuota.montoCapital)} / I:
                {formatMoney(cuota.montoInteres)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
