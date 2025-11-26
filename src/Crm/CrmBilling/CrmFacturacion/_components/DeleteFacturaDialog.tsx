import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";

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
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-center">Confirmar Eliminación</DialogTitle>
        <DialogDescription className="text-center">
          ¿Está seguro que desea eliminar esta factura? Esta acción no se puede
          deshacer.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Advertencia</AlertTitle>
          <AlertDescription>
            El saldo y estado del cliente se verán afectados en función de su
            saldo actual y su relación con sus facturas.
          </AlertDescription>
        </Alert>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Eliminando...
            </>
          ) : (
            "Eliminar"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
