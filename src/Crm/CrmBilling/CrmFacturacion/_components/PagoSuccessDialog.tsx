import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeCheck, Download, X } from "lucide-react";
import { Link } from "react-router-dom";

interface PagoSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  facturaId: number;
}

export const PagoSuccessDialog: React.FC<PagoSuccessDialogProps> = ({
  open,
  onClose,
  facturaId,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
      <div className="flex justify-center mt-6">
        <div className="rounded-full p-3 shadow-lg border-4 border-white">
          <div className="bg-emerald-100 p-3 rounded-full animate-pulse">
            <BadgeCheck className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <DialogHeader className="pt-8 px-6 pb-2">
        <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Pago registrado exitosamente
        </DialogTitle>
        <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
          Su transacción ha sido procesada correctamente
        </p>
      </DialogHeader>

      <div className="px-6 py-4">
        <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
          <h3 className="font-medium mb-2 text-gray-800 text-center dark:text-gray-200">
            ¿Desea imprimir su comprobante?
          </h3>
          <p className="text-sm text-gray-600 text-center dark:text-gray-400">
            Puede descargar el comprobante ahora o acceder a él más tarde desde
            su historial.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5" />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200"
          >
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
          <Link
            to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={onClose}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar comprobante
            </Button>
          </Link>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
