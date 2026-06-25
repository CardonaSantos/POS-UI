import type React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Building,
  Calendar,
  Coins,
  CreditCard,
  FileText,
  HistoryIcon,
  Printer,
  Trash2,
  User,
  Wallet,
} from "lucide-react";

import type { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";
import { MetodoPagoFacturaInternet } from "@/Crm/features/factura-internet/factura-to-pay";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
} from "@/components/app/handlers";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useDeletePagoFacturaPago } from "@/Crm/CrmHooks/hooks/delete-pago-factura/useDeletePagoFacturaPago";

type PagoFacturaItem = NonNullable<FacturaInternetToPay["pagos"]>[number];

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface HistorialPagosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factura: FacturaInternetToPay;
  facturaId: number;
  totalPagado: number;
}

export const HistorialPagosDialog: React.FC<HistorialPagosDialogProps> = ({
  open,
  onOpenChange,
  factura,
  facturaId,
  totalPagado,
}) => {
  const pagos = factura.pagos ?? [];
  const ultimoPago = pagos[pagos.length - 1];

  const deletePagoDialog = useAppConfirmHandler<PagoFacturaItem>();

  const deletePagoMutation = useDeletePagoFacturaPago(
    deletePagoDialog.target?.id ?? 0,
    facturaId,
  );

  const deletePagoAction = useAppAsyncAction(
    async (pago: PagoFacturaItem) => {
      const promise = deletePagoMutation.mutateAsync(pago.id);

      toast.promise(promise, {
        loading: "Eliminando pago...",
        success: "Pago eliminado",
        error: (err) => getApiErrorMessageAxios(err),
      });

      await promise;
    },
    {
      preventConcurrent: true,
      onSuccess: () => {
        deletePagoDialog.close();
      },
    },
  );

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange}>
        <AppDialogContent
          size="2xl"
          viewport="default"
          padding="none"
          showCloseButton
        >
          <AppDialogHeader divider className="px-4 py-3">
            <AppDialogTitle>
              <AppInline gap="xs" align="center" className="min-w-0">
                <HistoryIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">Historial de pagos</span>
              </AppInline>
            </AppDialogTitle>

            <AppDialogDescription asChild>
              <AppInline gap="xs" align="center" wrap>
                <span>
                  Factura #{factura.id} · {pagos.length} pago
                  {pagos.length !== 1 ? "s" : ""} registrado
                  {pagos.length !== 1 ? "s" : ""}
                </span>

                <AppBadge size="xs" tone="success" appearance="soft">
                  Total: {formattMonedaGT(totalPagado)}
                </AppBadge>
              </AppInline>
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody padding="sm">
            {pagos.length === 0 ? (
              <AppEmptyState
                preset="empty"
                size="sm"
                variant="plain"
                title="Sin pagos registrados"
                description="No hay pagos registrados para esta factura. Los pagos aparecerán aquí una vez que se procesen."
                icon={<FileText className="h-6 w-6" />}
              />
            ) : (
              <AppStack gap="xs">
                {pagos.map((pago) => (
                  <PagoHistorialItem
                    key={pago.id}
                    pago={pago}
                    facturaId={facturaId}
                    isDeleting={deletePagoAction.isLoading}
                    onDelete={() => deletePagoDialog.open(pago)}
                  />
                ))}
              </AppStack>
            )}
          </AppDialogBody>

          <AppDialogFooter
            divider
            className="px-4 py-3 sm:items-center sm:justify-between"
          >
            <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {ultimoPago
                ? `Último pago: ${formateDateWithMinutes(ultimoPago.fechaPago)}`
                : "Sin pagos registrados"}
            </span>

            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </AppButton>
          </AppDialogFooter>
        </AppDialogContent>
      </AppDialog>

      <AppConfirmDialog
        open={deletePagoDialog.isOpen}
        onOpenChange={deletePagoDialog.setOpen}
        preset="delete"
        tone="danger"
        title="Eliminar pago"
        description="¿Está seguro de eliminar este pago asociado a la factura?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={deletePagoAction.isLoading}
        preventClose={deletePagoAction.isLoading}
        closeOnConfirm={false}
        onConfirm={() =>
          deletePagoDialog.confirm((target) => {
            deletePagoAction.run(target);
          })
        }
      >
        {deletePagoDialog.target ? (
          <AppCard variant="outline" size="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center" justify="between">
                <span className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  Monto
                </span>

                <span className="text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                  {formattMonedaGT(deletePagoDialog.target.montoPagado)}
                </span>
              </AppInline>

              <AppInline gap="xs" align="center" justify="between">
                <span className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  Método
                </span>

                <AppBadge
                  size="xs"
                  tone={getMetodoPagoTone(deletePagoDialog.target.metodoPago)}
                  appearance="soft"
                >
                  {deletePagoDialog.target.metodoPago}
                </AppBadge>
              </AppInline>
            </AppStack>
          </AppCard>
        ) : null}
      </AppConfirmDialog>
    </>
  );
};

