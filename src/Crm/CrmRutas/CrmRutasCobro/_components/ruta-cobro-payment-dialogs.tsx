"use client";

import { Link } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  Building,
  Coins,
  CreditCard,
  Download,
  FileText,
  Save,
  Wallet,
} from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  METODO_PAGO_OPTIONS,
  MetodoPagoFacturaInternet,
  type PagoRutaFormState,
} from "./ruta-cobro.helpers";

interface RutaCobroPaymentDialogProps {
  open: boolean;
  form: PagoRutaFormState;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onPatch: (patch: Partial<PagoRutaFormState>) => void;
  onContinue: () => void;
}

interface RutaCobroConfirmPaymentDialogProps {
  open: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;

  onCancel: () => void;
}

interface RutaCobroPaymentSuccessDialogProps {
  open: boolean;
  facturaId: number | null;
  onOpenChange: (open: boolean) => void;
}

function PaymentMethodOptionIcon({
  metodo,
}: {
  metodo: MetodoPagoFacturaInternet;
}) {
  if (metodo === MetodoPagoFacturaInternet.EFECTIVO) {
    return <Coins size={13} />;
  }

  if (metodo === MetodoPagoFacturaInternet.DEPOSITO) {
    return <Building size={13} />;
  }

  if (metodo === MetodoPagoFacturaInternet.TARJETA) {
    return <CreditCard size={13} />;
  }

  if (metodo === MetodoPagoFacturaInternet.PAYPAL) {
    return <FileText size={13} />;
  }

  return <Wallet size={13} />;
}

function SectionNotice({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.28] p-3">
      <AppInline align="start" gap="xs">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
            {title}
          </p>

          {description ? (
            <p className="mt-0.5 text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {description}
            </p>
          ) : null}
        </div>
      </AppInline>
    </div>
  );
}

export function RutaCobroPaymentDialog({
  open,
  form,
  isSubmitting,
  onOpenChange,
  onPatch,
  onContinue,
}: RutaCobroPaymentDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[620px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline align="center" gap="xs">
              <Coins size={16} />
              <span>Registro de pago</span>
            </AppInline>
          </AppDialogTitle>

          <AppDialogDescription>
            Ingresa los datos del pago antes de confirmar el registro.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppStack gap="md">
          <SectionNotice
            icon={<AlertCircle size={14} />}
            title="Datos del pago"
            description="Verifica el monto, método de pago y número de boleta si aplica."
          />

          <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
            <AppField
              label="Monto a pagar"
              required
              description="Monto que se registrará como pago."
            >
              {(field) => (
                <AppInput
                  id={field.id}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.montoPagado || ""}
                  onChange={(event) =>
                    onPatch({
                      montoPagado:
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                    })
                  }
                  placeholder="0.00"
                  size="xs"
                  fieldWidth="full"
                  leftIcon={
                    <span className="text-[11px] font-semibold">Q</span>
                  }
                  disabled={isSubmitting}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                  required
                />
              )}
            </AppField>

            <AppField
              label="Método de pago"
              required
              description="Forma en que el cliente realizó el pago."
            >
              {(field) => (
                <AppSingleSelect<MetodoPagoFacturaInternet>
                  inputId={field.id}
                  value={form.metodoPago}
                  options={METODO_PAGO_OPTIONS}
                  onChange={(value) =>
                    onPatch({
                      metodoPago: value ?? MetodoPagoFacturaInternet.EFECTIVO,
                    })
                  }
                  placeholder="Seleccione un método"
                  size="xs"
                  fieldWidth="full"
                  isDisabled={isSubmitting}
                  invalid={field.invalid}
                  isClearable={false}
                  portalToBody
                  menuPosition="fixed"
                  menuPlacement="auto"
                  menuShouldScrollIntoView={false}
                />
              )}
            </AppField>

            {form.metodoPago === MetodoPagoFacturaInternet.DEPOSITO ? (
              <div className="sm:col-span-2">
                <AppField
                  label="Número de boleta"
                  required
                  description="Requerido cuando el método de pago es depósito."
                >
                  {(field) => (
                    <AppInput
                      id={field.id}
                      value={form.numeroBoleta}
                      onChange={(event) =>
                        onPatch({ numeroBoleta: event.target.value })
                      }
                      placeholder="Ingrese el número de boleta"
                      size="xs"
                      fieldWidth="full"
                      leftIcon={<Building size={13} />}
                      disabled={isSubmitting}
                      aria-invalid={field.invalid}
                      aria-describedby={field.describedBy}
                      autoComplete="off"
                      required
                    />
                  )}
                </AppField>
              </div>
            ) : null}
          </AppGrid>

          <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-3">
            <AppInline align="center" gap="xs" wrap>
              <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Método seleccionado:
              </span>

              <span className="inline-flex items-center gap-1 rounded-[var(--app-radius-full)] bg-[hsl(var(--app-muted,var(--muted)))] px-2 py-1 text-[11px] font-medium">
                <PaymentMethodOptionIcon metodo={form.metodoPago} />
                {
                  METODO_PAGO_OPTIONS.find(
                    (option) => option.value === form.metodoPago,
                  )?.label
                }
              </span>
            </AppInline>
          </div>

          <AppInline align="center" justify="end" gap="xs">
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </AppButton>

            <AppButton
              type="button"
              variant="primary"
              size="xs"
              width="auto"
              leftIcon={<Save size={13} />}
              disabled={isSubmitting}
              onClick={onContinue}
            >
              Registrar pago
            </AppButton>
          </AppInline>
        </AppStack>
      </AppDialogContent>
    </AppDialog>
  );
}

