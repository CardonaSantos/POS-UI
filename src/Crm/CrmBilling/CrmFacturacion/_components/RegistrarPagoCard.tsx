import type React from "react";
import dayjs from "dayjs";
import { CreditCard, Receipt, Save } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  FacturaInternetToPay,
  MetodoPagoFacturaInternet,
} from "@/Crm/features/factura-internet/factura-to-pay";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { NuevoPagoFormValues } from "../types/nuevoPago.interface";

interface RegistrarPagoCardProps {
  factura: FacturaInternetToPay;
  nuevoPago: NuevoPagoFormValues;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMetodoPagoChange: (value: MetodoPagoFacturaInternet) => void;
  onFechaPagoChange: (value: string) => void;
  onOpenConfirm: () => void;
  isSubmitting: boolean;
}

const metodoPagoOptions = [
  { value: MetodoPagoFacturaInternet.EFECTIVO, label: "Efectivo" },
  { value: MetodoPagoFacturaInternet.DEPOSITO, label: "Depósito" },
  { value: MetodoPagoFacturaInternet.TARJETA, label: "Tarjeta" },
  { value: MetodoPagoFacturaInternet.OTRO, label: "Otro" },
];

export const RegistrarPagoCard: React.FC<RegistrarPagoCardProps> = ({
  factura,
  nuevoPago,
  onInputChange,
  onMetodoPagoChange,
  onFechaPagoChange,
  onOpenConfirm,
  isSubmitting,
}) => {
  const saldo = factura.saldoPendiente ?? factura.montoPago ?? 0;

  const isDisabled =
    isSubmitting || !nuevoPago.montoPagado || nuevoPago.montoPagado <= 0;

  const fechaPagoValue = normalizeDateInputValue(nuevoPago.fechaPago);

  return (
    <AppCard
      className="print:hidden"
      size="xs"
      variant="outline"
      title="Registrar pago"
      footer={
        <AppInline justify="end" className="w-full">
          <AppButton
            type="button"
            size="xs"
            leftIcon={<Save className="h-3.5 w-3.5" />}
            loading={isSubmitting}
            loadingText="Procesando..."
            disabled={isDisabled}
            onClick={onOpenConfirm}
          >
            Registrar
          </AppButton>
        </AppInline>
      }
    >
      <AppStack gap="xs">
        <p className="text-[11px] leading-tight text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Ingrese los datos del pago antes de confirmar.
        </p>

        <AppGrid cols={{ base: 1, md: 2, lg: 3 }} gap="xs">
          <AppField
            label="Monto a pagar"
            required
            hint={`Saldo pendiente: ${formattMonedaGT(saldo)}`}
          >
            {(field) => (
              <AppInput
                id={field.id}
                name="montoPagado"
                type="number"
                step="0.01"
                min={0.01}
                max={saldo}
                size="sm"
                value={nuevoPago.montoPagado || ""}
                onChange={onInputChange}
                leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                disabled={isSubmitting}
                required
              />
            )}
          </AppField>

          <AppField label="Método de pago" required>
            {(field) => (
              <AppSingleSelect<MetodoPagoFacturaInternet>
                inputId={field.id}
                value={nuevoPago.metodoPago}
                options={metodoPagoOptions}
                onChange={(value) => {
                  if (!value) return;
                  onMetodoPagoChange(value);
                }}
                placeholder="Seleccione un método"
                size="sm"
                invalid={field.invalid}
                isDisabled={isSubmitting}
              />
            )}
          </AppField>

          <AppField label="Fecha de pago" required>
            <AppDatePicker
              mode="single"
              value={fechaPagoValue}
              onChange={(value) => {
                if (!value) return;
                onFechaPagoChange(value);
              }}
              outputFormat="date"
              size="sm"
              disabled={isSubmitting}
            />
          </AppField>

          {nuevoPago.metodoPago === MetodoPagoFacturaInternet.DEPOSITO ? (
            <div className="md:col-span-2 lg:col-span-1">
              <AppField label="No. boleta" required>
                {(field) => (
                  <AppInput
                    id={field.id}
                    name="numeroBoleta"
                    size="sm"
                    value={nuevoPago.numeroBoleta || ""}
                    onChange={onInputChange}
                    placeholder="Ingrese número de boleta"
                    leftIcon={<Receipt className="h-3.5 w-3.5" />}
                    invalid={field.invalid}
                    aria-invalid={field.invalid}
                    aria-describedby={field.describedBy}
                    disabled={isSubmitting}
                    required
                  />
                )}
              </AppField>
            </div>
          ) : null}
        </AppGrid>
      </AppStack>
    </AppCard>
  );
};

function normalizeDateInputValue(value: Date | string | null | undefined) {
  if (!value) return dayjs().format("YYYY-MM-DD");

  const date = dayjs(value);

  if (!date.isValid()) return dayjs().format("YYYY-MM-DD");

  return date.format("YYYY-MM-DD");
}
