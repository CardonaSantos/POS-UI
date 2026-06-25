import type React from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

interface PagoSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  facturaId: number;
}

export const PagoSuccessDialog: React.FC<PagoSuccessDialogProps> = ({
  open,
  onClose,
  facturaId,
}) => {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      preset="success"
      tone="success"
      size="sm"
      title="Pago registrado exitosamente"
      description="La transacción fue procesada correctamente."
      confirmText="Cerrar"
      onConfirm={onClose}
    >
      <AppCard variant="outline" size="sm" className="text-center py-2">
        <AppStack gap="sm" align="center">
          <AppStack gap="xs" align="center">
            <h3 className="text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              ¿Desea imprimir su comprobante?
            </h3>

            <p className="max-w-sm text-xs leading-relaxed text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Puede descargar el comprobante ahora o acceder a él más tarde
              desde el historial de pagos.
            </p>
          </AppStack>

          <AppInline justify="center" className="w-full">
            <AppButton
              asChild
              size="sm"
              width="full"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={onClose}
            >
              <Link to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}>
                Descargar comprobante
              </Link>
            </AppButton>
          </AppInline>
        </AppStack>
      </AppCard>
    </AppConfirmDialog>
  );
};
