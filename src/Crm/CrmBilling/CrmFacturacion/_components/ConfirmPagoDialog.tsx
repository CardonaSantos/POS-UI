import type React from "react";

import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

interface ConfirmPagoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const ConfirmPagoDialog: React.FC<ConfirmPagoDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      preset="warning"
      tone="warning"
      size="sm"
      title="Confirmación de pago"
      description="Revise los datos antes de continuar."
      confirmText="Registrar pago"
      cancelText="Cancelar"
      loadingText="Procesando..."
      isLoading={isSubmitting}
      preventClose={isSubmitting}
      closeOnConfirm={false}
      onConfirm={onConfirm}
    ></AppConfirmDialog>
  );
};
