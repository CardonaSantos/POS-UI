import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Info,
  Save,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import dayjs from "dayjs";

import "dayjs/locale/es";
// import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { cn } from "@/lib/utils";

dayjs.locale("es");
dayjs.extend(localizedFormat);

export interface FacturaToEdit {
  id: number;
  montoPago: number;
  saldoPendiente: number;
  fechaPagada: string | null;
  creadoEn: string;
  fechaPagoEsperada: string;
  estadoFacturaInternet: string; // ajustar al enum correspondiente
  actualizadoEn: string;
  detalleFactura: string; // ajustar campos según tu modelo
  cliente: {
    id: number;
    nombre: string;
    apellidos: string;
    estadoCliente: string; // ajustar al enum correspondiente
  };
}

enum FacturaEstado {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
  ANULADA = "ANULADA",
  PARCIAL = "PARCIAL",
}

function FacturaEdit() {
  const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const facutura_id = searchParams.get("factura");
  console.log("factura_id", facutura_id);

  const [factura, setFactura] = useState<FacturaToEdit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const getFacturaDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/get-factura-to-edit/${facutura_id}`
      );
      if (response.status === 200) {
        setFactura(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFacturaDetails();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    {
      const { name, value } = e.target;

      setFactura((previaData) =>
        previaData
          ? {
              ...previaData,
              [name]: value,
            }
          : previaData
      );
    }
  };

  const handleSelectChange = (value: string) => {
    setFactura((previaData) =>
      previaData
        ? {
            ...previaData,
            estadoFacturaInternet: value,
          }
        : previaData
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case FacturaEstado.PAGADA:
        return "bg-green-100 text-green-800";
      case FacturaEstado.PENDIENTE:
        return "bg-yellow-100 text-yellow-800";
      case FacturaEstado.VENCIDA:
        return "bg-red-100 text-red-800";
      case FacturaEstado.ANULADA:
        return "bg-gray-100 text-gray-800";
      case FacturaEstado.PARCIAL:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isSubmiting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Construimos el payload cuidando las fechas
    const dataSend = {
      montoPago: Number(factura?.montoPago) || 0,
      saldoPendiente: Number(factura?.saldoPendiente) || 0,
      // Si viene fechaPagada válida, la convertimos a ISO, si no, null
      fechaPagada: factura?.fechaPagada
        ? dayjs(factura.fechaPagada).isValid()
          ? dayjs(factura.fechaPagada).toISOString()
          : null
        : null,
      // Igual para fechaPagoEsperada
      fechaPagoEsperada: factura?.fechaPagoEsperada
        ? dayjs(factura.fechaPagoEsperada).isValid()
          ? dayjs(factura.fechaPagoEsperada).toISOString()
          : null
        : null,
      estadoFacturaInternet: factura?.estadoFacturaInternet,
      detalleFactura: factura?.detalleFactura,
    };

    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/facturacion/update-factura/${facutura_id}`,
        dataSend
      );

      // La API devuelve 200 OK (no 201)
      if (response.status === 200) {
        toast.success("Factura actualizada con éxito");
        // navigate(); // vuelve atrás
        navigate(`/crm/cliente/${factura?.cliente.id}?tab=facturacion`);
      } else {
        toast.info("No se pudo actualizar la factura");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la factura");
    } finally {
      // Siempre reactivamos el botón
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransitionCrm titleHeader="Edición" subtitle="" variant="fade-pure">
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            <span className="sr-only">Cargando...</span>
          </div>
        ) : (
          <Card className="w-full max-w-4xl mx-auto shadow-sm">
            <CardContent className="p-4 md:p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Formulario enviado", factura);
                }}
              >
                <div className="space-y-5">
                  {/* Información del cliente */}
                  <section className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Información del Cliente
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormFieldCompact
                        label="Nombre"
                        value={factura?.cliente.nombre}
                        name="nombre"
                        onChange={handleInputChange}
                        disabled
                      />
                      <FormFieldCompact
                        label="Apellidos"
                        value={factura?.cliente.apellidos}
                        name="apellidos"
                        disabled
                        onChange={handleInputChange}
                      />
                    </div>
                  </section>

                  {/* Información de pago */}
                  <section>
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Información de Pago
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormFieldCompact
                        label="Monto Pago"
                        icon={<CreditCard className="h-4 w-4" />}
                        type="number"
                        name="montoPago"
                        value={factura?.montoPago}
                        onChange={handleInputChange}
                      />

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          Saldo Pendiente
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[200px] text-xs">
                                El saldo pendiente se restaurará según el nuevo
                                monto.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>

                        <Input
                          disabled
                          id="saldoPendiente"
                          type="number"
                          value={factura?.saldoPendiente}
                          className="bg-muted/50"
                        />
                      </div>

                      <FormFieldCompact
                        label="Fecha de Pago Esperada"
                        icon={<Calendar className="h-4 w-4" />}
                        type="date"
                        name="fechaPagoEsperada"
                        value={factura?.fechaPagoEsperada.split("T")[0]}
                        onChange={handleInputChange}
                      />

                      <FormFieldCompact
                        label="Fecha Pagada"
                        icon={<Calendar className="h-4 w-4" />}
                        type="date"
                        name="fechaPagada"
                        value={
                          factura?.fechaPagada
                            ? factura?.fechaPagada.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                      />

                      <FormFieldCompact
                        label="Creado en"
                        icon={<Clock className="h-4 w-4" />}
                        type="date"
                        name="creadoEn"
                        value={factura?.creadoEn.split("T")[0]}
                        disabled
                        className="bg-muted/50"
                      />

                      {/* Estado factura */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Estado de Factura
                        </Label>

                        <Select
                          defaultValue={factura?.estadoFacturaInternet}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger
                            id="estadoFactura"
                            className={getStatusColor(
                              factura?.estadoFacturaInternet ?? ""
                            )}
                          >
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Estados</SelectLabel>
                              {Object.values(FacturaEstado).map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  {estado}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  {/* Detalle factura */}
                  <section className="space-y-1">
                    <Label className="text-xs font-medium flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Detalle de Factura
                    </Label>
                    <Textarea
                      rows={4}
                      className="resize-none"
                      name="detalleFactura"
                      value={factura?.detalleFactura}
                      onChange={handleInputChange}
                    />
                  </section>

                  {/* Footer */}
                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button
                      variant="default"
                      className="flex items-center gap-2"
                      onClick={() => setOpenConfirm(true)}
                    >
                      <Save className="h-4 w-4" />
                      Confirmar Cambios
                    </Button>
                  </CardFooter>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Dialogo */}
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent className="sm:max-w-[370px]">
            <DialogHeader>
              <DialogTitle className="text-center text-base">
                Confirmar edición de factura
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                ¿Está seguro que desea aplicar estos cambios?
              </DialogDescription>
            </DialogHeader>

            <div className="py-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Advertencia</AlertTitle>
                <AlertDescription className="text-xs">
                  El saldo pendiente y estado del cliente serán afectados.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpenConfirm(false)}
                disabled={isSubmiting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmiting}
              >
                Confirmar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransitionCrm>
  );
}

export default FacturaEdit;
function FormFieldCompact({ label, icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-1">
        {icon}
        {label}
      </Label>
      <Input {...props} className={cn("text-sm", props.className)} />
    </div>
  );
}
