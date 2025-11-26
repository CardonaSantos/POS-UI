import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Save, X } from "lucide-react";

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
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
      <div className="flex justify-center mt-6">
        <div className="rounded-full p-3 shadow-lg border-4 border-white">
          <div className="bg-amber-100 p-3 rounded-full animate-pulse">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      <DialogHeader className="pt-8 px-6 pb-2">
        <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Confirmación de Pago
        </DialogTitle>
        <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
          Por favor revise los datos antes de continuar
        </p>
      </DialogHeader>

      <div className="px-6 py-4">
        <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
          <h3 className="font-medium mb-2 text-gray-800 text-center dark:text-gray-200">
            ¿Estás seguro de que deseas registrar este pago con estos datos?
          </h3>
          <p className="text-sm text-gray-600 text-center dark:text-gray-400">
            Por favor, revisa cuidadosamente los datos antes de proceder.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5" />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200"
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Registrar Pago
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