function PagoHistorialItem({
  pago,
  facturaId,
  isDeleting,
  onDelete,
}: {
  pago: PagoFacturaItem;
  facturaId: number;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  const metodoPagoMeta = getMetodoPagoMeta(pago.metodoPago);

  return (
    <AppCard variant="outline" size="xs" className="p-2">
      <AppInline gap="sm" align="center" justify="between" className="min-w-0">
        <AppStack gap="none" className="min-w-0">
          <AppInline gap="xs" align="center" wrap>
            <span className="text-sm font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
              {formattMonedaGT(pago.montoPagado)}
            </span>

            <AppBadge size="xs" tone={metodoPagoMeta.tone} appearance="soft">
              {pago.metodoPago}
            </AppBadge>
          </AppInline>

          <AppInline
            gap="sm"
            align="center"
            wrap
            className="mt-1 text-[11px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          >
            <AppInline gap="xs" align="center">
              <Calendar className="h-3 w-3" />
              <span>{formateDateWithMinutes(pago.fechaPago)}</span>
            </AppInline>

            <AppInline gap="xs" align="center">
              <User className="h-3 w-3" />
              <span>{pago?.cobrador?.nombre || "No registrado"}</span>
            </AppInline>
          </AppInline>
        </AppStack>

        <AppInline gap="xs" align="center" className="shrink-0">
          <AppButton
            asChild
            size="xs"
            variant="ghost"
            title="Imprimir pago"
            aria-label="Imprimir pago"
            className="h-7 w-7 px-0"
          >
            <Link to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}>
              <Printer className="h-3.5 w-3.5" />
            </Link>
          </AppButton>

          <AppButton
            type="button"
            size="xs"
            variant="ghost"
            title="Eliminar pago"
            aria-label="Eliminar pago"
            disabled={isDeleting}
            onClick={onDelete}
            className="h-7 w-7 px-0 text-[hsl(var(--app-danger,var(--destructive)))]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </AppButton>
        </AppInline>
      </AppInline>
    </AppCard>
  );
}

function getMetodoPagoMeta(metodoPago: MetodoPagoFacturaInternet | string): {
  tone: AppBadgeTone;
  icon: React.ComponentType<{ className?: string }>;
} {
  const normalized = String(metodoPago).toUpperCase();

  if (normalized.includes("EFECTIVO")) {
    return {
      tone: "success",
      icon: Coins,
    };
  }

  if (normalized.includes("DEPOSITO")) {
    return {
      tone: "info",
      icon: Building,
    };
  }

  if (normalized.includes("TARJETA")) {
    return {
      tone: "primary",
      icon: CreditCard,
    };
  }

  return {
    tone: "neutral",
    icon: Wallet,
  };
}

function getMetodoPagoTone(metodoPago: MetodoPagoFacturaInternet | string) {
  return getMetodoPagoMeta(metodoPago).tone;
}