export function RutaCobroConfirmPaymentDialog({
  open,
  isSubmitting,
  onOpenChange,
  onConfirm,
  onCancel,
}: RutaCobroConfirmPaymentDialogProps) {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      preset="warning"
      tone="warning"
      size="sm"
      title="Confirmación de pago"
      description="¿Estás seguro de que deseas registrar este pago con estos datos?"
      confirmText="Registrar pago"
      cancelText="Cancelar"
      loadingText="Procesando..."
      isLoading={isSubmitting}
      preventClose={isSubmitting}
      closeOnConfirm={false}
      footerAlign="between"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <SectionNotice
        icon={<AlertCircle size={14} />}
        title="Revisión requerida"
        description="Revisa cuidadosamente los datos antes de proceder. Esta acción registrará el pago en la factura seleccionada."
      />
    </AppConfirmDialog>
  );
}

export function RutaCobroPaymentSuccessDialog({
  open,
  facturaId,
  onOpenChange,
}: RutaCobroPaymentSuccessDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[460px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline align="center" gap="xs">
              <BadgeCheck
                size={16}
                className="text-[hsl(var(--app-success))]"
              />
              <span>Pago registrado exitosamente</span>
            </AppInline>
          </AppDialogTitle>

          <AppDialogDescription>
            El pago fue registrado correctamente. Puede imprimir el comprobante
            ahora o permanecer en la ruta.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppStack gap="md">
          <SectionNotice
            icon={<BadgeCheck size={14} />}
            title="Comprobante disponible"
            description="Puede abrir el comprobante del pago en una nueva vista."
          />

          <AppInline align="center" justify="end" gap="xs" wrap>
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              onClick={() => onOpenChange(false)}
            >
              Mantenerse
            </AppButton>

            {facturaId ? (
              <AppButton
                type="button"
                variant="primary"
                size="xs"
                width="auto"
                leftIcon={<Download size={13} />}
                asChild
                onClick={() => onOpenChange(false)}
              >
                <Link to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}>
                  Conseguir comprobante
                </Link>
              </AppButton>
            ) : null}
          </AppInline>
        </AppStack>
      </AppDialogContent>
    </AppDialog>
  );
}
