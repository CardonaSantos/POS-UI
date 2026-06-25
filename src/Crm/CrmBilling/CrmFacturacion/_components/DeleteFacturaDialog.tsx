import type React from "react";
import { AlertCircle } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

interface DeleteFacturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteFacturaDialog: React.FC<DeleteFacturaDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}) => {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      preset="delete"
      tone="danger"
      size="sm"
      title="Confirmar eliminación"
      description="¿Está seguro que desea eliminar esta factura? Esta acción no se puede deshacer."
      confirmText="Eliminar"
      cancelText="Cancelar"
      loadingText="Eliminando..."
      isLoading={isDeleting}
      preventClose={isDeleting}
      closeOnConfirm={false}
      onConfirm={onConfirm}
    >
      <AppAlert
        tone="danger"
        variant="soft"
        title="Advertencia"
        description="El saldo y estado del cliente se verán afectados en función de su saldo actual y su relación con sus facturas."
        icon={<AlertCircle className="h-4 w-4" />}
      />
    </AppConfirmDialog>
  );
};
