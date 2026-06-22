"use client";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

interface DialogDeleteTicketProps {
  open: boolean;
  ticketId: number;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DialogDeleteTicket({
  open,
  ticketId,
  isPending = false,
  onOpenChange,
  onConfirm,
}: DialogDeleteTicketProps) {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      preset="delete"
      tone="danger"
      title={`Eliminar ticket #${ticketId}`}
      description="Esta acción no se puede deshacer. El ticket será eliminado permanentemente del historial de soporte."
      confirmText="Eliminar"
      cancelText="Cancelar"
      loadingText="Eliminando..."
      isLoading={isPending}
      preventClose={isPending}
      onConfirm={onConfirm}
    />
  );
}
