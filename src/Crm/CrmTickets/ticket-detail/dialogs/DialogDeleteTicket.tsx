import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  isPending,
  onOpenChange,
  onConfirm,
}: DialogDeleteTicketProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Eliminar Ticket #{ticketId}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-500 pb-1">
          Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este ticket?
        </p>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-7 text-xs px-3"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="h-7 text-xs px-3"
          >
            {isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
