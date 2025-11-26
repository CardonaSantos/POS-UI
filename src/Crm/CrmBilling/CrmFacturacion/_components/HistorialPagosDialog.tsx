import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import {
  Calendar,
  FileText,
  HistoryIcon,
  Printer,
  Trash2,
  User,
} from "lucide-react";
import {
  getMetodoPagoBadgeColor,
  getMetodoPagoIcon,
} from "../helpers/bagesColorFunctions";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDeletePagoFacturaPago } from "@/Crm/CrmHooks/hooks/delete-pago-factura/useDeletePagoFacturaPago";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useState } from "react";

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

  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // ahora solo recibe facturaId (para invalidar)
  const deletePagoMutation = useDeletePagoFacturaPago(
    selectedPagoId ?? 0,
    facturaId
  );
  const isDeleting = deletePagoMutation.isPending;

  const handleAskDeletePago = (pagoId: number) => {
    setSelectedPagoId(pagoId);
    setOpenDelete(true);
  };

  const handleConfirmDeletePago = async () => {
    if (!selectedPagoId || isDeleting) {
      toast.warning(
        `Revise el pago seleccionado: ${selectedPagoId} is deleting es: ${isDeleting}`
      );
      return;
    }

    console.log("El pago seleccionado es: ", selectedPagoId);
    const promise = deletePagoMutation.mutateAsync(selectedPagoId);

    toast.promise(promise, {
      loading: "Eliminando pago...",
      success: "Pago eliminado",
      error: (err) => getApiErrorMessageAxios(err),
    });

    try {
      await promise;
      setOpenDelete(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error eliminando pago: ", error);
    }
  };

  console.log("los pagos son: ", pagos);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[720px] max-h-[80vh] p-0 flex flex-col overflow-hidden">
          {/* Header compacto */}
          <DialogHeader className="px-4 pt-3 pb-2 space-y-1.5">
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <HistoryIcon className="h-4 w-4 text-blue-600" />
              </div>
              Historial de Pagos
            </DialogTitle>
            <div className="flex items-center justify-between">
              <DialogDescription className="text-xs">
                Factura #{factura.id} • {pagos.length} pago
                {pagos.length !== 1 ? "s" : ""} registrado
                {pagos.length !== 1 ? "s" : ""}
              </DialogDescription>
              <Badge variant="secondary" className="text-xs font-semibold">
                Total: {formattMonedaGT(totalPagado)}
              </Badge>
            </div>
          </DialogHeader>

          <Separator />

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {pagos.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Sin pagos registrados
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    No hay pagos registrados para esta factura. Los pagos
                    aparecerán aquí una vez que se procesen.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {pagos.map((pago: any) => (
                  <Card
                    key={pago.id}
                    className="hover:shadow-sm transition-shadow duration-150"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        {/* Izquierda: info del pago */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <div className="p-1.5 bg-gray-100 dark:bg-zinc-900 rounded-lg">
                              {getMetodoPagoIcon(pago.metodoPago)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {formattMonedaGT(pago.montoPagado)}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={getMetodoPagoBadgeColor(
                                  pago.metodoPago
                                )}
                              >
                                {pago.metodoPago}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formateDateWithMinutes(pago.fechaPago)}
                              </div>

                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {pago?.cobrador?.nombre || "No registrado"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Derecha: acciones */}
                        <div className="flex flex-col items-end gap-2">
                          <Link
                            to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] hover:bg-gray-50"
                            >
                              <Printer className="h-3.5 w-3.5 mr-1" />
                              Imprimir
                            </Button>
                          </Link>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleAskDeletePago(pago.id)}
                            disabled={isDeleting}
                            title="Eliminar pago"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Footer compacto */}
          <div className="flex justify-between items-center px-4 py-2.5">
            <div className="text-[11px] text-gray-500">
              {ultimoPago && (
                <>Último pago: {formateDateWithMinutes(ultimoPago.fechaPago)}</>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              className="min-w-[90px] h-8 text-xs"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AdvancedDialogCRM
        type="warning"
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminación de pago"
        description="¿Estás seguro de eliminar este pago asociado a la factura?"
        confirmButton={{
          label: "Sí, continuar",
          onClick: handleConfirmDeletePago,
          disabled: isDeleting,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => setOpenDelete(false),
          disabled: isDeleting,
        }}
      />
    </>
  );
};
